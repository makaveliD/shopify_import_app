import React, {Component} from 'react'
import {AppProvider, Card, Page} from '@shopify/polaris';
import {Provider, TitleBar} from '@shopify/app-bridge-react';

export default class SomePage extends Component{

    render(){

        const config = {
            apiKey : document.getElementById("apiKey").value,
            shopOrigin : document.getElementById("shopOrigin").value,
            forceRedirect : true
        };

        return(
            <AppProvider>
                <Provider config={config}>
                    22222
                </Provider>
            </AppProvider>
        );

    }

}
