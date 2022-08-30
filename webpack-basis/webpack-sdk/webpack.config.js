const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    resolve: {
        fallback: { 'path': require.resolve('path-browserify') },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    optimization: {
        minimize: false,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {},
              mangle: true, // Note `mangle.properties` is `false` by default.
              module: false,
              // Deprecated
              output: null,
              format: null,
              toplevel: false,
              nameCache: null,
              ie8: false,
              keep_classnames: true,
              keep_fnames: true,
              safari10: false,
            },
          }),
        ],
    },
    plugins: [
        // new UglifyJsPlugin({
        //     sourceMap: true,
        //     parallel: 4,
        //     uglifyOptions: {
        //         keep_classnames: true,
        //         keep_fnames: true
        //     }
        // }),
        // html-webpack-plugin
        // https://github.com/jantimon/html-webpack-plugin#configuration
        new HtmlWebpackPlugin({
            title: 'SDK Test Configuration',
            template: path.resolve(__dirname, "./public/index.html"),
        })
    ],
}