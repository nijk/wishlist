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
    fetching: false,
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

const ProductsStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_URL, this.onAddURL,
            events.ADD_PRODUCT, this.onAddProduct,
            events.ADD_PRODUCT_SUCCESS, this.onAddProductSuccess,
            events.ADD_PRODUCT_FAILURE, this.onAddProductFailure,
            events.FETCH_PRODUCTS_SUCCESS, this.onFetchProducts
        );
    },

    // @todo: use lodash _.template ??
    transformProduct (url, product) {
        const productProduct = { url: url };

        // Transform OpenGraph data
        if ( product.opengraph ) {
            product.url = product.data.ogUrl || product.data.url;
            product.siteName = product.data.ogSiteName || product.data.siteName;
            product.title = product.data.ogTitle || product.data.title;
            product.description = product.data.ogDescription || product.data.description;
            product.images = [ product.data.ogImage || product.data.image ];
        }

        //Transform scraped data
        if ( product.scraped ) {
            product.images = product.data.images;
        }

        return product;
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

    onAddProduct (productToAdd) {
        store.fetching = true;

        // @todo: reset the products from the response from addProduct, or trigger a re-fetch
        // Paging should be okay here, as we only need to store the products for either:
        //  - the current page
        //  - the current pages loaded so far (assuming infinity scroll), e.g pages 1-7

        /*if ( this.validateProduct(productToAdd) ) {
            //const productKey = setProduct(productToAdd);
            console.info(events.ADD_PRODUCT_SUCCESS, this.getProduct(productKey), store.products);
            this.emit( events.ADD_PRODUCT_SUCCESS, this.getProduct(productKey) );
        } else {
            const payload = { product: productToAdd, msg: 'Could not add product due to a validation error' };
            console.warn(events.ADD_PRODUCT_FAILURE, payload);
            this.emit( events.ADD_PRODUCT_FAILURE, payload );
        }*/
        this.emit( events.CHANGE );
    },

    onAddProductSuccess () {
        store.fetching = true;
        // Re-fetch Wishlist Products, with current pages?
        this.emit( events.ADD_PRODUCT_SUCCESS );
    },

    onAddProductFailure (product) {
        store.fetching = false;

        this.emit( events.ADD_PRODUCT_FAILURE, product );
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

    getProduct (key) {
        return store.products[key] || 1;
    },

    getProductToAdd () {
        return store.productToAdd;
    },

    isFetching () {
        return store.fetching;
    }
});

module.exports = ProductsStore;
