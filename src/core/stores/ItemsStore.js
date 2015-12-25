/**
 * wishlist - core.stores/ItemStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    fetching: false,
    itemToAdd: undefined,
    items: []
};

// @todo: this might be better if it incremented the last key instead of object length.
const setItem = (item) => {
    store.items.push(item);
    unsetItemToAdd();
};

// @todo: this might be better if it incremented the last key instead of object length.
const unsetAllItems = () => {
    store.items = [];
};

// @todo: this might be better if it incremented the last key instead of object length.
const unsetItemToAdd = () => {
    store.itemToAdd = undefined;
};

const ItemStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_URL, this.onAddURL,
            events.ADD_ITEM, this.onAddItem,
            events.ADD_ITEM_SUCCESS, this.onAddItemSuccess,
            events.ADD_ITEM_FAILURE, this.onAddItemFailure,
            events.FETCH_ITEMS_SUCCESS, this.onFetchItems
        );
    },

    // @todo: use lodash _.template ??
    transformProduct (url, product) {
        const productItem = { url: url };

        // Transform OpenGraph data
        if ( product.opengraph ) {
            productItem.url = product.data.ogUrl || product.data.url;
            productItem.siteName = product.data.ogSiteName || product.data.siteName;
            productItem.title = product.data.ogTitle || product.data.title;
            productItem.description = product.data.ogDescription || product.data.description;
            productItem.images = [ product.data.ogImage || product.data.image ];
        }

        //Transform scraped data
        if ( product.scraped ) {
            productItem.images = product.data.images;
        }

        return productItem;
    },

    validateProduct ( product ) {
        const url = _.has(product, 'url');
        const title = _.has(product, 'title');
        const description = _.has(product, 'description');
        const images = _.has(product, 'images');
        const imageUrl = images && _.each(product.images, _.has('url'));

        return url && title/* && description*/ && images && imageUrl;
    },

    onAddURL ({ url, product }) {
        if (product.success) {
            const productToAdd = this.transformProduct(url, product);
            if ( this.validateProduct(productToAdd) ) {
                store.itemToAdd = productToAdd;
                this.emit( events.ADD_URL_SUCCESS );
            } else {
                const payload = { product, msg: 'Could not add item due to a validation error' };
                console.warn(events.ADD_URL_FAILURE, payload);
                this.emit( events.ADD_URL_FAILURE, payload );
            }
        } else {
            const payload = { product, msg: 'Could not find any OG data for this product' };
            console.warn(events.ADD_URL_FAILURE, payload);
            this.emit( events.ADD_URL_FAILURE, payload );
        }
        this.emit( events.CHANGE );
    },

    onAddItem (itemToAdd) {
        store.fetching = true;

        // @todo: reset the items from the response from addItem, or trigger a re-fetch
        // Paging should be okay here, as we only need to store the items for either:
        //  - the current page
        //  - the current pages loaded so far (assuming infinity scroll), e.g pages 1-7

        /*if ( this.validateProduct(itemToAdd) ) {
            //const itemKey = setItem(itemToAdd);
            console.info(events.ADD_ITEM_SUCCESS, this.getItem(itemKey), store.items);
            this.emit( events.ADD_ITEM_SUCCESS, this.getItem(itemKey) );
        } else {
            const payload = { item: itemToAdd, msg: 'Could not add item due to a validation error' };
            console.warn(events.ADD_ITEM_FAILURE, payload);
            this.emit( events.ADD_ITEM_FAILURE, payload );
        }*/
        this.emit( events.CHANGE );
    },

    onAddItemSuccess (item) {
        store.fetching = true;
        // Re-fetch Wishlist Items, with current pages?
        this.emit( events.ADD_ITEM_SUCCESS );
    },

    onAddItemFailure (item) {
        store.fetching = false;

        this.emit( events.ADD_ITEM_FAILURE, item );
        this.emit( events.CHANGE );
    },

    onFetchItems (items) {
        // Clear down stored items first.
        unsetAllItems();

        _.each(items, (item) => {
            if (this.validateProduct(item)) {
                setItem(item);
            } else {
                console.warn(events.FETCH_ITEMS_FAILURE, item, store.items);
            }
        });
        this.emit( events.CHANGE );
    },

    getItems () {
        return store.items;
    },

    getItem (key) {
        return store.items[key] || 1;
    },

    getItemToAdd () {
        return store.itemToAdd;
    },

    isFetching () {
        return store.fetching;
    }
});

module.exports = ItemStore;
