/**
 * wishlist - core/proptypes
 *
 * Created by nijk on 03/01/2016.
 */

'use strict';

const React = require('react');

module.exports = {
    classes: React.PropTypes.oneOfType([
        React.PropTypes.objectOf(React.PropTypes.bool),
        React.PropTypes.string
    ])
};
