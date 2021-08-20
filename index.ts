import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

import type { Plugin } from 'vite';

// Use require to prevent missing declaration file typescript errors
const svgr = require('@svgr/core');

export default function svgrPlugin(): Plugin {
    const transformed: Array<string> = [];

    return {
        name: 'vite:svgr',

        async transform(code, id) {
            if (!id.endsWith('.svg?component')) {
                return null;
            }

            const svgDataPath = id.replace('?component', '');
            const svgData = await fs.promises.readFile(svgDataPath, 'utf8');
            const componentCode = await svgr(svgData, {}, { filePath: svgDataPath });
            const component = await esbuild.transform(componentCode, { loader: 'jsx' });

            transformed.push(id);

            return { code: component.code, map: null };
        },

        generateBundle(config, bundle) {
            // Discard transformed SVG assets from bundle so they are not emitted
            const patterns = transformed.map((id) => {
                const basename = path.basename(id, '.svg?component');
                return fileNamePatternToRegExp(config.assetFileNames, basename);
            });

            for (const [key, bundleEntry] of Object.entries(bundle)) {
                const { type, fileName } = bundleEntry;
                if (type === 'asset' && fileName.endsWith('.svg') && patterns.some((p) => fileName.match(p))) {
                    delete bundle[key];
                }
            }
        }
    };
}

function fileNamePatternToRegExp(pattern: string, name: string) {
    const regexp = pattern
        .replace('[name]', name)
        .replace('[hash]', '[a-z0-9]+')
        .replace('[ext]', 'svg')
        .replace(/\./g, '\\.');
    return new RegExp(regexp);
}
