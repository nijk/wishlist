var _ = require('lodash');
var babelJest = require('babel-jest');
var path = require('path');
var webpackAlias = require('jest-webpack-alias');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

// Change these to point to your source and test directories
var dirs = ['../src', '../__tests__'].map(function(dir) {
    return path.resolve(__dirname, dir);
});

function matches(filename) {
    return _.find(dirs, function(dir) {
        return filename.indexOf(dir) === 0;
    });
}

module.exports = {
    process: function(src, filename) {
        if (matches(filename)) {
            src = babelJest.process(src, filename);
            src = webpackAlias.process(src, filename);
        }
        return src;
    }
};