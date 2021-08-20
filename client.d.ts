declare module '*.svg?component' {
    import type { FunctionComponent, SVGProps } from 'react';
    const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    export default ReactComponent;
}
