import React, { Component } from 'react'
import {
    Banner,
    Button,
    Card,
    DataTable,
    DisplayText,
    Heading,
    Layout,
    Page,
    ProgressBar,
    Stack
} from '@shopify/polaris'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Order extends Component {
    state = {
        open: true,
        disclosureButton: 'hide',
        disclosureButton2: 'hide',
        loading: true,
        loading_checkbox: true,
        receipt: false,
        receipt_data: false,
        receipt_btn_status: false,
        refund_btn_status: false,
        refund_receipt: false,
        refund_receipt_data: false,
    }

    constructor (props) {
        super(props)
        this.getOrder()
        this.getCheckboxData()
    }

    handleToggleClick = () => {
        this.setState(state => {
            const open = !state.open
            const disclosureButton =
                state.disclosureButton === 'hide' ? 'show' : 'hide'
            return {
                open,
                disclosureButton
            }
        })
    }

    getOrder () {
        axios.get(`/api/orders/${this.props.match.params.id}`)
            .then(res => {
                const order = res.data
                this.setState({
                    order,
                    loading: false,
                    receipt: order.checkbox_receipt_id,
                    refund_receipt: order.checkbox_return_receipt_id
                })
            })
    }

    getCheckboxData () {
        axios.get(`/api/checkbox/get_shift_status`)
            .then(res => {

                const checkbox = res.data
                this.setState({ checkbox, loading_checkbox: false, balance: checkbox.balance })
            })
    }

    async generateReceipt () {
        this.setState({ loading_checkbox: true })

        axios.get(`/api/checkbox/create_receipt?order_id=${this.props.match.params.id}`)
            .then(res => {
                if (res.data.return_receipt.massage) {
                    const errors = res.data.error
                    this.setState({ error: true, errors })
                } else if (res.data.return_receipt) {
                    const receipt = res.data.return_receipt.id
                    this.setState({ receipt: receipt, loading_checkbox: false })

                }
                this.getCheckboxData()
            }).catch(err => {
            this.setState({ loading_checkbox: false })
        })
    }

    async showHideReceipt () {

        this.setState({ loading_checkbox: true })
        axios.get(`/api/checkbox/get_receipt_html?receipt_id=${this.state.receipt}`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error
                    this.setState({ error: true, errors })
                } else if (res.data) {
                    const receipt_data = res.data
                    this.setState({ loading_checkbox: false, receipt_data: receipt_data, receipt_btn_status: true })
                }
                this.getCheckboxData()
            }).catch(err => {
            this.setState({ loading_checkbox: false })
        })
    }

    async generateRefundReceipt () {
        this.setState({ loading_checkbox: true })

        axios.get(`/api/checkbox/create_receipt?order_id=${this.props.match.params.id}&is_return=true`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error
                    this.setState({ error: true, errors })
                } else if (res.data.return_receipt) {
                    const refund_receipt = res.data.return_receipt.id
                    this.setState({ refund_receipt: refund_receipt, loading_checkbox: false })
                }
                console.log(this.state)
                this.getCheckboxData()
            }).catch(err => {
            this.setState({ loading_checkbox: false })
        })
    }

    async showHideRefundReceipt () {

        this.setState({ loading_checkbox: true })
        axios.get(`/api/checkbox/get_receipt_html?receipt_id=${this.state.refund_receipt}`)
            .then(res => {
                if (res.data.error) {
                    const errors = res.data.error
                    this.setState({ error: true, errors })
                } else if (res.data) {
                    const refund_receipt_data = res.data
                    this.setState({
                        loading_checkbox: false,
                        refund_receipt_data: refund_receipt_data,
                        refund_receipt_btn_status: true,
                        refund_btn_status:true
                    })
                }
                this.getCheckboxData()
            }).catch(err => {
            this.setState({ loading_checkbox: false })
        })
    }

    getRefundReceiptTemplate () {
        if (this.state.receipt && this.state.refund_receipt) {
            return (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item fill>
                            <Heading>Refund receipt</Heading>
                        </Stack.Item>
                        <Stack.Item>
                            <Button primary disabled={this.state.refund_btn_status}
                                    onClick={this.showHideRefundReceipt.bind(this)}>Show</Button>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
        } else if (this.state.receipt) {
            return (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item fill>
                            <Heading>Generate refund receipt</Heading>
                        </Stack.Item>
                        <Stack.Item>
                            <Button primary onClick={this.generateRefundReceipt.bind(this)}>Generate</Button>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
        }
        return ''
    }

    renderHeading = (title, count, fulfilled = false) => {
        return (
            <Stack alignment="center" wrap={false}>
                <Stack.Item>
                    <Icon source={CircleTickMajorTwotone} backdrop color={'greenDark'}/>
                </Stack.Item>
                <Stack.Item>
                    <TextContainer spacing="tight">
                        <Heading>{title}</Heading>
                    </TextContainer>
                </Stack.Item>
                {count && (
                    <Stack.Item>
                        <Badge status={'success'}>{count}</Badge>
                    </Stack.Item>
                )}
            </Stack>
        )
    }

    render () {
        const footerContent = (
            <table>
                <body>Sub</body>
            </table>
        )
        if (this.state.loading || this.state.loading_checkbox) {
            return (<ProgressBar progress={80} size="small"/>)
        }

        const rows = this.state.order.line_items.map((item) => {
            return [
                item.name,
                `${this.state.order.currency} ${item.price}`,
                item.sku,
                item.quantity,
                `${this.state.order.currency} ${parseFloat(item.quantity * parseFloat(item.price).toFixed(2)).toFixed(2)}`
            ]
        })
        const status = this.state.checkbox.status
        const receipt = (this.state.receipt)
            ? (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item fill>
                            <Heading>Receipt</Heading>
                        </Stack.Item>
                        <Stack.Item>
                            <Button primary disabled={this.state.receipt_btn_status}
                                    onClick={this.showHideReceipt.bind(this)}>Show</Button>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
            : (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item fill>
                            <Heading>Generate receipt</Heading>
                        </Stack.Item>
                        <Stack.Item>
                            <Button primary onClick={this.generateReceipt.bind(this)}>Generate</Button>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
        const receipt_data = this.state.receipt_data
            ? (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item>
                            <div dangerouslySetInnerHTML={{ __html: this.state.receipt_data }}/>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
            : ''
        const refund_receipt_data = this.state.refund_receipt_data
            ? (
                <Card.Section>
                    <Stack alignment="center">
                        <Stack.Item>
                            <div dangerouslySetInnerHTML={{ __html: this.state.refund_receipt_data }}/>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            )
            : ''
        const refundReceipt = this.getRefundReceiptTemplate()
        const customer = (this.state.order.customer) ? (
            <Stack alignment="baseline" distribution="fillEvenly">
                <Stack.Item>
                    <Heading>Customer</Heading>
                </Stack.Item>
                <Stack.Item
                    fill>{`${this.state.order.customer.first_name} ${this.state.order.customer.last_name}`}</Stack.Item>
            </Stack>

        ) : ''
        let errorBanner = ''
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
            )
        }
        return (
            <Page breadcrumbs={[{ content: 'Orders', url: `/orders${window.location.search}` }]}
                  title={`#${this.state.order.id}`}
            >
                {errorBanner}<br/>
                <DisplayText size="medium">Order Details</DisplayText>
                <br/>
                <Layout>
                    <Layout.Section>
                        <Layout>
                            <Layout.Section>
                                <Card title="Data" sectioned>
                                    <Stack alignment="baseline" distribution="fillEvenly">
                                        <Stack.Item>
                                            <Heading>Order ID</Heading>
                                        </Stack.Item>
                                        <Stack.Item fill>{`#${this.state.order.id}`}</Stack.Item>
                                    </Stack>
                                    {customer}
                                    <Stack alignment="baseline" distribution="fillEvenly">
                                        <Stack.Item>
                                            <Heading>Email</Heading>
                                        </Stack.Item>
                                        <Stack.Item fill>{this.state.order.contact_email}</Stack.Item>
                                    </Stack>
                                    <Stack alignment="baseline" distribution="fillEvenly">
                                        <Stack.Item>
                                            <Heading>Status Payment</Heading>
                                        </Stack.Item>
                                        <Stack.Item fill>{this.state.order.financial_status}</Stack.Item>
                                    </Stack>
                                    <Stack alignment="baseline" distribution="fillEvenly">
                                        <Stack.Item>
                                            <Heading>Date</Heading>
                                        </Stack.Item>
                                        <Stack.Item
                                            fill>{new Intl.DateTimeFormat('en-GB').format(new Date(this.state.order.created_at))}</Stack.Item>
                                    </Stack>
                                </Card>
                            </Layout.Section>
                            <Layout.Section secondary>
                                <Card title="Shipment" sectioned>
                                    <Heading>Address</Heading>
                                    <p>
                                        {this.state.order.shipping_address ? this.state.order.shipping_address.name : ''}
                                    </p>
                                    <p>
                                        {this.state.order.shipping_address ? this.state.order.shipping_address.address1 : ''}
                                    </p>
                                    <p>
                                        {this.state.order.shipping_address ? this.state.order.shipping_address.city : ''}
                                    </p>
                                    <p>
                                        {this.state.order.shipping_address ? this.state.order.shipping_address.zip : ''}
                                    </p>
                                    <p>
                                        {this.state.order.shipping_address ? this.state.order.shipping_address.country : ''}
                                    </p>
                                    <Stack alignment="baseline" distribution="fillEvenly">
                                        <Stack.Item>
                                            <Heading>Phone</Heading>
                                        </Stack.Item>
                                        <Stack.Item
                                            fill>{this.state.order.shipping_address ? this.state.order.shipping_address.phone : ''}</Stack.Item>
                                    </Stack>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    </Layout.Section>
                    <Layout.Section>
                        <Card title="Order Details">
                            <Card.Section>
                                <DataTable
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'numeric',
                                        'numeric',
                                        'text'
                                    ]}
                                    headings={[
                                        'Product',
                                        'Price',
                                        'SKU Number',
                                        'Net quantity',
                                        'Total'
                                    ]}
                                    rows={rows}
                                />
                            </Card.Section>
                            <Card.Section>
                                <Stack alignment="baseline">
                                    <Stack.Item fill>
                                        <Heading>Sub Total</Heading>
                                    </Stack.Item>
                                    <Stack.Item>{this.state.order.currency} {this.state.order.subtotal_price}</Stack.Item>
                                </Stack>
                                <Stack alignment="baseline">
                                    <Stack.Item fill>
                                        <Heading>Tax</Heading>
                                    </Stack.Item>
                                    <Stack.Item>{this.state.order.currency} {this.state.order.total_tax}</Stack.Item>
                                </Stack>
                                <Stack alignment="baseline">
                                    <Stack.Item fill>
                                        <Heading>Shipment</Heading>
                                    </Stack.Item>
                                    <Stack.Item>{this.state.order.currency} {this.state.order.total_shipping_price_set.presentment_money.amount}</Stack.Item>
                                </Stack>
                                <Stack alignment="baseline">
                                    <Stack.Item fill>
                                        <Heading>Discounts</Heading>
                                    </Stack.Item>
                                    <Stack.Item>{this.state.order.currency} {this.state.order.total_discounts}</Stack.Item>
                                </Stack>
                                <Stack alignment="baseline">
                                    <Stack.Item fill>
                                        <Heading>Total</Heading>
                                    </Stack.Item>
                                    <Stack.Item>{this.state.order.currency} {this.state.order.total_price}</Stack.Item>
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card title="Checkbox RRO">
                            <Card.Section>
                                <Stack alignment="center">
                                    <Stack.Item fill>
                                        <Heading>Checkbox Status</Heading>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <div dangerouslySetInnerHTML={{ __html: status }}/>
                                    </Stack.Item>
                                </Stack>
                            </Card.Section>
                            {receipt}
                            {refundReceipt}
                            {receipt_data}
                            {refund_receipt_data}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }
}

export default withRouter(Order)
