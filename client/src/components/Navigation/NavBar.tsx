import React, { Fragment, FunctionComponent, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Store, Orders, Cart, ModifyBookstore, Statistics} from "../../pages";
import { RouteComponentProps } from "react-router";
import { Header } from "../Fragments/Header";
import { UseToken } from "..";

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
    const { isTokenOwner } = UseToken();

    const indexToTabName: INumToStr = {
        0: 'store',
        1: 'orders',
        2: 'cart',
        3: "statistics",
        4: "modifyBookstore"
    }

    const tabNameToIndex: IStrToNum = {
        store: 0,
        orders: 1,
        cart: 2,
        statistics: 3,
        modifyBookstore: 4
    }

    const [selectedTab, setSelectedTab] = useState(tabNameToIndex[page]);

    // Change the selected tab
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        history.push(`/${indexToTabName[newValue]}`);
        setSelectedTab(newValue);
    };

    // Make the tabs 
    const makeTabs = () => {
        let primaryTabs = [
                <Tab label={Store.name} key={Store.name} />,
                <Tab label={Orders.name} key={Orders.name} />,
                <Tab label={Cart.name} key={Cart.name} />
        ]
        if (!isTokenOwner) return primaryTabs;

        // Owner tabs
        return [...primaryTabs,
                <Tab label={Statistics.name} key={Statistics.name} />,
                <Tab label={"Modify Bookstore"} key={ModifyBookstore.name} />];
    }

    return (
        <Fragment>
            <Header />
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="fullWidth"
            >
                {makeTabs()}
            </Tabs>
            {selectedTab === 0 && <Store />}
            {selectedTab === 1 && <Orders />}
            {selectedTab === 2 && <Cart />}
            {selectedTab === 3 && isTokenOwner && <Statistics />}
            {selectedTab === 4 && isTokenOwner && <ModifyBookstore />}
        </Fragment>
    );
}