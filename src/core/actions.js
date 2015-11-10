/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const events = require('./events');

module.exports = {
    appStart: function () {
        this.dispatch(events.APP_START, {});
    },
    addItem: function (item) {
        this.dispatch(events.ADD_ITEM, item);
    }
};