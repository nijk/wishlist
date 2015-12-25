/**
 * wishlist - core.components/AddItem
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const _ = require('lodash');
const classnames = require('classnames');
const React = require('react');

/* Styles */
//require('style/list-item');
/* ------ */

const List = React.createClass({
    displayName: 'List',

    propTypes: {
        classes: React.PropTypes.objectOf(React.PropTypes.string),
        type: React.PropTypes.oneOf(['ul', 'ol', 'dl']),
        items: React.PropTypes.arrayOf(
            React.PropTypes.oneOfType([
                React.PropTypes.element,
                React.PropTypes.shape({
                    name: React.PropTypes.string.isRequired,
                    link: React.PropTypes.shape({
                        title: React.PropTypes.string,
                        url: React.PropTypes.string.isRequired,
                        onClick: React.PropTypes.func
                    }),
                    component: React.PropTypes.element,
                    classes: React.PropTypes.objectOf(React.PropTypes.string)
                })
            ])
        )
    },

    _renderText (item) {
        let text = item.name;

        if ( _.size(item.link) > 0 ) {
            text = (
                <a onClick={ item.onClick }
                    href={ item.link.url || '' }
                    title={ item.link.text || text }
                >
                    { text }
                </a>
            );
        }

        return text;
    },

    _renderItem (item, index) {
        if (React.isValidElement(item)) {
            return item;
        }

        const node = {
            key: `list-item-${eval(index + 1)}`,
            tag: ('dl' === this.props.type) ? 'dt' : 'li',
            classes: classnames(item.classes)
        };

        return ( <node.tag key={ node.key } className={ node.classes }>{ this._renderText(item) }</node.tag> );
    },

    render () {
        const list = {
            tag: this.props.type || 'ul',
            items: this.props.items,
            classes: classnames(this.props.classes)
        };

        return ( <list.tag className={ list.classes }>{ _.map(list.items, this._renderItem) }</list.tag> );
    }
});

module.exports = List;
