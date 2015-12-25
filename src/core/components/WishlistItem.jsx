/**
 * wishlist - core.components/AddItem
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const _ = require('lodash');
const React = require('react');
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
            siteName: React.PropTypes.string,
            description: React.PropTypes.string,
            url: React.PropTypes.string.isRequired,
            images: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    url: React.PropTypes.string.isRequired
                })
            ),
            onClick: React.PropTypes.func
        }),
        onAdd: React.PropTypes.func,
        onAddAnother: React.PropTypes.func,
        onHandleInput: React.PropTypes.func
    },

    _renderItem() {
        return (
            <div key={ this.props.key } className="wishlist-item">
                <a className="media" href={ this.props.item.url } target="_blank" onClick={ this.props.item.onClick }>
                    <img src={ this.props.item.images[0].url } title={ this.props.item.title } />
                </a>
                <div className="wishlist-item__details">
                    <Text tag='h3' text={ this.props.item.title } />
                    <Text tag='p' text={ this.props.item.description } />
                    {
                    (this.props.item.siteName) ?
                        <a href={ this.props.item.url } target="_blank">
                            <Text tag="p" text={ `From ${this.props.item.siteName}` } />
                        </a>
                    : null
                    }
                </div>
            </div>
        );
    },

    _renderImages () {
        // Get out quick if there's nothing to render
        if ( !this.props.item.images ) { return null; }

        const images = _.map(this.props.item.images, (item, index) => {
            if (item && _.isString(item.url)) {
                return ( <img key={ `temp-item-${index}` } src={ item.url } alt={ item.alt || '' } /> );
            }
        }, []);

        return ( images ) ? images : null;
    },

    _renderItemEdit () {
        return (
            <div classNames="edit-item">
                { this._renderImages() }
            </div>
        );
    },

    render () {
        if ('edit' === this.props.mode) {
            return this._renderItemEdit();
        }
        return this._renderItem();
    }
});

module.exports = WishlistItem;
