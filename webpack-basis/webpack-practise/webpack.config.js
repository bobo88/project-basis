const webpack = require('webpack');
const path = require('path');
const speedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new speedMeasureWebpackPlugin();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 字符串
new webpack.BannerPlugin({
    banner: 'hello world',
});

module.exports = smp.wrap({
    mode: 'production', // development
    target: ['web', 'es5'],
    entry: ['./src/index.js', './src/user.js'],
    // entry: {
    //     index: './src/index.js',
    //     user: './src/user.js'
    // },
    output: {
        publicPath: './',
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name]-[contenthash]-[fullhash].js'
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.s?css$/i,
                exclude: /node_modules/, // 排除编译 node_modules
                use: ['style-loader',MiniCssExtractPlugin.loader,"css-loader", "sass-loader"],
            },
            {
                test: /\.ts|tsx$/,
                exclude: /node_modules/, // 排除编译 node_modules
                use: 'ts-loader'
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/, // 排除编译 node_modules
            //     use: {
            //       loader: 'babel-loader',
            //       options: {
            //         presets: ['@babel/preset-env']
            //       }
            //     }
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin(),
        // new MiniCssExtractPlugin({
        //     filename:'css/built.css'//对输出的文件进行重命名,默认为main.css
        // })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        hot: true                 // 开启热更新
    },
    optimization: {
        // minimizer: [
        //     // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
        //     // `...`,
        //     // new CssMinimizerPlugin(),
        // ],
        splitChunks: {
            // minSize: 200,
            // 这里的默认配置项省略，它们最终都会作用到 cacheGroups 上
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    // 这里的 chunks 字段指的是分离 chunk 的标准
                    // minSize: 200,
                    chunks: 'async',
                }
            }
        }
    }

});