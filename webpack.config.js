const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
            favicon: './public/favicon.png'
        }),
        new MiniCssPlugin({
            filename: 'common.css'
        }),
        new CopyPlugin({
            patterns: [
              { from: "./public/tonconnect-manifest.json", to: "tonconnect-manifest.json" },
              { from: "./public/icon-128.png", to: "icon-128.png" },
              { from: "./public/icon-256.png", to: "icon-256.png" },
              { from: "./public/icon-512.png", to: "icon-512.png" },
            ],
        }),
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
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        port: 8080
    }
};