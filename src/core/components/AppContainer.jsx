/**
 * wishlist - core.components/Container
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const React = require('react');
const Fluxxor = require('fluxxor');
const FluxMixin = Fluxxor.FluxMixin(React);
const StoreWatchMixin = Fluxxor.StoreWatchMixin;
const Text = require('../pureComponents/Text');

const AppContainer = React.createClass({
    DisplayName: 'CoreContainer',

    mixins: [
        FluxMixin,
        StoreWatchMixin('Core')
    ],

    getStateFromFlux () {
        const flux = this.getFlux();

        console.info('flux', flux.stores.Core.hasStarted());

        return {
            started: flux.stores.Core.hasStarted()
        };
    },

    render () {
        return (
            <Text tag='p' text={ `App started: ${this.state.started}` } />
        );
    }
});

module.exports = AppContainer;
