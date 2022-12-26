const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./src/app.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build'),
        clean: true
    },
    plugins: [
        new HtmlPlugin({
            template: './src/index.html'
        }),
        new MiniCssPlugin({
            filename: 'common.css'
        })
    ],
    module: {
        rules: [
            {
                test:/\.(s*)css$/,
                exclude: /node_modules/,
                use: [
                    {loader: MiniCssPlugin.loader},
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    devServer: {
        port: 8080
    }
};