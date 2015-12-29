/**
 * wishlist - core.stores/ProductStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    productsInEditMode: [],
    fetching: false,
    updating: false,
    productToAdd: undefined,
    products: []
};

// @todo: this might be better if it incremented the last key instead of object length.
const setProduct = (product) => {
    store.products.push(product);
    unsetProductToAdd();
};

// @todo: this might be better if it incremented the last key instead of object length.
const unsetAllProducts = () => {
    store.products = [];
};

// @todo: this might be better if it incremented the last key instead of object length.
const unsetProductToAdd = () => {
    store.productToAdd = undefined;
};

const removeProductFromEditingMode = (product) => {
    store.updating = false;
    _.remove(store.productsInEditMode, (i) => i === product.id && product.id);
};

const ProductsStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_URL, this.onAddURL,

            events.MODIFY_PRODUCT, this.onModifyProduct,
            events.MODIFY_PRODUCT_SUCCESS, this.onModifyProductSuccess,
            events.MODIFY_PRODUCT_FAILURE, this.onModifyProductFailure,

            events.EDIT_PRODUCT, this.onEditProduct,

            events.FETCH_PRODUCTS_SUCCESS, this.onFetchProducts
        );
    },

    // @todo: use lodash _.template ??
    transformProduct (url, product) {
        const item = { url: url };

        // Transform OpenGraph data
        if ( product.opengraph ) {
            item.url = product.data.ogUrl || product.data.url;
            item.siteName = product.data.ogSiteName || product.data.siteName;
            item.title = product.data.ogTitle || product.data.title;
            item.description = product.data.ogDescription || product.data.description;
            item.images = [ product.data.ogImage || product.data.image ];
        }

        //Transform scraped data
        if ( product.scraped ) {
            item.images = product.data.images;
        }

        return item;
    },

    validateProduct ({ url, title, images }) {
        return url && title && images && _.each(images, _.has('url'));
    },

    onAddURL ({ url, product }) {
        if (product.success) {
            const productToAdd = this.transformProduct(url, product);
            if ( this.validateProduct(productToAdd) ) {
                store.productToAdd = productToAdd;
                this.emit( events.ADD_URL_SUCCESS );
            } else {
                const payload = { product, msg: 'Could not add product due to a validation error' };
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

    onEditProduct (product) {
        if (_.indexOf(store.productsInEditMode, product.id) === -1) {
            // Begin editing mode
            store.productsInEditMode.push(product.id);
        } else {
            // Update values during editing
            store.products = _.map(store.products, (item) => {
                return (item && product && item.id === product.id) ? product : item;
            });
        }

        this.emit( events.CHANGE );
    },

    onModifyProduct ({ type, product }) {
        store.updating = true;
        this.emit( events.CHANGE );
    },

    onModifyProductSuccess ({ type, product }) {
        store.updating = false;
        if ('update' === type || 'add' === type) {
            removeProductFromEditingMode(product);
        }
        this.emit( events.MODIFY_PRODUCT_SUCCESS, { type, product } );
        this.emit( events.CHANGE );
    },
    
    onModifyProductFailure ({ type, product }) {
        store.updating = false;
        if ('update' === type || 'add' === type) {
            removeProductFromEditingMode(product);
        }
        console.warn( events.MODIFY_PRODUCT_FAILURE, { type, product } );
        this.emit( events.MODIFY_PRODUCT_FAILURE, { type, product } );
        this.emit( events.CHANGE );
    },

    onFetchProducts (products) {
        // Clear down stored products first.
        unsetAllProducts();

        _.each(products, (product) => {
            if (this.validateProduct(product)) {
                setProduct(product);
            } else {
                console.warn(events.FETCH_PRODUCTS_FAILURE, product, store.products);
            }
        });
        this.emit( events.CHANGE );
    },

    getProducts () {
        return store.products;
    },

    getProduct (id) {
        return _.find(store.products, { id: id });
    },

    getProductToAdd () {
        return store.productToAdd;
    },

    isFetching () {
        return store.fetching;
    },

    isUpdating () {
        return store.updating;
    },

    isEditing (id) {
        if (!id) {
            return !!store.productsInEditMode.length;
        }
        return _.indexOf(store.productsInEditMode, id) > -1;
    }
});

module.exports = ProductsStore;
