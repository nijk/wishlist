/**
 * wishlist - core.containers/AppContainer
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

// Dependencies
const core = require('core/Core');
const React = require('react');

// Containers
const Header = require('./Header');

/* Styles */
/* ------ */

module.exports = React.createClass({
    displayName: 'AppContainer',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Core')
    ],

    getStateFromFlux () {
        return {
            started: core.store('Core').hasStarted()
        };
    },

    render () {
        return (
            <div className="app">
                <Header />
                <div className="container">
                    { this.props.children }
                </div>
            </div>
        );
    }
});
