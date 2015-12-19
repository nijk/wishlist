/**
 * wishlist - core.components/App
 *
 * Created by nijk on 06/11/15.
 */

'use strict';

const core = require('core/Core');
/* eslint-disable no-unused-vars */
const React = require('react');
/* eslint-enable no-unused-vars */
const ReactDOM = require('react-dom');
const AppContainer = require('./AppContainer');

/* Styles */
require('skeleton-sass');
require('../../style/media');
/* ------ */

module.exports = {
    mount () {
        ReactDOM.render(
            <AppContainer flux={ core }/>,
            document.getElementById('app-container')
        );
        //setTimeout(core.actions.appStart, 1000);
    }
};