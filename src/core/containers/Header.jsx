/**
 * wishlist - core.containers/Header
 *
 * Created by nijk on 30/12/15.
 */

'use strict';

// Dependencies
const core = require('core/Core');
const React = require('react');
const classnames = require('classnames');

// Components
const Text = require('../components/Text');
const Menu = require('../components/Menu');

/* Styles */
require('style/header');
/* ------ */

module.exports = React.createClass({
    displayName: 'Header',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Navigation')
    ],

    getStateFromFlux () {
        const navigationStore = core.store('Navigation');

        return {
            mainMenu: navigationStore.getMenu('main'),
            utilityMenu: navigationStore.getMenu('utility')
        };
    },

    render () {
        return (
            <header className="app-header">
                <Text key="app-name" tag="h1" text="Wishlist" className="app-name"/>
                <Menu key="main-menu" items={ this.state.mainMenu } className="menu__main-menu"/>
                <Menu key="utility-menu" items={ this.state.utilityMenu } className="menu__utility-menu"/>
            </header>
        );
    }
});
