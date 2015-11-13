/**
 * wishlist - core.stores/CoreStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    items: []
};

const CoreStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_URL, this.onAddURL
        );
    },

    transform (url, response) {
        return {
            title: `New item: ${url}`,
            url: url,
            description: `description... for: ${url}`,
            img: response.images
        };
    },

    onAddURL ({ url, reponse }) {
        store.items.push( this.transform(url, response) );
        this.emit( events.CHANGE );
    },

    getItems () {
        return store.items;
    }
});

module.exports = CoreStore;
