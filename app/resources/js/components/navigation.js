import { Navigation} from "@shopify/polaris";
import {OrdersMajor, SettingsMajor,ChecklistMajor} from "@shopify/polaris-icons";
import React, {Component} from "react";
import { withRouter  } from 'react-router-dom';

class Nav extends Component {

    render() {
        return(
            <Navigation location={this.props.location.pathname}>
                <Navigation.Section
                    items={[
                        {
                            url: `/orders${window.location.search}`,
                            label: 'Orders',
                            icon: OrdersMajor,
                            exactMatch: true

                        },
                        {
                            url: `/${window.location.search}`,
                            label: 'Settings',
                            icon: SettingsMajor,
                            exactMatch: true
                        },
                        {
                            url: `/checkbox${window.location.search}`,
                            label: 'Checkbox PPO',
                            icon: ChecklistMajor,
                            exactMatch: true
                        }
                    ]}
                />
            </Navigation>
        )
    }
}
export default withRouter(Nav)
