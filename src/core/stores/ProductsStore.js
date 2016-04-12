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
    products: [],
    previousProductCount: 0
};

const setProduct = (product) => {
    store.products.push(product);
    unsetProductToAdd();
};

const unsetAllProducts = () => {
    store.products = [];
};

const unsetProductToAdd = () => {
    store.productToAdd = undefined;
};

const removeProductsFromEditingMode = (product) => {
    store.updating = false;
    _.remove(store.productsInEditMode, (i) => i === product.id && product.id);
};

const transformProduct = (url, product) => {
    // @todo: use lodash _.template ??
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
};

const validateProduct = ({ /*url, */title, images }) => {
    return /*url && */title && images && _.each(images, _.has('url'));
};

module.exports = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_URL, this.onAddURL,


            events.MODIFY_PRODUCTS, this.onModifyProduct,
            events.MODIFY_PRODUCTS_SUCCESS, this.onModifyProductSuccess,
            events.MODIFY_PRODUCTS_FAILURE, this.onModifyProductFailure,

            events.EDIT_PRODUCT, this.onEditProduct,
            events.EDIT_PRODUCT_CANCEL, this.onEditProductCancel,

            events.FETCH_PRODUCTS, this.onFetchProducts,
            events.FETCH_PRODUCTS_SUCCESS, this.onFetchProductsSuccess,
            events.FETCH_PRODUCTS_FAILURE, this.onFetchProductsFailure
        );
    },

    onAddURL ({ url, product }) {
        if (product.success) {
            const productToAdd = transformProduct(url, product);
            if ( validateProduct(productToAdd) ) {
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

    onEditProductCancel (product) {
        removeProductsFromEditingMode(product);

        this.emit( events.CHANGE );
    },

    onModifyProduct ({ type, products }) {
        store.updating = true;
        this.emit( events.CHANGE );
    },

    onModifyProductSuccess ({ type, products }) {
        store.updating = false;
        removeProductsFromEditingMode(products);
        this.emit( events.MODIFY_PRODUCTS_SUCCESS, { type, products } );
        this.emit( events.CHANGE );
    },

    onModifyProductFailure ({ type, products }) {
        store.updating = false;
        removeProductsFromEditingMode(products);
        console.warn( events.MODIFY_PRODUCTS_FAILURE, { type, products } );
        this.emit( events.MODIFY_PRODUCTS_FAILURE, { type, products } );
        this.emit( events.CHANGE );
    },

    onFetchProducts () {
        store.fetching = true;
        this.emit( events.CHANGE );
    },

    onFetchProductsSuccess (products) {
        store.fetching = false;
        // Clear down stored products first.
        unsetAllProducts();

        _.each(products, (product) => {
            if (validateProduct(product)) {
                setProduct(product);
            } else {
                console.warn(events.FETCH_PRODUCTS_FAILURE, product, store.products);
            }
        });
        this.emit( events.CHANGE );
    },

    onFetchProductsFailure () {
        store.fetching = false;
        this.emit(events.FETCH_PRODUCTS_FAILURE);
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

    productCount () {
        return store.products.length;
    },

    canFetchMore () {
        let moreToFetch = false;

        // Ensure that we don't fetch more if currently fetching or before the first fetch has happened
        if (this.isFetching() || this.productCount() === 0) {
            return false;
        }

        // Ensure there are more products to fetch
        if (this.productCount() !== store.previousProductCount) {
            store.previousProductCount = this.productCount();
            moreToFetch = true;
        }

        return !(this.productCount() % 10) && moreToFetch;
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
