import React, { Component, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import moment from "moment";
import { Row, Col, Card, Table as Tbl } from "react-bootstrap";
import {
    TextField,
    Button,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
} from "@material-ui/core";

import Autocomplete, {
    createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import "./style.css";

import { API_URL } from "./../../global";

import logo from "./../../assets/images/logo.png";
import paymentQR from "./../../assets/images/paymentQR.png";

const axios = require("axios");

export default class BillManager extends Component {
    constructor(props) {
        super();

        this.state = {
            billId: null,
            partyId: 0,
            partyName: null,
            newPartyName: null,
            address: "",
            
            vehicleNo: null,
            billType: 2, // non gst

            date: moment(new Date()).format("YYYY-MM-DD"),

            particularValue: null,
            particular: null,
            hsn: "2201",
            partQty: 0,
            batch: "",
            description: "",
            rate: 0,
            amount: 0,

            itemList: [],
            addedItems: [],

            advance: 0,
            total: 0,
            balance: 0,
            paid: 0,
            sgst: 0,
            cgst: 0,
            igst: 0,

            grandTotal: 0,
            printComponentRef: null,

            partyList: null,

            latestInsertId: 0,

            productList: [],
        };
    }

    getIdPartyList() {
        let url = API_URL;
        // const query = `SELECT CONCAT(id, ', ', name) AS name, address FROM party;`;
        const query = `SELECT id, name, address FROM party;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("id+name data: ", res.data);
                this.setState({ partyList: res.data });
            })
            .catch((err) => {
                console.log("id + name fetch error: ", err);
            });
    }

    getLatestId = () => {
        let url = API_URL;
        const query = `SELECT id FROM gstBill ORDER BY id DESC LIMIT 1;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("latest id data: ", res.data);
                this.setState({
                    billId: (res.data[0] != null ? res.data[0]["id"] : 0) + 1,
                });
            })
            .catch((err) => {
                console.log("latest id data fetch error: ", err);
            });
    };

    fetchProducts = () => {
        const query = `SELECT name FROM products`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(API_URL, data)
            .then((res) => {
                let _res = res.data.map((item) => {
                    return item.name;
                });
                this.setState({ productList: _res });
                this.initializeDataTable();
            })
            .catch((err) => {
                console.log("productlist data fetch error: ", err);
            });
    };

    setPartyAddress = () => {
        if (this.state.partyId) {
            let address = this.state.partyList.find(
                (party) => party.id == this.state.partyId
            )?.address;

            this.setState({ address: address });
        }
    };

    caluclateWeight = (field, value) => {
        if (field === "totalBoxes") {
            let weight = value * this.state.weightPerBox;
            this.setState({ totalBoxes: value });
            this.setState({ weight: weight });
        } else if (field === "weightPerBox") {
            let weight = this.state.totalBoxes * value;
            this.setState({ weightPerBox: value });
            this.setState({ weight: weight });
        }
    };

    calculateAmount = (field, value) => {
        if (field === "weight") {
            let amount = value * this.state.rate;
            this.setState({ weight: value });
            this.setState({ amount: amount });
        } else if (field === "rate") {
            let amount = this.state.weight * value;
            this.setState({ rate: value });
            this.setState({ amount: amount });
        }
    };

    calculateTaxes = () => {
        const total = this.state.total;
        this.setState(
            {
                sgst: Number((total / 100) * 9).toFixed(2),
                cgst: Number((total / 100) * 9).toFixed(2),
                igst: Number((total / 100) * 18).toFixed(2),
            },
            this.calculateGrandTotal
        );
    };

    calculateGrandTotal = () => {
        let grandTotal;
        if (this.state.billType === 1) {
            grandTotal = Number(this.state.total) + Number(this.state.igst);
        } else {
            grandTotal = Number(this.state.total);
        }
        this.setState({ grandTotal: grandTotal.toFixed(2) });
    };

    addItems = () => {
        if (!this.state.particular || !this.state.rate) return;
        // let items = this.state.itemList;
        let items = this.state.addedItems;
        const ifExists = items.find(
            (item) => item.particular === this.state.particular
        );
        if (ifExists) {
            items = items.map((item) => {
                if (item.particular === this.state.particular) {
                    return {
                        particular: this.state.particular,
                        batch: this.state.batch,
                        partQty: +item.partQty + +this.state.partQty,
                        rate: +item.rate + +this.state.rate,
                        description: this.state.description,
                        amount:
                            +item.amount +
                            +this.state.rate * +this.state.partQty,
                    };
                }
            });
        } else {
            items.push({
                particular: this.state.particular,
                batch: this.state.batch,
                partQty: this.state.partQty,
                rate: this.state.rate,
                description: this.state.description,
                amount: this.state.rate * this.state.partQty,
            });
        }
        // items.push({
        //     particular: this.state.particular,
        //     mark: this.state.mark,
        //     totalBoxes: this.state.totalBoxes,
        //     weightPerBox: this.state.weightPerBox,
        //     weight: this.state.weight,
        //     rate: this.state.rate,
        //     amount: this.state.amount,
        // });

        this.setState({ addedItems: items });
        console.log(this.state.addedItems);

        // update total & balance
        // let total = Number(this.state.total) + Number(this.state.amount);
        let total =
            Number(this.state.total) +
            Number(this.state.rate * this.state.partQty);
        this.setState({ total: total }, this.calculateTaxes);
        let balance = total + Number(this.state.advance);
        this.setState({ balance: balance });
        // this.calculateTaxes();
    };

    deleteItem = (index) => {
        // let itemList = this.state.itemList;
        let itemList = this.state.addedItems;

        // update total & balance
        let total = this.state.total - itemList[index]["amount"];
        let balance = total + Number(this.state.advance);
        this.setState({ total: total }, this.calculateTaxes);
        this.setState({ balance: balance });

        // remove element
        // let updatedList = itemList.filter((item, _index) => {
        //     if (index !== _index) return item;
        // });
        // this.setState({ itemList: updatedList });
        let updatedList = itemList.filter((item, _index) => {
            if (index !== _index) return item;
        });
        this.setState({ addedItems: updatedList });
    };

    handleClear = () => {
        return null;
    };

    insertBillList = () => {
        let url = API_URL;
        const newDate = moment(new Date()).format("YYYY-MM-DD");
        // 1.  insert into deliveryMemoList
        this.state.addedItems.map((item, index) => {
            const query = `INSERT INTO billList(billType, billId, partyId, particular, quantity, rate, amount) VALUES(
            ${this.state.billType},
            ${this.state.billId},
            ${this.state.partyId},
            '${item.particular}', 
            ${item.partQty}, 
            ${item.rate}, 
            ${item.amount}
            )`;

            console.log(query);

            let data = { crossDomain: true, crossOrigin: true, query: query };
            axios
                .post(url, data)
                .then((res) => {
                    console.log("insert billList successfull, index: ", index);
                })
                .catch((err) => {
                    console.log("failed to insert billList, error: ", err);
                });
        });
    };

    insertLedgerRecord = () => {
        // 1.  insert into ledger
        const query = `INSERT INTO ledger(party_id, particular, total, memo_id) VALUES(${this.state.partyId}, 'reference memo id: ${this.state.latestInsertId}', ${this.state.total}, ${this.state.latestInsertId})`;

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(API_URL, data)
            .then((res) => {
                console.log("insert ledger successful");
                console.log("insert response: ", res.data.insertId);
            })
            .catch((err) => {
                console.log("failed to insert ledger, error: ", err);
            });
    };

    insertNewPartyAndSave = () => {
        const query = `INSERT INTO party (name, address) values("${this.state.newPartyName}", "${this.state.address}")`;
        const data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(API_URL, data)
            .then((res) => {
                console.log("insert party successful");
                console.log("insert response: ", res.data.insertId);
                this.setState({ partyId: res.data.insertId }, this.saveBill);
            })
            .catch((err) => {
                console.log("failed to insert party, error: ", err);
            });
    };

    saveBill = () => {
        const newDate = moment(new Date()).format("YYYY-MM-DD");
        let query;

        // for GST Bill
        if (this.state.billType === 1) {
            query = `INSERT INTO gstBill (partyId, date, vehicleNo, gstin , total,  balance, status , last_modified , gst, paid) values("
        ${this.state.partyId}", 
        "${newDate}",
        "${this.state.vehicleNo}",
        "${this.state.gstin}",  
        ${this.state.grandTotal},
        ${this.state.balance}+${this.state.igst}-${this.state.paid}, 
        1,
        ${newDate},
        ${this.state.igst},
        ${this.state.paid}
        )`;

            // for non GST bill
        } else {
            query = `INSERT INTO nonGstBill  (partyId, date, vehicleNo, total, balance, status, last_modified, paid) values("
        ${this.state.partyId}", 
        "${newDate}",
        "${this.state.vehicleNo}",
        ${this.state.grandTotal},
        ${this.state.balance}-${this.state.paid}, 
        1,
        ${newDate},
        ${this.state.paid}
        )`;
        }

        console.log(query);

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(API_URL, data)
            .then((res) => {
                toast.success("Generated Bill successfully");
                this.setState(
                    { billId: res.data.insertId },
                    this.insertBillList
                );
            })
            .catch((err) => {
                toast.error("Failed to Generate Bill ");
            });
    };

    handleSave = async (e) => {
        e.preventDefault();

        // check party already exists
        let partyId = this.state.partyId;
        if (partyId === null) {
            this.insertNewPartyAndSave();
        } else {
            this.saveBill();
        }
    };

    handleSavePrint = (e) => {
        console.log("in handle save print");
        // 1. handle save
        this.handleSave();
    };

    componentDidMount() {
        this.getLatestId();
        this.getIdPartyList();
        this.fetchProducts();
    }

    render() {
        return (
            <form className="mb-5" onSubmit={(e) => e.preventDefault()}>
                {/* Input Party Details */}

                <FormControl
                    style={{ minWidth: "250px" }}
                    className="mr-2 mb-2 smt-0"
                >
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        options={
                            this.state.partyList != null
                                ? this.state.partyList.map(
                                      (item) => item.id + ", " + item.name
                                  )
                                : []
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                // label="party name"
                                label="Party name"
                                variant="outlined"
                                size="small"
                                value={this.state.newPartyName}
                                onChange={(event) =>
                                    this.setState({
                                        newPartyName: event.target.value,
                                    })
                                }
                            />
                        )}
                        onChange={(event, value) => {
                            console.log(value);
                            if (value != null && value.length > 2) {
                                this.setState(
                                    {
                                        partyId: value.split(", ")[0],
                                        partyName: value.split(", ")[1],
                                    },
                                    this.setPartyAddress
                                );
                            } else {
                                this.setState({
                                    partyId: null,
                                    partyName: "",
                                });
                            }
                        }}
                    />
                </FormControl>

                <TextField
                    id="custAddress"
                    label="Address"
                    className="mr-2"
                    value={this.state.address}
                    onChange={(e) => this.setState({ address: e.target.value })}
                    // required="true"
                    size="small"
                />

                <TextField
                    id="vehicleNo"
                    label="Vehicle Number"
                    variant="outlined"
                    className="mr-2 mt-1"
                    value={this.state.vehicleNo}
                    onChange={(e) =>
                        this.setState({ vehicleNo: e.target.value })
                    }
                    // required="true"
                    size="small"
                />
                {/* <TextField
                    id="gstin"
                    label="GSTIN"
                    variant="outlined"
                    className="mr-2 mt-1"
                    value={this.state.gstin}
                    onChange={(e) => this.setState({ gstin: e.target.value })}
                    // required="true"
                    size="small"
                /> */}

                {/* <FormControl
                    variant="filled"
                    className="mr-2 mb-2"
                    style={{ minWidth: "180px" }}
                    size="small"
                >
                    <InputLabel id="demo-simple-select-outlined-label">
                        Bill Type
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={(e) =>
                            this.setState({ billType: e.target.value })
                        }
                        name="billType"
                        value={this.state.billType}
                        size="small"
                    >
                        <MenuItem value={1}>GST</MenuItem>
                        <MenuItem value={2}>Non GST</MenuItem>
                    </Select>
                </FormControl> */}

                <TextField
                    id="paid"
                    label="Paid"
                    variant="outlined"
                    className="mr-2 mt-2"
                    value={this.state.paid}
                    onChange={(e) => this.setState({ paid: e.target.value })}
                    // required="true"
                    size="small"
                />

                {/* End of Input Party Details */}

                <hr />

                <Row>
                    <Col>
                        <FormControl
                            style={{ minWidth: "250px" }}
                            className="mr-2 mb-2 smt-0"
                        >
                            <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                options={
                                    this.state.productList != null
                                        ? this.state.productList.map(
                                              (item) => item
                                          )
                                        : []
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        // label="party name"
                                        label="product"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                onChange={(event, value) => {
                                    // if (value != null && value.length > 2)
                                    //     this.setState({
                                    //         partyId: value.split(",")[0],
                                    //     });
                                    // this.setState({
                                    //     partyName: value.split(",")[1],
                                    // });
                                    this.setState({ particular: value });
                                }}
                            />
                        </FormControl>
                    </Col>
                    <Col>
                        <TextField
                            id="partQty"
                            label="Part Qty"
                            variant="outlined"
                            className="mr-2 mt-1"
                            value={this.state.partQty}
                            onChange={(e) =>
                                this.setState({ partQty: e.target.value })
                            }
                            required="true"
                            size="small"
                            type="number"
                        />
                    </Col>
                    <Col>
                        <TextField
                            id="rate"
                            label="Rate"
                            variant="outlined"
                            className="mr-2 mt-1"
                            value={this.state.rate}
                            onChange={(e) =>
                                this.setState({ rate: e.target.value })
                            }
                            required="true"
                            size="small"
                            type="number"
                        />
                    </Col>
                    <Col>
                        <Button
                            color="primary"
                            variant="contained"
                            className="mt-2"
                            onClick={this.addItems}
                        >
                            Add
                        </Button>
                    </Col>
                </Row>

                <div
                    className="mt-1 p-2 measure"
                    ref={(el) => (this.printComponentRef = el)}
                >
                    <Row>
                        <Col md={8} className="mx-auto">
                            <Card className="mt-2 p-0">
                                <Card.Header>
                                    <Row>
                                        <div className="col-5 col-md-5">
                                            <img
                                                src={logo}
                                                width="190"
                                                height="100"
                                            />
                                        </div>
                                        <div className="col-7 col-md-7">
                                            <Card.Title className=" pb-0 mb-0">
                                                <b>CBC | Car Beauty Care</b>
                                            </Card.Title>
                                            <hr />
                                            <p className=" pb-0 mb-0">
                                                Near diamond hotel, Mayani road,
                                                Vita, PIN: 415311
                                            </p>
                                        </div>
                                    </Row>
                                    <hr />
                                    <p className="text-center">
                                        Customer Care No. 7738557225
                                        &nbsp;&nbsp; | &nbsp;&nbsp;email ID:
                                        pravinshinde2689@gmail.com
                                    </p>
                                    <hr />

                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <p>
                                            Invoice No.{" "}
                                            <b>{this.state.billId}</b>
                                        </p>
                                        <p>
                                            Date:{" "}
                                            <b>
                                                {moment(new Date()).format(
                                                    "yyyy / MM / DD"
                                                )}
                                            </b>
                                        </p>
                                    </span>
                                    <Card.Title className="text-center pb-0 mb-0">
                                        <h5>
                                            <b>TAX INVOICE</b>
                                        </h5>
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body className="pb-3 mb-0">
                                    <Row>
                                        <div className="col-6 col-md-6">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Party name:{" "}
                                                <b>
                                                    {this.state.partyName ||
                                                        this.state.newPartyName}
                                                </b>
                                            </h6>
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Vehicle No.:{" "}
                                                <b>{this.state.vehicleNo}</b>
                                            </h6>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-6 col-md-6">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Address:{" "}
                                                <b>{this.state.address}</b>
                                            </h6>
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Sign:
                                            </h6>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-6 col-md-6">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Date:{" "}
                                                <b>
                                                    {moment(new Date()).format(
                                                        "DD / MM / YYYY"
                                                    )}
                                                </b>
                                            </h6>
                                        </div>
                                        <div className="col-6 col-md-6">
                                            {/* <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                GSTIN: <b>{this.state.gstin}</b>
                                            </h6> */}
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            ></h6>
                                        </div>
                                    </Row>
                                </Card.Body>
                                <Card.Body className="m-0 pt-0">
                                    {/* Order overview */}
                                    <Tbl striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Particular</th>
                                                <th>Quantity</th>
                                                <th>Rate</th>
                                                <th>Total</th>
                                                <th className="d-print-none">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        {this.state.addedItems.length > 0 ? (
                                            <tbody>
                                                {this.state.addedItems.map(
                                                    (item, index) => {
                                                        return (
                                                            // <tr key={"" + item.particularValue.title}>
                                                            //   <td>{item.particularValue.title} </td>
                                                            <tr
                                                                key={
                                                                    "" +
                                                                    item.particular
                                                                }
                                                            >
                                                                <td>
                                                                    {
                                                                        item.particular
                                                                    }{" "}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.partQty
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {item.rate}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.amount
                                                                    }
                                                                </td>
                                                                <td
                                                                    className="d-print-none"
                                                                    align="center"
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={() =>
                                                                            this.deleteItem(
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faTrash
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                                <br></br>
                                                {this.state.billType === 1 ? (
                                                    <>
                                                        <tr>
                                                            <td colSpan="4">
                                                                Total amount
                                                                before tax
                                                            </td>
                                                            <td colSpan="2">
                                                                {
                                                                    this.state
                                                                        .total
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="4">
                                                                SGST 9%
                                                            </td>
                                                            <td colSpan="2">
                                                                {
                                                                    this.state
                                                                        .sgst
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="4">
                                                                CGST 9%
                                                            </td>
                                                            <td colSpan="2">
                                                                {
                                                                    this.state
                                                                        .cgst
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="4">
                                                                IGST 18%
                                                            </td>
                                                            <td colSpan="2">
                                                                {
                                                                    this.state
                                                                        .igst
                                                                }
                                                            </td>
                                                        </tr>
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3">
                                                            Total amount
                                                        </td>
                                                        <td colSpan="2">
                                                            {this.state.total}
                                                        </td>
                                                    </tr>
                                                )}

                                                <tr>
                                                    <td colSpan="3">
                                                        Grand Total
                                                    </td>
                                                    <td colSpan="2">
                                                        {this.state.grandTotal}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="6">
                                                        No items added
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </Tbl>
                                </Card.Body>
                                <Card.Footer className="pb-3 mb-0">
                                    <Row>
                                        <div className="col-4 col-md-4">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Bank: <b>HDFC Bank, Vita</b>
                                            </h6>

                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Name :{" "}
                                                <b>Pravin Prabhakar Shinde</b>
                                            </h6>
                                        </div>
                                        <div className="col-4 col-md-4">
                                            <img
                                                src={paymentQR}
                                                height="100"
                                                width="100"
                                            />
                                        </div>
                                        <div className="col-4 col-md-4">
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Bank A/c: <b>50100205050845</b>
                                            </h6>
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                IFSC Code : <b>HDFC0002150</b>
                                            </h6>
                                        </div>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <ReactToPrint content={() => this.printComponentRef}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <Button
                                onClick={handlePrint}
                                className="mt-2 mr-1"
                                color="primary"
                                variant="contained"
                                style={{ float: "right" }}
                                disabled={
                                    (this.state.partyName ||
                                        this.state.newPartyName) &&
                                    this.state.address
                                        ? false
                                        : true
                                }
                            >
                                Print
                            </Button>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <Button
                    className="mt-2 mr-1"
                    color="secondary"
                    variant="contained"
                    style={{ float: "right" }}
                    // type="submit"
                    onClick={this.handleSave}
                    disabled={this.state.partyName ? false : true}
                >
                    Save bill
                </Button>
                <Button
                    className="mt-2 mr-1"
                    color="secondary"
                    variant="contained"
                    style={{ float: "right" }}
                    onClick={this.handleClear}
                >
                    clear
                </Button>
            </form>
        );
    }
}
