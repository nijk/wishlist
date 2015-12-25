/**
 * wishlist - core/Core.js
 *
 * Created by nijk on 05/11/15.
 */

'use strict';
const _ = require('lodash');
const Fluxxor = require('fluxxor');
const React = require('react');
const CoreStore = require('./stores/CoreStore');
const ItemsStore = require('./stores/ItemsStore');
const WishlistsStore = require('./stores/WishlistsStore');

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
    'Items': new ItemsStore(),
    'Wishlists': new WishlistsStore()
});

module.exports = core;
