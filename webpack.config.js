'use strict';
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebpackPlugin = require('write-file-webpack-plugin')

module.exports = {
    mode: "development",
    entry: {
        //vendor: ['pixi', 'p2', 'phaser', 'howler'],
        app: path.resolve(__dirname, 'src/Starter.ts')/*['pixi',
            path.resolve(__dirname, 'src/appEntry.ts')
        ]*/
    },
    module: {

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: path.join('[name]', 'index.js')
    },
    devtool: 'source-map',
    plugins: [
        // File loader configuration for .woff and .woff2 files
        // File loader configuration for .gif .jpg .jpeg .png and .svg files
        // https://github.com/namics/webpack-config-plugins/tree/master/packages/asset-config-webpack-plugin
       // new CleanWebpackPlugin(['dist']),

        // Cleans the dist folder before the build starts

        // Generate a base html file and injects all generated css and js files

        // Multi threading babel loader configuration with caching for .js and .jsx files
        // see https://github.com/namics/webpack-config-plugins/tree/master/packages/js-config-webpack-plugin/config
        new JsConfigWebpackPlugin(),
        // Multi threading typescript loader configuration with caching for .ts and .tsx files
        // see https://github.com/namics/webpack-config-plugins/tree/master/packages/ts-config-webpack-plugin/config
        new TsConfigWebpackPlugin(),
        new WriteWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                context: path.resolve(__dirname, './dist'),
                from: './assets/!*.png',
                to: './assets/'
            }]
        ),

        new HtmlWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.ts'],
        /*alias: {
            'pixi': 'PIXI'
        }*/
    }

};
