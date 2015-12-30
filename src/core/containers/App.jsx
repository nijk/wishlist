/**
 * wishlist - core.components/App
 *
 * Created by nijk on 06/11/15.
 */

'use strict';

/* eslint-disable no-unused-vars */
//const React = require('react');
/* eslint-enable no-unused-vars */
//const ReactDOM = require('react-dom');
//const AppContainer = require('./AppContainer');

const React = require('react');
const { render }  = require('react-dom');
const { Router, Route, Link } = require('react-router');
const createBrowserHistory = require('history/lib/createBrowserHistory');

const core = require('core/Core');
const AppContainer = require('./AppContainer');
const Wishlists = require('./Wishlists');
const Wishlist = require('./Wishlist');

/* Styles */
require('skeleton-sass');
require('../../style/media');
/* ------ */

const createElement = (Component, props) => {
    // Add flux to props for all route components
    _.extend(props, { flux: core });
    return <Component {...props}/>
}

module.exports = {
    mount () {
        render((
            <Router history={ createBrowserHistory() } createElement={ createElement }>
                <Route path="/" component={ AppContainer }/>
                <Route path="/wishlists" component={ Wishlists }/>
                <Route path="/wishlists/:wishlist" component={ Wishlist }/>
            </Router>
        ), document.getElementById('app-container'));
    }
};
