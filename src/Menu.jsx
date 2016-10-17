import React, { Component } from 'react';
import {Page, List, ListItem} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';

export default class Menu extends Component {
    componentWillMount() {
        this.menuList = [
            {text: "Connect to URI", fn: () => {
                ons.notification.prompt({
                    title: 'Connect',
                    message: 'Input Live ID or URI',
                    cancelable: true,
                    callback: (br) => {
                        ngm.broadConnect(br);
                    },
                });
            }},
            {text: "Disconnect", fn: () => {
                ngm.broadDisconnect();
            }},
            {text: "Clear comments", fn: () => {
                ngm.clearComments();
            }},
        ];
    }

    handleMenuSelect(f) {
        this.props.onSelect();
        f();
    }

    render() {
        return (
            <Page>
                <List
                    dataSource={this.menuList}
                    renderRow={(m) => (
                        <ListItem key={m.text} onClick={this.handleMenuSelect.bind(this, m.fn)} tappable >
                            {m.text}
                        </ListItem>
                    )}
                />
            </Page>
            );
    }
}
