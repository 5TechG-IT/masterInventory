import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

// material UI imports
import {
    Button,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
} from "@material-ui/core";
import { Row, Col, Button as Btn1, Modal, Badge } from "react-bootstrap";

// font awasome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenAlt,
    faBook,
    faTrash,
    faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

// Toastify imports
import { ToastContainer, toast } from "react-toastify";
//API handling components
import { API_URL } from "./../../global";

// datatable setup
import jsZip from "jszip";
window.JSZip = jsZip;
var $ = require("jquery");
$.DataTable = require("datatables.net");
require("datatables.net-bs4");
require("datatables.net-autofill-bs4");
require("datatables.net-buttons-bs4");
require("datatables.net-buttons/js/buttons.colVis");
require("datatables.net-buttons/js/buttons.flash");
require("datatables.net-buttons/js/buttons.html5");
require("datatables.net-buttons/js/buttons.print");
require("datatables.net-responsive-bs4");
require("datatables.net-scroller-bs4");
require("datatables.net-select-bs4");
require("pdfmake");

// constants
const axios = require("axios");

export default class RetailerPartyManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            showUpdateModel: false,
            value: "1",
            activePartyId: "",
            activePartyName: "",
            activePartyMobile: "",
            activePartyAadharNo: null,
            activePartyAddress: "",
            activePartyCity: "",
            activePartyType: 1,
            partiesData: null,
        };
    }

    fetchPartiesData() {
        let url = API_URL;
        const query = `SELECT * FROM party WHERE type = 1 AND status=1;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                this.setState({ partiesData: res.data });
            })
            .catch((err) => {
                console.log("party data error: ", err);

            });
    }

    handleUpdateSubmit(e) {
        e.preventDefault();
        let url = API_URL;

        const query = `UPDATE party SET name="${this.state.activePartyName}", mobile="${this.state.activePartyMobile}",aadharNo="${this.state.activePartyAadharNo}", address="${this.state.activePartyAddress}",city="${this.state.activePartyCity}", type=${this.state.activePartyType} WHERE id=${this.state.activePartyId};`;
        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        axios
            .post(url, data)
            .then((res) => {
                toast.success("Party details updated successfully");
                setTimeout(() => {
                    this.refreshParties();
                }, 2000);
            })
            .catch((err) => {
                toast.error("error while updating party");
            });
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let url = API_URL;

        const query = `INSERT INTO party(name, mobile, address,city,aadharNo, type) VALUES('${this.state.activePartyName}', '${this.state.activePartyMobile}', '${this.state.activePartyAddress}', '${this.state.activePartyCity}','${this.state.activePartyAadharNo}', ${this.state.activePartyType})`;
        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        axios
            .post(url, data)
            .then((res) => {
                toast.success("party details added successfully");
                setTimeout(() => {
                    this.refreshParties();
                }, 2000);
            })
            .catch((err) => {
                toast.error("party details not added successfully");
            });
    }

    deleteRecord(id) {
        let url = API_URL;
        const query = `UPDATE party SET status = 0  WHERE id=${id};`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                toast.error("Party deleted successfully");
                setTimeout(() => {
                    this.refreshParties();
                }, 2000);
            })
            .catch((err) => {
                toast.success("record deleted successfully");
            });
    }

    handleTabs = (event, newValue) => {
        this.setState({ value: newValue });
    };

    componentDidMount() {
        this.fetchPartiesData();
    }

    componentDidUpdate() {
        $(document).ready(function () {
            $("#retailer_table").DataTable({
                destroy: true,
                keys: true,
                rowReorder: {
                    selector: 'td:nth-child(2)'
                },
                responsive: true,
                dom:
                    "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
                    "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
                    "<'row'<'col-sm-12' tr>>" +
                    "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
                buttons: [
                    {
                        extend: "csv",

                        download: "open",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4],
                        },
                    },
                    {
                        extend: "print",

                        download: "open",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4],
                        },
                    },
                ],
            });
        });
    }

    renderPartiesData = () => {
        const parties = this.state.partiesData;

        if (parties == null) {
            return null;
        }

        return parties.map((party) => {
            return (
                <tr>
                    <td align="center">
                        <Badge variant="primary">{party["id"]}</Badge>{" "}
                    </td>
                    <td align="center">{party["name"]}</td>
                    <td align="center">{party["mobile"]}</td>
                    <td align="center">{party["aadharNo"]}</td>
                    <td align="center">{party["address"]}</td>
                    <td align="center">
                        {party["city"] == null ? 0 : party["city"]}
                    </td>
                    <td align="center">
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={(e) => {
                                this.setState({
                                    activePartyId: party["id"],
                                    activePartyName: party["name"],
                                    activePartyMobile: party["mobile"],
                                    activePartyAadharNo: party["aadharNo"],
                                    activePartyAddress: party["address"],
                                    activePartyCity: party["city"],
                                    activePartyType: party["type"],
                                    showUpdateModal: true,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faPenAlt} />
                        </Button>
                        <Link to={`ledgerManager/${party["id"]}`}>
                            <Button
                                className="mx-1"
                                color="primary"
                                variant="contained"
                                onClick={(e) => { }}
                            >
                                <FontAwesomeIcon icon={faBook} />
                            </Button>
                        </Link>
                        <Button
                            className="mx-1"
                            color="danger"
                            variant="contained"
                            onClick={(e) => {
                                if (window.confirm("Delete the item?")) {
                                    this.deleteRecord(party["id"]);
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

    refreshParties() {
        window.location.reload(false);
    }

    renderUpdatePartyModal() {
        return (
            <Modal
                show={this.state.showUpdateModal}
                onHide={(e) => this.setState({ showUpdateModal: false })}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Party
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate autoComplete="off">
                        <div className="mt-3">
                            <Row>
                                <Col size="12">
                                    <TextField
                                        id="partyName"
                                        label="Party name"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activePartyName
                                        }
                                        onChange={(e) => {
                                            this.setState({
                                                activePartyName: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        id="mobile"
                                        label="Mobile"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activePartyMobile
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activePartyMobile:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        id="aadharNo"
                                        label="Aadhar No"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activePartyAadharNo
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activePartyAadharNo:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="address"
                                        s
                                        label="Address"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activePartyAddress
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activePartyAddress:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        id="city"
                                        s
                                        label="city"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activePartyCity
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activePartyCity:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col>
                                    <FormControl
                                        variant="filled"
                                        style={{
                                            minWidth: "120px",
                                        }}
                                        className="mt-2 ml-2"
                                    >
                                        <InputLabel id="demo-simple-select-outlined-label">
                                            Type
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            label="type"
                                            defaultValue={
                                                this.state.activePartyType
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    activePartyType:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <MenuItem value={1}>
                                                Retailer
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                Distributor
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                Wholesaler
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                Customer
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Col>
                            </Row>
                        </div>
                        <hr />
                        <div className="mt-2 mr-1">
                            <Btn1
                                style={{ float: "right" }}
                                onClick={(e) => {
                                    this.setState({
                                        showUpdateModal: false,
                                    });
                                    this.handleUpdateSubmit(e);
                                }}
                            >
                                Update
                            </Btn1>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
    render() {
        return (
            <div className="container-fluid border m-0 p-0 main">
                <div className="m-0 p-0">
                    <div className="container-fluid border m-0 p-1">
                        <div
                            class="btn-group"
                            role="group"
                            aria-label="Basic example"
                        >
                            <Button
                                className="mt-1 mr-1 mb-3"
                                color="secondary"
                                variant="contained"
                                size="small"
                                onClick={(e) => {
                                    this.setState({ showAddModal: true });
                                }}
                            >
                                add new retailer
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="mt-1 mr-1 mb-3 ml-5"
                                onClick={this.refreshParties}
                            >
                                <FontAwesomeIcon icon={faSyncAlt} size="2x" />
                            </Button>
                        </div>

                        {this.renderUpdatePartyModal()}
                        <Modal
                            show={this.state.showAddModal}
                            onHide={(e) =>
                                this.setState({ showAddModal: false })
                            }
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Add New Retailer
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form noValidate autoComplete="off">
                                    <div className="mt-3">
                                        <Row>
                                            <Col size="12">
                                                <TextField
                                                    id="partyName"
                                                    label="Party name"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        this.setState({
                                                            activePartyName:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col>
                                                <TextField
                                                    id="mobile"
                                                    label="Mobile"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        this.setState({
                                                            activePartyMobile:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                            <Col>
                                                <TextField
                                                    id="aadharNo"
                                                    label="Aadhar No"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        this.setState({
                                                            activePartyAadharNo:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <TextField
                                                    id="address"
                                                    s
                                                    label="Address"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        this.setState({
                                                            activePartyAddress:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                            <Col>
                                                <TextField
                                                    id="city"
                                                    s
                                                    label="city"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        this.setState({
                                                            activePartyCity:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                            <Col>
                                                <FormControl
                                                    variant="filled"
                                                    style={{
                                                        minWidth: "120px",
                                                    }}
                                                    className="mt-2 ml-2"
                                                >
                                                    <InputLabel id="demo-simple-select-outlined-label">
                                                        Type
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        label="type"
                                                        defaultValue={1}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                activePartyType:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    >
                                                        <MenuItem value={1}>
                                                            RetailerPartyManager
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr />
                                    <div className="mt-2 mr-1">
                                        <Btn1
                                            style={{ float: "right" }}
                                            onClick={(e) => {
                                                this.setState({
                                                    showAddModal: false,
                                                });
                                                this.handleAddSubmit(e);
                                            }}
                                        >
                                            Add
                                        </Btn1>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                        <Row className="ml-0 mr-0">
                            <Col md="12" className="p-0 m-0 measure1">
                                <div>
                                    <table
                                        id="retailer_table"
                                        class="display nowrap"
                                        style={{ width: "100%" }}
                                    >
                                        <thead>
                                            <tr align="center">
                                                <th>Party Id</th>
                                                <th>Name</th>
                                                <th>Mobile No</th>
                                                <th>Aadhar No</th>
                                                <th>Address</th>
                                                <th>city</th>
                                                <th>Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderPartiesData()}
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <ToastContainer
                    position={toast.POSITION.TOP_RIGHT}
                    autoClose={5000}
                />
            </div>
        );
    }
}