# vite-plugin-svgr

Vite plugin to import SVG files as React components using svgr under the hood.

<a href="https://npmjs.com/package/@honkhonk/vite-plugin-svgr"><img src="https://img.shields.io/npm/v/@honkhonk/vite-plugin-svgr.svg" alt="npm package"></a>

## Installation

-   with npm

```shell
$ npm i --save-dev @honkhonk/vite-plugin-svgr
```

-   with yarn

```shell
$ yarn add --dev @honkhonk/vite-plugin-svgr
```

## Usage

Add `svgr()` (or whatever you decide to name your default import) to the list of plugins in the ViteJS configuration file (`vite.config.js`) of your project.

```js
import svgr from '@honkhonk/vite-plugin-svgr';

export default defineConfig({
    //...
    plugins: [svgr()]
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

-   ### `keepEmittedAssets`

By default, the plugin will prevent transformed SVG assets to be emitted when building the production bundle (when using Vite 2.5.0 or later). If you want or need to have those files emitted anyway, pass the `{keepEmittedAssets: true}` option:

```js
export default defineConfig({
    //...
    plugins: [svgr({ keepEmittedAssets: true })]
});
```

-   ### `svgrOptions`

Allows to pass global svgr configuration flags. See svgr [configuration documentation](https://react-svgr.com/docs/options/) for more details.

```js
export default defineConfig({
    //...
    plugins: [
        svgr({
            svgrOptions: {
                icon: true,
                dimensions: false
                // etc...
            }
        })
    ]
});
```

## Acknowledgement

This plugin started as a fork of Rongjian Zhang (@pd4d10) [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) but diverged enough in the way imports are handled (named vs default with parameter) that making it a separate package looked easier.

## License

MIT
