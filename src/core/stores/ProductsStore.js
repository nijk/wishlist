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
            events.ADD_PRODUCT, this.onAddProduct,
            events.ADD_PRODUCT_SUCCESS, this.onAddProductSuccess,
            events.ADD_PRODUCT_FAILURE, this.onAddProductFailure,
            events.EDIT_PRODUCT, this.onEditProduct,
            events.UPDATE_PRODUCT, this.onUpdateProduct,
            events.UPDATE_PRODUCT_SUCCESS, this.onUpdateProductSuccess,
            events.UPDATE_PRODUCT_FAILURE, this.onUpdateProductFailure,
            events.DELETE_PRODUCT, this.onDeleteProduct,
            events.DELETE_PRODUCT_SUCCESS, this.onDeleteProductSuccess,
            events.DELETE_PRODUCT_FAILURE, this.onDeleteProductFailure,
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

    validateProduct ( product ) {
        const url = _.has(product, 'url');
        const title = _.has(product, 'title');
        //const description = _.has(product, 'description');
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

    onAddProduct () {
        store.fetching = true;

        // @todo: reset the products from the response from addProduct, or trigger a re-fetch
        // Paging should be okay here, as we only need to store the products for either:
        //  - the current page
        //  - the current pages loaded so far (assuming infinity scroll), e.g pages 1-7

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

    onUpdateProduct () {
        store.updating = true;
        this.emit( events.CHANGE );
    },

    onUpdateProductSuccess (product) {
        removeProductFromEditingMode(product);
        this.emit( events.UPDATE_PRODUCT_SUCCESS, product );
        this.emit( events.CHANGE );
    },
    
    onUpdateProductFailure (product) {
        removeProductFromEditingMode(product);
        this.emit( events.UPDATE_PRODUCT_FAILURE, product );
        this.emit( events.CHANGE );
    },

    onDeleteProduct () {
        store.updating = true;
        this.emit( events.CHANGE );
    },

    onDeleteProductSuccess (product) {
        store.updating = false;
        this.emit( events.DELETE_PRODUCT_SUCCESS, product );
        this.emit( events.CHANGE );
    },
    
    onDeleteProductFailure (product) {
        store.updating = false;
        this.emit( events.DELETE_PRODUCT_FAILURE, product );
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
