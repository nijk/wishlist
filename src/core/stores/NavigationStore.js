/**
 * wishlist - core.stores/CoreStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    menus: {}
};

module.exports = Fluxxor.createStore({
    initialize () {
        //this.bindActions();
    },

    addMenu (key, { title, items }) {
        if (!_.has(store.menus, key)) {
            store.menus[key] = {
                title: title,
                items: items
            };
        }
    },

    getMenu (key) {
        if (!_.has(store.menus, key)) {
            return {};
        }
        return store.menus[key];
    }
});
