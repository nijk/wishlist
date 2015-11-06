/**
 * wishlist - core/Core.js
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const React = require('react');
const App = require('./components/App');
const AppContainer = require('./components/AppContainer');
const CoreStore = require('core/stores/CoreStore');
const events = require('core/events');

console.info('App', App);

App.flux.addAction('app', 'start', function () {
    this.dispatch(events.APP_START, {});
});

App.flux.addStore('Core', new CoreStore());

module.exports = {
    startApp () {
        App.mount();
        App.flux.actions.app.start();
    }
};
