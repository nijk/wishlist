/**
 * wishlist - core.stores/CoreStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    items: []
};

const CoreStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_ITEM, this.onAddItem
        );
    },

    transform (item) {
        return {
            title: `New item: ${item.value}`,
            url: item.value,
            description: `description... for: ${item.value}`,
            img: {
                src: '/assets/product-default.png',
                title: 'Product image'
            }
        };
    },

    onAddItem (item) {
        store.items.push( this.transform(item) );
        this.emit( events.CHANGE );
    },

    getItems () {
        return store.items;
    }
});

module.exports = CoreStore;
