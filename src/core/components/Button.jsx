/**
 * wishlist - core.components/Button
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const React = require('react');
const classnames = require('classnames');

const AddItem = React.createClass({
    displayName: 'Button',

    propTypes: {
        disabled: React.PropTypes.bool,
        text: React.PropTypes.string,
        classNames: React.PropTypes.objectOf(React.PropTypes.bool),
        onClick: React.PropTypes.func.isRequired
    },

    render () {
        return (
            <button
                ref="button"
                className={ classnames( this.props.classNames ) }
                onClick={ this.props.onClick }
            >
                { this.props.text }
            </button>
        );
    }
});

module.exports = AddItem;
