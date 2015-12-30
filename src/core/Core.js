/**
 * wishlist - core/Core.js
 *
 * Created by nijk on 05/11/15.
 */

'use strict';
const _ = require('lodash');
const Fluxxor = require('fluxxor');
const React = require('react');

// Stores
const CoreStore = require('./stores/CoreStore');
const NavigationStore = require('./stores/NavigationStore');
const ProductsStore = require('./stores/ProductsStore');
const WishlistsStore = require('./stores/WishlistsStore');

// Menus
const menus = require('./menus');

let core = new Fluxxor.Flux();

// Shortcut methods for easy central access
// -------------------------
_.extend(core, {
    // Fluxxor shortcuts
    createStore: Fluxxor.createStore,
    FluxMixin: Fluxxor.FluxMixin( React ),
    StoreWatchMixin: Fluxxor.StoreWatchMixin
});

core.addActions(require('./actions'));

core.addStores({
    'Core': new CoreStore(),
    'Navigation': new NavigationStore(),
    'Products': new ProductsStore(),
    'Wishlists': new WishlistsStore()
});

core.store('Navigation').addMenu(menus._keys.main, menus.main);

module.exports = core;
