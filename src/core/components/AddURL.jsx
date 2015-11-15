/**
 * wishlist - core.components/AddItem
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const _ = require('lodash');
const React = require('react');
const Input = require('./Input');
const Button = require('./Button');
const Text = require('./Text');

/* Styles */
require('style/add-url');
/* ------ */

const AddURL = React.createClass({
    displayName: 'AddURL',

    propTypes: {
        inputDefaultValue: React.PropTypes.string,
        onAdd: React.PropTypes.func,
        onHandleInput: React.PropTypes.func
    },

    render () {
        const labelClasses = {
            'add-url__label': true
        };
        const btnClasses = {
            'button--disabled': false,
            'add-url__button': true
        };

        return (
            <div key={ this.props.key } className="add-url">
                <Input
                    key="addItemInput"
                    type="text"
                    label="Add an item"
                    labelClassNames={ labelClasses }
                    value={ this.props.url }
                    defaultValue={ this.props.inputDefaultValue }
                    onChange={ this.props.onHandleInput }
                />
                <Button
                    key="addItemButton"
                    text="Add"
                    classNames={ btnClasses }
                    onClick={ this.props.onAdd }
                />
            </div>
        );
    }
});

module.exports = AddURL;
