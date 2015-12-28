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
        tag: React.PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']),
        text: React.PropTypes.string
    },

    render () {
        const props = {
            tag: this.props.tag,
            text: this.props.text
        };
        return <props.tag>{ props.text }</props.tag>;
    }

});

module.exports = Text;
