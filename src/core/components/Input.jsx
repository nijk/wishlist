/**
 * wishlist - core.pureComponents/Input
 *
 * Created by nijk on 07/11/15.
 */

'use strict';

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
        classNames: React.PropTypes.objectOf(React.PropTypes.bool),
        labelClassNames: React.PropTypes.objectOf(React.PropTypes.bool),
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
        event.preventDefault();
        this.props.onChange(event, this.getValue());
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
        return (
            <label className={ classnames( this.props.labelClassNames ) } for={ this.props.name }>
                { this.props.label }
                <input
                    { ...this.props }
                    ref="input"
                    id={ this.props.name }
                    name={ this.props.name }
                    className={ classnames(this.props.classNames) }
                    onChange={ this.handleChange }
                />
            </label>
        );
    }
});
