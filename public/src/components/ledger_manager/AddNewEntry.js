import React, { Component } from "react";
import { Badge, Card, Modal, Row, Col } from "react-bootstrap";

import {
    TextField,
    Button,
} from "@material-ui/core";
// import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// import { Row, Col, Card, Badge, Table as Tbl } from "react-bootstrap";
import "./style.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import ReactToPrint from "react-to-print";
// import moment from "moment";

//API handling components
import { API_URL } from "./../../global";
import { truncateSync } from "fs";
const axios = require("axios");


export class AddNewEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            partyId: this.props.partyId,
            particular: null,
            debit: null,
            credit: null,
            balance: null
        }
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let url = API_URL + "/";

        const query = `INSERT INTO ledger(party_id, particular, debit, credit, balance) VALUES(${this.state.partyId}, '${this.state.particular}', ${this.state.debit}, ${this.state.credit}, ${this.state.balance});`;

        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        axios
            .post(url, data)
            .then((res) => {
                console.log("ledger record added successfully");
                toast.success("ledger record added successfully");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (

            <div className="row">
                <form autoComplete="off" className="mt-4">
                    <div className="row ml-4">
                        <Card style={{width:'1250px'}}>
                            <Card.Body className="mt-0 pt-3">
                                <div>
                                    <div className="mt-3">
                                        <TextField
                                            id="particular"
                                            label="particular"
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                            className="mr-2"
                                            required={true}
                                            onChange={(e) => this.setState({ particular: e.target.value })}
                                        />
                                        <TextField
                                            id="debit"
                                            label="debit"
                                            variant="outlined"
                                            type="number"
                                            size="small"
                                            className="mr-2"
                                            onChange={(e) => this.setState({ debit: e.target.value })}
                                        />
                                        <TextField
                                            id="credit"
                                            label="credit"
                                            variant="outlined"
                                            className="mr-2"
                                            type="number"
                                            size="small"
                                            onChange={(e) => this.setState({ credit: e.target.value })}
                                        />
                                        <TextField
                                            id="balance"
                                            label="balance"
                                            variant="outlined"
                                            className="mr-2"
                                            type="number"
                                            size="small"
                                            onChange={(e) => this.setState({ balance: e.target.value })}
                                        />
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            onClick={(e) => this.handleAddSubmit(e)}
                                        >
                                            Add
                                        </Button>

                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </form>
                <ToastContainer />
            </div>
        );
    }
}

