# vite-plugin-svgr

Vite plugin to transform SVGs into React components using svgr under the hood.

## :warning: Requirement :warning:

This plugin only works with version 2.5.0 (and greater) of ViteJS, which has a compatibility fix with Rollup that this plugin expects.

## Installation

-   with npm

```shell
$ npm i --save-dev @lucsky/vite-plugin-svgr
```

-   with yarn

```shell
$ yarn add --dev @lucsky/vite-plugin-svgr
```

## Usage

Add `svgrPlugin()` to the list of plugins in the ViteJS configuration file (`vite.config.js`) of your project.

```js
import svgrPlugin from '@lucsky/vite-plugin-svgr';

export default defineConfig({
    //...
    plugins: [svgrPlugin()]
});
```

Once you have done that, you can import any of your SVG asset as a React component:

```js
// The default behavior of ViteJS will get you the URL of the asset
import SVGAsset from 'some/file.svg';
console.log(SVGAsset);

// Now simply adding the `component` parameter to the module name
// will get you a standard React component
import OtherSVGAsset from 'some/other_file.svg?component';

// That you can use normally
function SomeComponent() {
    return (
        <button>
            <OtherSVGAsset /> Click Me!
        </button>
    );
}
```

## Configuration

By default, the plugin will prevent transformed SVG assets to be emitted when building the production bundle. If you want or need to have those files emitted anyway, pass the `{keepEmittedAssets: true}` option:

```js
export default defineConfig({
    //...
    plugins: [svgrPlugin({ keepEmittedAssets: true })]
});
```

## License

MIT
