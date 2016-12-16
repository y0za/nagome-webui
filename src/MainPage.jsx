import React, {Component} from 'react';
import {Page, Splitter, SplitterSide, SplitterContent} from 'react-onsenui';
import ons from 'onsenui';

import {ngm, NagomeInit} from './NagomeConn.js';

import Menu from './Menu.jsx';
import MainFrame from './MainFrame.jsx';

export default class MainPage extends Component {
    constructor() {
        super();
        this.state = {
            menuIsOpen: false,
            wsIsConnecting: false,
            isBroadOpen: false,
            broadInfo: {},
        };

        NagomeInit(this.websocketEventHandler.bind(this));
        ngm.addNgmEvHandler("nagome_ui", this.UIEventHandler.bind(this));
        ngm.addNgmEvHandler("nagome", this.nagomeEventHandler.bind(this));
        ngm.connectWs();
    }

    UIEventHandler(arrM) {
        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];
            switch (m.command) {
            case "ClearComments":
                break;
            case "Dialog":
                switch (m.content.type) {
                case 'Info':
                case 'Warn':
                    ons.notification.alert({
                        title: m.content.type+" : "+m.content.title,
                        message: m.content.description,
                        cancelable: true,
                    }).catch((e)=>{});

                    break;
                default:
                    console.log(m);
                }
                break;
            default:
                console.log(m);
            }
        }
    }

    nagomeEventHandler(arrM) {
        let st = this.state;
        let chApp = false;

        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];
            switch (m.command) {
            case 'Broad.Open':
                chApp = true;
                st.isBroadOpen = true;
                st.broadInfo = m.content;
                break;
            case 'Broad.Close':
                chApp = true;
                st.isBroadOpen = false;
                st.broadInfo = {};
                break;
            default:
                console.log(m);
            }
        }

        if (chApp) this.setState(st);
    }

    websocketEventHandler(e) {
        console.log(e);

        let t = this.state;
        switch (e) {
        case 'close':
            t.wsIsConnecting = true;
            window.setTimeout(ngm.connectWs.bind(ngm), 5000);
            break;
        case 'err':
            t.wsIsConnecting = true;
            break;
        case 'open':
            t.wsIsConnecting = false;
            break;
        default:
            console.log("Unknown ws event", e);
        }
        this.setState(t);
    }

    setMenu(o) {
        let t = this.state;
        t.menuIsOpen = o;
        this.setState(t);
    }

    render() {
        if (this.state.broadInfo.title !== undefined) {
            document.title = this.state.broadInfo.title+" / "+this.state.broadInfo.owner_name+" - Nagome";
        } else {
            document.title = "Nagome";
        }

        return (
            <Page>
                <Splitter>
                    <SplitterSide
                        side='left'
                        width={200}
                        collapse={true}
                        isOpen={this.state.menuIsOpen}
                        onClose={this.setMenu.bind(this, false)}
                        onOpen={this.setMenu.bind(this, true)} >
                        <Menu
                            navigator={this.props.navigator}
                            onSelect={this.setMenu.bind(this, false)} />
                    </SplitterSide>
                    <SplitterContent>
                        <MainFrame
                            isBroadOpen={this.state.isBroadOpen}
                            wsIsConnecting={this.state.wsIsConnecting}
                            broadTitle={document.title}
                            onMenuOpen={this.setMenu.bind(this, true)} />
                    </SplitterContent>
                </Splitter>
            </Page>
            );
    }
}
