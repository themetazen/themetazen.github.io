const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./src/index.ts'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build'),
        clean: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'json'],
    },
    plugins: [
        new HtmlPlugin({
            template: './public/index.html',
            favicon: './public/favicon.png',
            manifest: './public/tonconnect-manifest.json'
        }),
        new MiniCssPlugin({
            filename: 'common.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(s*)css$/,
                exclude: /node_modules/,
                use: [
                    {loader: MiniCssPlugin.loader},
                    'css-loader',
                    'sass-loader'
                ]
            }, 
            {
                test: /\.(png|jpg|jpeg|svg|ico|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        port: 8080
    }
};