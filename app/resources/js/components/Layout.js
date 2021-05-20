import React, {Component} from 'react'
import {Frame, Page,} from '@shopify/polaris';
import {Route} from 'react-router-dom';
import Settings from '../components/setting.js';
import Orders from '../components/orders.js';
import Order from '../components/order.js';
import Nav from '../components/navigation.js';
import CheckboxPro from '../components/checkbox.js';

const pageMarkup = (
    <Page fullWidth >

        <Route path="/" exact>
            <Settings/>
        </Route>
        <Route path="/orders" exact>
            <Orders/>
        </Route>
        <Route path="/checkbox" exact>
            <CheckboxPro/>
        </Route>
        <Route path="/order/:id" >
            <Order/>
        </Route>
    </Page>

)

export default class Layout extends Component {

    render() {
        return (
            <Frame
                navigation={<Nav/>}
            >
                {pageMarkup}
            </Frame>
        );
    }

}



