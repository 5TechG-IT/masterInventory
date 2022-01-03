import React, { useState, useEffect } from "react";
import {
    TextField,
    AppBar,
    Tab,
    Button,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
} from "@material-ui/core";

import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import Autocomplete, {
    createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import { Row, Col, Card, Table as Tbl } from "react-bootstrap";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";
import moment from "moment";

// sub components
import BillManager from "./BillManager";
import NonGstBillHistory from "./NonGstBillHistory";
import GstBillHistory from "./GstBillHistory";

function OrderManager() {
    const [value, setValue] = React.useState(null);

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
                    <Tab  label="New Bill" value="1" />
                    <Tab label="Bill History (GST)" value="2" />
                    <Tab label="Bill History (Non GST)" value="3" />
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
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                autoClose={5000}
            />
        </TabContext>
    );
}

export default OrderManager;