/**
 * wishlist - core.components/Button
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const React = require('react');
const classnames = require('classnames');

module.exports = React.createClass({
    displayName: 'Button',

    propTypes: {
        disabled: React.PropTypes.bool,
        text: React.PropTypes.string.isRequired,
        prependElement: React.PropTypes.element,
        appendElement: React.PropTypes.element,
        className: React.PropTypes.objectOf(React.PropTypes.bool),
        onClick: React.PropTypes.func.isRequired
    },

    _renderButton (button) {
        const prepend = React.isValidElement(this.props.prependElement);
        const append = React.isValidElement(this.props.appendElement);

        if (prepend || append) {
            return (
                <span key={`${this.props.key}-wrapper`}>
                    { (prepend) ? this.props.prependElement : null }
                    { button }
                    { (append) ? this.props.appendElement : null }
                </span>
            );
        } else {
            return button;
        }
    },

    render () {
        const button = (
            <button
                ref="button"
                className={ classnames( this.props.className ) }
                onClick={ this.props.onClick }
            >
                { this.props.text }
            </button>
        );

        return this._renderButton(button);
    }
});
