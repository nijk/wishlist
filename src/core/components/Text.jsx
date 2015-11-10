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
        tag: React.PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']),
        text: React.PropTypes.string
    },

    render () {
        let tag, text = this.props.text;
        switch (this.props.tag) {
            case 'h1':
                tag = <h1>{ text }</h1>;
                break;
            case 'h2':
                tag = <h2>{ text }</h2>;
                break;
            case 'h3':
                tag = <h3>{ text }</h3>;
                break;
            case 'h4':
                tag = <h4>{ text }</h4>;
                break;
            case 'h5':
                tag = <h5>{ text }</h5>;
                break;
            case 'h6':
                tag = <h6>{ text }</h6>;
                break;
            default:
                tag = <p>{ text }</p>;
                break;
        }

        return ( tag );
    }

});

module.exports = Text;
