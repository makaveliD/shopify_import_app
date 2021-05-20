import React, {Component} from 'react'
import {
    Card,
    DataTable,
    DisplayText,
    Layout,
    Page,
    Stack,
    Heading,
    ProgressBar,
    Button,
    Banner, TextField
} from '@shopify/polaris';
import {TitleBar} from '@shopify/app-bridge-react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {useParams} from "react-router";


class CheckboxPro extends Component {
    state = {
        loading: true,
        cash: 0,
        balance:0
    }

    constructor(props) {
        super(props);
        this.getCheckboxData()
    }

    async getCheckboxData() {
        axios.get(`/api/checkbox/get_shift_status`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error;
                    this.setState({error: true, errors})
                }
                const checkbox = res.data;
                this.setState({checkbox, loading: false,balance: checkbox.balance});
            });
    }

    closeShift() {
        this.setState({loading: true});
        axios.get(`/api/checkbox/close_cashier_shift`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error;
                    this.setState({error: true, errors})
                }
                this.getCheckboxData()
            });
    }

    openShift() {
        this.setState({loading: true, error: false});
        axios.get(`/api/checkbox/create_cashier_shift`).then(res => {
                if (res.data.error) {
                    const errors = res.data.error;
                    console.log(errors)
                    this.setState({error: true, errors});
                    console.log(this.state)

                }
                this.getCheckboxData()

            });
    }

    getZReport() {
        this.setState({loading: true, error: false});
        axios.get(`/api/checkbox/get_z_report`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error;
                    this.setState({error: true, errors});
                } else if (res.data) {
                    const z_report = res.data;
                    this.setState({z_report: z_report})
                }
                this.getCheckboxData()

            });
    }

    createServiceReceipt() {
        this.setState({loading: true, error: false});
        axios.get(`/api/checkbox/create_service_receipt?cash=${this.state.cash}`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error;
                    this.setState({error: true, errors});
                } else if (res.data.balance) {
                    const balance = res.data.balance;
                    this.setState({balance:balance});
                }
                this.getCheckboxData()
            }).catch(error => {
            const errors = error.response.data.message;
            this.setState({error: true, errors});
            this.getCheckboxData()
        });
    }

    handleCashChange(value, id) {
        this.setState({cash: value});
    }

    render() {

        if (this.state.loading) {
            return (<ProgressBar progress={80} size="small"/>);
        }
        const status = this.state.checkbox.status;
        let button = '';
        if (this.state.checkbox.is_connected) {
            button = (
                <Button primary onClick={this.closeShift.bind(this)}>Close</Button>
            );
        } else {
            button = (
                <Button primary onClick={this.openShift.bind(this)}>Open</Button>
            );
        }

        let errorBanner = '';
        if (this.state.error) {
            errorBanner = (
                <Banner
                    title="Error"
                    status="critical"
                >
                    <p>
                        {this.state.errors}
                    </p>
                </Banner>
            );
        }
        let z_report = this.state.z_report
            ? (<Card sectioned>
                    <Stack alignment="baseline" distribution="fillEvenly">
                        <Stack.Item>
                            <div dangerouslySetInnerHTML={{__html: this.state.z_report}}></div>
                        </Stack.Item>
                    </Stack>
                </Card>
            )
            : '';

        return (
            <Page title="Checkbox RRO">
                {errorBanner} <br/>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <Stack alignment="baseline" distribution="fillEvenly">
                                <Stack.Item>
                                    <Heading>Checkbox Status</Heading>
                                </Stack.Item>
                                <Stack.Item>
                                    <div dangerouslySetInnerHTML={{__html: status}}/>
                                </Stack.Item>
                                <Stack.Item>
                                    {button}
                                </Stack.Item>
                            </Stack>
                        </Card>
                        <Card sectioned>
                            <Stack alignment="baseline" distribution="fillEvenly">
                                <Stack.Item>
                                    <Heading>Z-report</Heading>
                                </Stack.Item>
                                <Stack.Item>
                                </Stack.Item>
                                <Stack.Item>
                                    <Button primary onClick={this.getZReport.bind(this)}>Get</Button>
                                </Stack.Item>
                            </Stack>
                        </Card>
                        {z_report}
                        <Card sectioned>
                            <Stack alignment="baseline" distribution="fillEvenly">
                                <Stack.Item>
                                    <Heading>Official deposit / withdrawal of funds</Heading>
                                   <p><b>Balance: {this.state.balance}</b></p>
                                    <p><small>*deposit with + sign</small></p>
                                    <p><small>*withdrawal with - sign</small></p><br/>
                                    <TextField
                                        name="cash"
                                        id="checkbox_rro_cash"
                                        value={this.state.cash}
                                        onChange={this.handleCashChange.bind(this)}

                                    /><br/>
                                    <Button primary onClick={this.createServiceReceipt.bind(this)}>Change</Button>
                                </Stack.Item>
                            </Stack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }


}

export default withRouter(CheckboxPro);
