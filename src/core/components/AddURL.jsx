/**
 * wishlist - core.components/AddURL
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const React = require('react');
const Input = require('./Input');
const Button = require('./Button');

/* Styles */
require('style/add-url');
/* ------ */

module.exports = React.createClass({
    displayName: 'AddURL',

    propTypes: {
        inputValue: React.PropTypes.string,
        onAdd: React.PropTypes.func,
        onHandleInput: React.PropTypes.func
    },

    render () {
        const inputClasses = {
            label: {
                'add-url__label': true
            }
        };
        const btnClasses = {
            'button--disabled': false,
            button__primary: true,
            'add-url__button': true
        };

        return (
            <div key={ this.props.key } className="add-url">
                <Input
                    key="addProductInput"
                    type="text"
                    /*label="Add an Product"*/
                    placeholder="Paste your URL here"
                    classes={ inputClasses }
                    value={ this.props.inputValue }
                    onChange={ this.props.onHandleInput }
                />
                <Button
                    key="addProductButton"
                    text="Add"
                    className={ btnClasses }
                    onClick={ this.props.onAdd }
                />
            </div>
        );
    }
});
