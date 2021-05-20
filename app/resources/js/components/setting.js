import React, {Component} from 'react'
import { Card, Form, Checkbox, Button, TextField, ProgressBar } from '@shopify/polaris'
import {TitleBar} from '@shopify/app-bridge-react';
import axios from 'axios';


export default class Setting extends Component {

    state = {
        loading:true
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    async componentDidMount() {
        await axios.get(`/api/settings`)
            .then(res => {
                const settings = res.data;
                this.setState({settings,loading:false});
                console.log(this.state)

            });
    }

    handleSubmit() {
        this.setState({loading:true});
        console.log(this.state)
        axios.post(`/api/settings/update`, this.state.settings)
            .then(res => {
                this.setState({loading:false});

            })
    }

    handleChange(value, id) {
        let currentSettings = this.state.settings;
        currentSettings[id] = value;
        this.setState({settings:currentSettings});
        console.log(this.state)

    }

    render() {
        const config = {
            apiKey: document.getElementById("apiKey").value,
            shopOrigin: document.getElementById("shopOrigin").value,
            forceRedirect: true
        };
        if (this.state.loading ) {
            return (<ProgressBar progress={80} size="small"/>)
        }
        return (

            <Card sectioned title="Settings">
                <TitleBar title="Settings"/>
                <Form onSubmit={this.handleSubmit}>
                    <Card.Section>
                        <TextField
                            label="Login"
                            name="checkbox_rro_login"
                            id="checkbox_rro_login"

                            value={this.state.settings.checkbox_rro_login}
                            placeholder="Login"
                            onChange={this.handleChange}
                        />
                    </Card.Section>
                    <Card.Section>
                        <TextField
                            label="Password"
                            name="checkbox_rro_password"
                            id="checkbox_rro_password"
                            value={this.state.settings.checkbox_rro_password}
                            placeholder="Password"
                            onChange={this.handleChange}
                        />
                    </Card.Section>
                    <Card.Section>
                        <TextField
                            label="Checkbox key"
                            name="checkbox_rro_cashbox_key"
                            id="checkbox_rro_cashbox_key"
                            value={this.state.settings.checkbox_rro_cashbox_key}
                            placeholder="Checkbox key"
                            onChange={this.handleChange}
                        />
                    </Card.Section>
                    <Card.Section>
                        <Checkbox
                            label="Dev version"
                            checked={this.state.settings.checkbox_rro_is_dev}
                            name="checkbox_rro_is_dev"
                            id="checkbox_rro_is_dev"
                            onChange={this.handleChange}
                        />
                    </Card.Section>
                    <Card.Section>
                        <Button primary submit>Save</Button>
                    </Card.Section>
                </Form>
            </Card>

        );
    }

}
