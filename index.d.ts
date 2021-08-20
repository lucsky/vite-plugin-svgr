import type { FunctionComponent, SVGProps } from 'react';

declare module '*.svg?component' {
    const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    export default ReactComponent;
}

interface SvgrPluginOptions {
    keepEmittedAssets?: boolean;
}

export default function svgrPlugin(options?: SvgrPluginOptions): Plugin;
