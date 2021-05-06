import React, {Component} from 'react'
import {AppProvider, Card, Page} from '@shopify/polaris';
import {Provider, TitleBar} from '@shopify/app-bridge-react';

export default class MainPage extends Component{

    render(){

        const config = {
            apiKey : document.getElementById("apiKey").value,
            shopOrigin : document.getElementById("shopOrigin").value,
            forceRedirect : true
        };

        return(
            <AppProvider>
                <Provider config={config}>
                    1111111
                </Provider>
            </AppProvider>
        );

    }

}
