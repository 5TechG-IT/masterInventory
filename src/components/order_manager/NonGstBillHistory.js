import React, { Component } from "react";
import { Row, Col, Modal, Card, Table as Tbl } from "react-bootstrap";

//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { toast } from "react-toastify";

import moment from "moment";

import { Button, TextField } from "@material-ui/core";

// font awasome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenAlt,
    faEye,
    faTrash,
    faEdit,
} from "@fortawesome/free-solid-svg-icons";

//API handling components
import { API_URL } from "../../global";

import logo from "./../../assets/images/logo.png";
import paymentQR from "./../../assets/images/paymentQR.png";

const axios = require("axios");

export default class NonbillHistory extends Component {
    constructor(props) {
        super();

        this.state = {
            billList: null,
            showUpdateModel: false,
            activeBillId: null,
            activePaid: 0,

            aadharCard: null,
            balance: 0,
            code: null,
            date: null,
            paid: 0,
            partyId: null,
            pname: null,
            total: 0,
            vehicleNo: null,

            itemsList: [],
            isLoadingItems: false,
        };
    }

    fetchBillList = () => {
        let url = API_URL;
        const query = `SELECT ngb.*, p.name as pname, p.address as address FROM nonGstBill as ngb inner join party as p where ngb.partyId = p.id AND ngb.status=1 ORDER BY ngb.id DESC`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("bill: ", res.data);
                this.setState({ billList: res.data });

                // init data table
                this.initializeDataTable();
            })
            .catch((err) => {
                console.log("non gst bill list fetch error: ", err);
            });
    };

    fetchBillItemList = () => {
        let url = API_URL;
        const query = `SELECT bl.* FROM billList as bl inner join nonGstBill as ngb on bl.billId=ngb.id where bl.billId= ${this.state.activeBillId}`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("bill list data: ", res.data);
                this.setState({ itemsList: res.data });

                // init data table
                this.initializeDataTable();
            })
            .catch((err) => {
                console.log("bill list fetch error: ", err);
            });
    };

    deleteRecord(id) {
        let url = API_URL;
        const query = `UPDATE bill SET status = 0  WHERE id=${id};`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("deleted status data: ", res.data);
                console.log("item deleted successfully");
                toast.success("Record deleted successfully");
                this.fetchBillList();
            })
            .catch((err) => {
                console.log("record delete error: ", err);
            });
    }

    initializeDataTable() {
        $(document).ready(function () {
            $("#billList").DataTable();
        });
    }

    initializeData() {
        this.fetchBillList();
    }
    componentDidMount() {
        this.initializeData();
    }

    handleUpdateSubmit(e) {
        let url = API_URL;
        const query = `UPDATE bill SET balance = balance - ${this.state.activePaid}, paid = paid + ${this.state.activePaid} WHERE id=${this.state.activeBillId};`;

        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        axios
            .post(url, data)
            .then((res) => {
                toast.success("Bill details updated successfully");
                this.fetchBillList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderMemoList = () => {
        if (this.state.billList == null) return null;

        // else
        return this.state.billList.map((bill) => {
            return (
                <tr align="center">
                    <td>{bill.id}</td>
                    <td>{bill.pname}</td>
                    <td>{bill.total}</td>
                    <td>{bill.paid}</td>
                    <td>{bill.balance}</td>
                    <td>{moment(bill.date).format("DD / MM / YYYY")}</td>
                    <td className="d-flex justify-content-center">
                        &nbsp;
                        <Button
                            className="mt-2"
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                this.setState(
                                    {
                                        activeBillId: bill.id,
                                        showDisplayBillModal: true,
                                        aadharCard: bill.aadharCard,
                                        code: bill.code,
                                        date: bill.date,
                                        partyName: bill.pname,
                                        address: bill.address,
                                        total: bill.total,
                                        vehicleNo: bill.vehicleNo,
                                    },
                                    this.fetchBillItemList
                                );
                            }}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                            className="mt-2"
                            color="secondary"
                            variant="contained"
                            onClick={() => {
                                this.setState({
                                    activeBillId: bill.id,
                                    showUpdateModel: true,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                            className="mt-2"
                            color="danger"
                            variant="contained"
                            onClick={(e) => {
                                if (window.confirm("Delete the item?")) {
                                    this.deleteRecord(bill.id);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    renderUpdateModal = () => {
        return (
            <Modal
                show={this.state.showUpdateModel}
                onHide={(e) => this.setState({ showUpdateModel: false })}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update bill
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate autoComplete="off">
                        <div className="mt-3">
                            <Row>
                                <Col xs={12}>
                                    <TextField
                                        id="pending"
                                        label="Paid"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue=""
                                        value={this.state.activePaid}
                                        onChange={(e) =>
                                            this.setState({
                                                activePaid: e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>

                        <div className="mt-2 mr-1">
                            <Button
                                style={{ float: "right" }}
                                onClick={(e) => {
                                    this.setState({
                                        showUpdateModel: false,
                                    });
                                    this.handleUpdateSubmit(e);
                                }}
                                variant="contained"
                                color="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    };

    renderDisplayBillModal = () => {
        return (
            <Modal
                show={this.state.showDisplayBillModal}
                onHide={(e) => this.setState({ showDisplayBillModal: false })}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Bill details
                    </Modal.Title>
                </Modal.Header>
                <div className="mt-1 measure">
                    <Row>
                        <Col className="mx-auto">
                            <Card className="p-0">
                                <Card.Header>
                                    <Row>
                                        <Col md={4}>
                                            <img
                                                src={logo}
                                                width="190"
                                                height="100"
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <Card.Title className=" pb-0 mb-0">
                                                <b>CBC | Car Beauty Care</b>
                                            </Card.Title>
                                            <hr />
                                            <p className=" pb-0 mb-0">
                                                Near diamond hotel, Mayani road,
                                                Vita, PIN: 415311
                                            </p>
                                        </Col>
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
                                            <b>{this.state.activeBillId}</b>
                                        </p>
                                        <p>
                                            Date{" "}
                                            <b>
                                                {moment(this.state.date).format(
                                                    "D / M / YYYY"
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
                                        <Col md={6}>
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
                                        </Col>
                                        <Col md={6}>
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Vehicle No.:{" "}
                                                <b>{this.state.vehicleNo}</b>
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Address:{" "}
                                                <b>{this.state.address}</b>
                                            </h6>
                                        </Col>
                                        <Col md={6}>
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Sign:
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
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
                                        </Col>
                                        <Col md={6}>
                                            <h6
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            ></h6>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Body className="m-0 pt-0">
                                    {/* Order overview */}
                                    <Tbl striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Particular</th>
                                                <th>Part Qty.</th>
                                                <th>Rate</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        {this.state.itemsList.length > 0 ? (
                                            <tbody>
                                                {this.state.itemsList.map(
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
                                                                        item.quantity
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
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                                <br></br>
                                                <tr>
                                                    <td colSpan="3">
                                                        Total amount
                                                    </td>
                                                    <td colSpan="2">
                                                        {this.state.total}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colSpan="3">
                                                        Grand Total
                                                    </td>
                                                    <td colSpan="2">
                                                        {this.state.total}
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
                                        <Col md={4}>
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
                                        </Col>
                                        <Col md={4}>
                                            <img
                                                src={paymentQR}
                                                height="200"
                                                width="200"
                                            />
                                        </Col>
                                        <Col md={4}>
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
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    render() {
        return (
            <div>
                <Row>
                    <Col
                        md="12"
                        className="m-0 p-1 measure1"
                        style={{ minHeight: "85vh" }}
                    >
                        <div>
                            <table
                                id="billList"
                                className="display"
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr align="center">
                                        <th align="center">Bill Id</th>
                                        <th align="center">Party Name</th>
                                        <th align="center">Total</th>
                                        <th align="center">Paid</th>
                                        <th align="center">Balance</th>
                                        <th align="center">Date</th>
                                        <th align="center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderMemoList()}</tbody>
                            </table>
                            {this.renderUpdateModal()}
                            {this.renderDisplayBillModal()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
