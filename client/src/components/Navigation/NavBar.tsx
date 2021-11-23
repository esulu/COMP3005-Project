import React, { Fragment, FunctionComponent } from "react";
import { Tabs, Tab } from "@mui/material";
import { Store, Orders, Cart } from "../../pages";
import { RouteComponentProps } from "react-router";
import { Header } from "../Fragments/Header";

interface INumToStr {
    [key: number]: string
}

interface IStrToNum {
    [key: string]: number
}

/**
 * Creates the navigation bar and updates the path for redirection
 */
export const NavBar: FunctionComponent<RouteComponentProps> = props => {
    const { match, history } = props;
    const params: any = match.params;
    const page = params.page;

    const indexToTabName: INumToStr = {
        0: 'store',
        1: 'orders',
        2: 'cart'
    }

    const tabNameToIndex: IStrToNum = {
        store: 0,
        orders: 1,
        cart: 2
    }

    const [selectedTab, setSelectedTab] = React.useState(tabNameToIndex[page]);

    // Change the selected tab
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        history.push(`/${indexToTabName[newValue]}`);
        setSelectedTab(newValue);
    };

    return (
        <Fragment>
            <Header />
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="fullWidth"
            >
                <Tab label={Store.name} />
                <Tab label={Orders.name} />
                <Tab label={Cart.name} />
            </Tabs>
            {selectedTab === 0 && <Store />}
            {selectedTab === 1 && <Orders />}
            {selectedTab === 2 && <Cart />}
        </Fragment>
    );
}