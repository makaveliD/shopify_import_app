import React, { Component } from 'react'
import { Card, ResourceList, ResourceItem, TextStyle, ProgressBar, Pagination } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'
import axios from 'axios'

export default class Orders extends Component {
    state = {
        loading: true
    }

    constructor (props) {
        super(props)

        axios.get(`/api/orders`)
            .then(res => {
                const settings = res.data.orders
                const links = res.data.links
                this.setState({ settings, loading: false, links })
            })
    }

    handlePagination = link => event => {
        this.setState({ loading: true })
        axios.get(`/api/orders?link=${link}`).then(res => {
            const settings = res.data.orders
            const links = res.data.links
            this.setState({ settings, loading: false, links })
        })
    }

    render () {
        const config = {
            apiKey: document.getElementById('apiKey').value,
            shopOrigin: document.getElementById('shopOrigin').value,
            forceRedirect: true
        }
        if (this.state.loading) {
            return (<ProgressBar progress={80} size="small"/>)
        }
        const pagination =(this.state.links)?(<Pagination
            hasPrevious={this.state.links.previous ? true : false}
            onPrevious={this.handlePagination(this.state.links.previous)}
            hasNext={this.state.links.next ? true : false}
            onNext={this.handlePagination(this.state.links.next)}
        />):'';
        return (

            <Card sectioned title="Orders">
                <TitleBar title="Orders"/>
                <ResourceList
                    resourceName={{ singular: 'Order', plural: 'Orders' }}
                    items={this.state.settings}
                    renderItem={(item) => {
                        return (
                            <ResourceItem
                                id={item.id}
                                url={`/order/${item.id}${window.location.search}`}
                                accessibilityLabel={`View details for ${item.email}`}
                            >
                                <h3>
                                    <TextStyle variation="strong">{item.total_price}</TextStyle>
                                </h3>
                                <div>{item.financial_status}</div>
                            </ResourceItem>
                        )
                    }}>
                </ResourceList>
                <Card.Section>{pagination}</Card.Section>
            </Card>

        )
    }

}
