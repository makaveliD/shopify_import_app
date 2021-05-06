import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {AppProvider, Card, Page, Autocomplete, Form, Checkbox, Button, TextField} from '@shopify/polaris';
import {Provider, TitleBar} from '@shopify/app-bridge-react';
import axios from 'axios';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// Your routes.js file
import routes from './routes';


export default class App extends Component {

    state = {}

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        axios.get(`/settings`)
            .then(res => {
                const settings = res.data;
                this.setState(settings);
            })
    }

    handleSubmit() {
        axios.post(`/settings/update`, this.state)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    handleChange(value, id) {

        this.setState({[id]: value});
    }

    render() {
        const config = {
            apiKey: document.getElementById("apiKey").value,
            shopOrigin: document.getElementById("shopOrigin").value,
            forceRedirect: true
        };
        return (
            <AppProvider>
                <Provider config={config}>
                    <TitleBar title="Polaris Demo"/>
                    <Page title="Polaris Demo Page">
                        <Card sectioned title="Settings">
                            <Form onSubmit={this.handleSubmit}>
                                <Card.Section>
                                    <TextField
                                        label="Login"
                                        name="checkbox_rro_login"
                                        id="checkbox_rro_login"

                                        value={this.state.checkbox_rro_login}
                                        placeholder="Login"
                                        onChange={this.handleChange}
                                    />
                                </Card.Section>
                                <Card.Section>
                                    <TextField
                                        label="Password"
                                        name="checkbox_rro_password"
                                        id="checkbox_rro_password"
                                        value={this.state.checkbox_rro_password}
                                        placeholder="Password"
                                        onChange={this.handleChange}
                                    />
                                </Card.Section>
                                <Card.Section>
                                    <TextField
                                        label="Checkbox key"
                                        name="checkbox_rro_cashbox_key"
                                        id="checkbox_rro_cashbox_key"
                                        value={this.state.checkbox_rro_cashbox_key}
                                        placeholder="Checkbox key"
                                        onChange={this.handleChange}
                                    />
                                </Card.Section>
                                <Card.Section>
                                    <Checkbox
                                        label="Dev version"
                                        checked={this.state.checkbox_rro_is_dev}
                                        name="checkbox_rro_is_dev"
                                        id="checkbox_rro_is_dev"
                                        onChange={this.handleChange}
                                    />
                                </Card.Section>
                                <Card.Section>
                                    <Checkbox
                                        label="Checkbox status"
                                        checked={this.state.checkbox_status}
                                        onChange={this.handleChange}
                                        name="checkbox_status"
                                        id="checkbox_status"
                                    />
                                </Card.Section>
                                <Card.Section>
                                    <Button primary submit>Save</Button>
                                </Card.Section>
                            </Form>
                        </Card>
                    </Page>
                </Provider>
            </AppProvider>
        );
    }

}


if (document.getElementById("app")) {
    ReactDOM.render(<App/>, document.getElementById("app"));
}
