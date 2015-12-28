/**
 * wishlist - core.stores/WishlistStore
 *
 * Created by nijk on 21/12/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    fetching: false,
    wishlistToAdd: undefined,
    wishlists: []
};

const WishlistsStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.ADD_WISHLIST, this.onAddWishlist,
            events.FETCH_WISHLISTS, this.onFetchWishlists,
            events.FETCH_WISHLISTS_SUCCESS, this.onFetchWishlistsSuccess,
            events.FETCH_WISHLISTS_FAILURE, this.onFetchWishlistsFailure
        );
    },

    onAddWishlist ({ name }) {
        this.emit( events.CHANGE );
    },

    onFetchWishlists () {
        store.fetching = true;
        this.emit( events.CHANGE );
    },

    onFetchWishlistsSuccess (wishlists) {
        store.fetching = false;
        // @todo: validate that we have a sensible value to store
        store.wishlists = wishlists;

        this.emit( events.CHANGE );
    },

    onFetchWishlistsFailure () {
        store.fetching = false;
        this.emit( events.CHANGE );
    },

    getWishlists () {
        return store.wishlists;
    },

    isFetching () {
        return store.fetching;
    }
});

module.exports = WishlistsStore;
