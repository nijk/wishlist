/**
 * wishlist - core.components/AddItem
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const React = require('react');
const Input = require('./Input');
const Button = require('./Button');
const Text = require('./Text');

/* Styles */
require('style/add-url');
/* ------ */

const WishlistItem = React.createClass({
    displayName: 'WishlistItem',

    propTypes: {
        mode: React.PropTypes.oneOf(['display', 'edit']),
        item: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            url: React.PropTypes.string.isRequired,
            img: React.PropTypes.shape({
                src: React.PropTypes.string.isRequired,
                title: React.PropTypes.string.isRequired
            }),
            description: React.PropTypes.string.isRequired,
            onClick: React.PropTypes.func.isRequired
        }),
        inputDefaultValue: React.PropTypes.string,
        onAdd: React.PropTypes.func,
        onAddAnother: React.PropTypes.func,
        onHandleInput: React.PropTypes.func
    },

    _renderDisplay () {
        return (
            <div key={ this.props.key } className="wishlist-item">
                <Text tag='h3' text={ this.props.item.title } />
                <a href={ this.props.item.url } onClick={ this.props.item.onClick } >
                    <img src={ this.props.item.img.src } title={ this.props.item.img.src } />
                </a>
                <Text tag='p' text={ this.props.item.description } />
            </div>
        );
    },

    _renderEdit () {
        const labelClasses = {
            'add-url__label': true
        };
        const btnClasses = {
            'button--disabled': false,
            'add-url__button': true
        };
        /*const linkClasses = {};*/

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
                /*<a
                    key="addAnotherItemLink"
                    href="/"
                    classNames={ linkClasses }
                    onClick={ this.props.onAddAnother }
                    >Add another</a>*/
    },

    render () {
        if ( 'edit' === this.props.mode ) {
            return this._renderEdit();
        }
        return this._renderDisplay();
    }
});

module.exports = WishlistItem;
