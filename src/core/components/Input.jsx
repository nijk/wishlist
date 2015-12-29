/**
 * wishlist - core.pureComponents/Input
 *
 * Created by nijk on 07/11/15.
 */

'use strict';

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

/**
 * @class Input
 * @description Input form field, allowing for different type values
 *
 * @link facebook.github.io/react/docs/forms.html#controlled-components
 * @link facebook.github.io/react/docs/forms.html#uncontrolled-components
 */
module.exports = React.createClass({
    displayName: 'Input',

    propTypes: {
        name: React.PropTypes.string,
        label: React.PropTypes.string,
        type: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        required: React.PropTypes.bool,
        placeholder: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        className: React.PropTypes.oneOfType([
            React.PropTypes.objectOf(React.PropTypes.bool),
            React.PropTypes.string
        ]),
        labelClassName: React.PropTypes.oneOfType([
            React.PropTypes.objectOf(React.PropTypes.bool),
            React.PropTypes.string
        ]),
        onChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            type: 'text',
            label: '',
            className: ''
        };
    },

    getInput () {
        return ReactDOM.findDOMNode(this.refs.input);
    },

    getValue () {
        return this.getInput().value;
    },

    setValue (newValue) {
        this.getInput().value = newValue;
    },

    focus () {
        this.getInput().focus();
    },

    clear () {
        this.getInput().value = '';
    },

    handleChange (event) {
        if (_.isFunction(this.props.onChange)) {
            event.preventDefault();
            this.props.onChange(event, this.getValue(), this.props.name);
        }
    },

    /**
     * @private
     * @function
     * @returns {string} The input ref.
     */
    /*get refName() {
        //return this.context.name + '-input'
    },*/

    /**
     * @private
     * @function render
     * @description Render the input.
     */
    render () {
        const input = {
            classes: classnames(this.props.className),
            id: this.props.name,
            tag: 'textarea' === this.props.type ? 'textarea' : 'input'
        };

        return (
            <label className={ classnames( this.props.labelClassName ) } htmlFor={ this.props.name }>
                { this.props.label }
                <input.tag
                    { ...this.props }
                    ref="input"
                    id={ input.id }
                    name={ this.props.name }
                    className={ input.classes }
                    onChange={ this.handleChange }
                />
            </label>
        );
    }
});
