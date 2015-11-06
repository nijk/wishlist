/**
 * wishlist - core.stores/CoreStore
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const Fluxxor = require('fluxxor');
const events = require('../events');

let state = {
    started: false
};

const CoreStore = Fluxxor.createStore({
    initialize () {
        this.bindActions(
            events.APP_START, this.onStart
        );
    },

    onStart () {
        state.started = true;
        console.info(`APP started ${state.started}`);
    },

    hasStarted () {
        return state.started;
    }
});

module.exports = CoreStore;
