const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build'),
        clean: true
    },
    plugins: [
        new HtmlPlugin({
            template: './public/index.html',
            favicon: './public/favicon.png',
        }),
        new MiniCssPlugin({
            filename: 'common.css'
        })
    ],
    module: {
        rules: [
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