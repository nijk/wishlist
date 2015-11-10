/**
 * wishlist - core/events
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const keymirror = require('keymirror');
const defaultEvents = {
    CHANGE: 'change'
};

module.exports = _.extend(defaultEvents, keymirror({
    APP_START: null,
    ADD_ITEM: null
}));
