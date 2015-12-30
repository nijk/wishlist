/**
 * wishlist - core.containers/AppContainer
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

// Dependencies
const core = require('core/Core');
const React = require('react');

/* Styles */
/* ------ */

const AppContainer = React.createClass({
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

    componentDidMount () {

    },

    render () {
        return (
            <div className="app">
                AppContainer
            </div>
        );
    }
});

module.exports = AppContainer;
