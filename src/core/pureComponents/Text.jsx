/**
 * wishlist - core.pureComponents/Text
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const React = require('react');

const Text = React.createClass({
    displayName: 'Text',

    propTypes: {
        text: React.PropTypes.string
    },

    render () {
        return (
            <p>{ this.props.text }</p>
        );
    }

});

module.exports = Text;
