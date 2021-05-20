"use strict";
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {AppProvider} from '@shopify/polaris';
import {Provider} from '@shopify/app-bridge-react';
import {BrowserRouter, Link as ReactRouterLink} from 'react-router-dom';
import Layout from "./components/Layout";

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

function Link({children, url = '', external, ref, ...rest}) {
    // react-router only supports links to pages it can handle itself. It does not
    // support arbirary links, so anything that is not a path-based link should
    // use a reglar old `a` tag
    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
        rest.target = '_blank';
        rest.rel = 'noopener noreferrer';
        return (
            <a href={url} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <ReactRouterLink to={url} {...rest}>
            {children}
        </ReactRouterLink>
    );
}

const config = {
    apiKey: document.getElementById("apiKey").value,
    shopOrigin: document.getElementById("shopOrigin").value,
    forceRedirect: true
};

const application = (
    <BrowserRouter>
        <AppProvider linkComponent={Link}>
            <Provider config={config}>
                <Layout/>
            </Provider>
        </AppProvider>
    </BrowserRouter>
);
ReactDOM.render(application, document.getElementById("app"));




