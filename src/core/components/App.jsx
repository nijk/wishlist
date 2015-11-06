/**
 * wishlist - core.components/App
 *
 * Created by nijk on 06/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const React = require('react');
const ReactDOM = require('react-dom');
const AppContainer = require('./AppContainer');
const flux = new Fluxxor.Flux();

const App = {
    flux,
    mount () {
        ReactDOM.render(
            <AppContainer flux={ flux } />,
            document.getElementById('app-container')
        );
    }
};

module.exports = App;