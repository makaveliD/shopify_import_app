import React, { Component } from 'react'
import { Card, ResourceList, ResourceItem, TextStyle, ProgressBar, Pagination,Badge } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'
import axios from 'axios'
import jss from "jss";
import preset from "jss-preset-default";
import "jss-nested";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";

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


        const useStyles = makeStyles({
            root: {
                display: "grid",
                gridAutoFlow: "row",
                justifyItems: "left",
                //gridTemplateColumns: "20% 20% 20% 20% 20%",
                gridTemplateColumns: "16% repeat(3,minmax(10%,1fr)) 12%;",
                gridTemplateAreas: `
      "number time member paid fulfilled"
    `,
                "@media screen and (max-width < 900px)": {
                    backgroundColor: "blue",
                    height: 4000,
                    gridTemplateColumns: "minmax(15%,1fr) 25% 25% 15%;",
                    gridTemplateAreas: `
      "number member paid fulfilled"
      "time   member paid fulfilled"
      `
                }
            }
        });
        return (
            <Card sectioned title="Orders">
                <TitleBar title="Orders"/>
                <ResourceList
                    resourceName={{ singular: 'Order', plural: 'Orders' }}
                    items={this.state.settings}
                    renderItem={(item) => {
                        const classes = useStyles();
                        console.log(item);
                        return (
                            <ResourceItem
                                id={item.id}
                                url={`/order/${item.id}${window.location.search}`}
                                accessibilityLabel={`View details for ${item.email}`}
                                persistActions
                            >
                                <div className={clsx(classes && classes.root, "custom-row-override")}>
                                    <div className="id" style={{ gridArea: "number" }}>
                                        {item.id}
                                    </div>
                                    <div className="mail" style={{ gridArea: "time" }}>
                                        {item.email}
                                    </div>
                                    <div className="member" style={{ gridArea: "member" }}>
                                        {item.name}
                                    </div>
                                    <div className="paid" style={{ gridArea: "paid" }}>
                                        <Badge progress="complete">{item.financial_status}</Badge>
                                    </div>
                                    <div className="fulfilled" style={{ gridArea: "fulfilled" }}>
                                        <Badge status="attention" progress="incomplete">
                                            {item.fulfillment_status?item.fulfillment_status:'Unfulfilled'}
                                        </Badge>
                                    </div>
                                </div>
                            </ResourceItem>
                        )
                    }}>
                </ResourceList>
                <Card.Section>{pagination}</Card.Section>
            </Card>

        )
    }

}
