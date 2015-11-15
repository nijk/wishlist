var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var serverPath = path.join(__dirname, 'server');

// @todo: assess if this is how I want to package external dependencies
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    target: 'node',
    cache: true,
    debug: true,
    devtool: 'eval',
    entry: path.join(serverPath, 'index.js'),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    resolve: {
        root: serverPath,
        extensions: ['', '.js']
    },
    externals: nodeModules,

    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    cacheDirectory: true,
                    sourceMaps: true
                }
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.json?$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    eslint: {
        configFile: '.eslintrc'
    }
};