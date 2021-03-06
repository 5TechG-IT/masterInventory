import React from "react";
import {
    AppBar,
    Tab
} from "@material-ui/core";

import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// sub components
import BillManager from "./BillManager";
import NonGstBillHistory from "./NonGstBillHistory";
import GstBillHistory from "./GstBillHistory";
import Quotation from "./quotations";

function OrderManager() {
    const [value, setValue] = React.useState("1");

    const handleTabs = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <TabContext
            value={value}
            className="container-fluid border m-0 p-0 main"
        >
            <AppBar position="static" color="default">
                <TabList
                    onChange={handleTabs}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="New Bill" active value="1" />
                    <Tab label="Bill History (GST)" value="2" />
                    <Tab label="Bill History (Non GST)" value="3" />
                    <Tab label="Quotations" value="4" />
                </TabList>
            </AppBar>
            <TabPanel
                value="1"
                className="container-fluid"
                style={{ padding: "15px 18px 40px 10px" }}
            >
                <BillManager />
            </TabPanel>
            <TabPanel
                value="2"
                className="container-fluid"
                style={{ padding: "15px 18px 40px 10px" }}
            >
                <GstBillHistory />
            </TabPanel>
            <TabPanel
                value="3"
                className="container-fluid"
                style={{ padding: "15px 18px 40px 10px" }}
            >
                <NonGstBillHistory />
            </TabPanel>
            <TabPanel
                value="4"
                className="container-fluid"
                style={{ padding: "15px 18px 40px 10px" }}
            >
                <Quotation />
            </TabPanel>
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                autoClose={5000}
            />
        </TabContext>
    );
}

export default OrderManager;