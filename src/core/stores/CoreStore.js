/**
 * wishlist - core.stores/CoreStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const events = require('../events');

let store = {
    started: false,
    csrfToken: undefined
};

const CoreStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.APP_START, this.onStart
        );
    },

    onStart () {
        store.started = true;
        this.emit( events.CHANGE );
    },

    hasStarted () {
        return store.started;
    }
});

module.exports = CoreStore;
