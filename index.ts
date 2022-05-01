import fs from 'fs';
import { transform } from 'esbuild';

import type { Plugin } from 'vite';

// Use require to prevent missing declaration file typescript errors
// This can be turned into a regular import when @svgr/core has proper
// typings (see https://github.com/gregberge/svgr/pull/555)
const svgr = require('@svgr/core').default;

interface SvgrPluginOptions {
    // Emit SVG assets to the production bundle even if it has been
    // imported as a component.
    keepEmittedAssets?: boolean;

    // Make the ?component suffix optional
    componentSuffixOptional?: boolean;

    // Options passed directly to `@svgr/core`
    // (see https://react-svgr.com/docs/options)
    svgrOptions?: SVGROptions;
}

interface SVGROptions {
    icon?: boolean;
    dimensions?: boolean;
    expandProps?: 'start' | 'end' | false;
    svgo?: boolean;
    ref?: boolean;
    memo?: boolean;
    replaceAttrValues?: Record<string, string>;
    svgProps?: Record<string, string>;
    titleProp?: boolean;
}

export default function svgrPlugin(options: SvgrPluginOptions = {}): Plugin {
    const transformed: Array<string> = [];

    return {
        name: 'vite:svgr',

        async transform(code, id) {
            if (
                id.indexOf('.svg') === -1 ||
                (id.indexOf('.svg?component') && !options?.componentSuffixOptional) ||
                (id.indexOf('.svg?url') === -1 && options?.componentSuffixOptional)
            ) {
                return null;
            }

            const globalSvgrOptions = options?.svgrOptions ?? {};
            let svgrOptions = { ...globalSvgrOptions };
            let svgDataPath = id;

            if (id.indexOf('?') > -1) {
                const queryIndex = id.indexOf(options?.componentSuffixOptional ? '?' : '?component');
                const query = id.substr(queryIndex + 1);
                const specificSvgrOptions = svgrOptionsFromQuery(query);
                svgrOptions = { ...globalSvgrOptions, ...specificSvgrOptions };
                svgDataPath = id.substr(0, queryIndex);
            }

            const svgData = await fs.promises.readFile(svgDataPath, 'utf8');

            const componentCode = await svgr(svgData, svgrOptions, { filePath: svgDataPath });
            const component = await transform(componentCode, { loader: 'jsx' });

            transformed.push(id);

            return { code: component.code, map: null };
        },

        generateBundle(config, bundle) {
            if (options.keepEmittedAssets) {
                return;
            }

            // Discard transformed SVG assets from bundle so they are not emitted
            for (const [key, bundleEntry] of Object.entries(bundle)) {
                const { type, name } = bundleEntry;
                if (
                    type === 'asset' &&
                    name?.endsWith('.svg') &&
                    transformed.findIndex((id) => id.includes(name)) >= 0
                ) {
                    delete bundle[key];
                }
            }
        }
    };
}

export function svgrOptionsFromQuery(query: string) {
    const options: SVGROptions = {};
    const pairs = query.split('&');

    pairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        switch (key) {
            case 'ref':
            case 'icon':
            case 'svgo':
            case 'memo':
            case 'titleProp':
            case 'dimensions': {
                if (!value || value === 'true') {
                    options[key] = true;
                } else if (value === 'false') {
                    options[key] = false;
                } else {
                    throw new Error(`Invalid boolean option value: ${key} = "${value}"`);
                }
                break;
            }

            case 'expandProps': {
                if (value === 'start' || value === 'end') {
                    options[key] = value;
                } else if (value === 'false') {
                    options[key] = false;
                } else {
                    throw new Error(`Invalid expandProps option value: "${value}"`);
                }
                break;
            }

            case 'svgProps':
            case 'replaceAttrValues': {
                if (!value) {
                    throw new Error(`Missing "${key}" k/v pair`);
                }

                const [k, v] = value.split(':');
                if (!v) {
                    throw new Error(`Missing "${key}" value`);
                }

                options[key] ??= {};
                options[key]![k] = v;
                break;
            }

            case 'component': {
                break;
            }

            default: {
                throw new Error(`Invalid svgr option: "${key}"`);
            }
        }
    });

    return options;
}
