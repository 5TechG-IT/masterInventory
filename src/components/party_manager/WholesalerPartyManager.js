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
// import "../ledger_manager/exportManager/node_modules/react-toastify/dist/ReactToastify.css";

//API handling components
import { API_URL } from "../../global";

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

export default class WholesalerPartyManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            showUpdateModel: false,
            value: "1",
            activeWholesalerId: "",
            activeWholesalerName: "",
            activeWholesalerMobile: "",
            activeWholesalerAadharNo: "",
            activeWholesalerAddress: "",
            activeWholesalerCity: "",
            activeWholesalerType: 3,
            wholesalersData: null,
        };
    }

    fetchPartiesData() {
        let url = API_URL;
        const query = `SELECT * FROM party WHERE type = 3 AND status=1;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("party data: ", res.data);
                this.setState({ wholesalersData: res.data });
            })
            .catch((err) => {
                console.log("party data error: ", err);
            });
    }

    handleUpdateSubmit(e) {
        e.preventDefault();
        let url = API_URL;

        const query = `UPDATE party SET name="${this.state.activeWholesalerName}", mobile="${this.state.activeWholesalerMobile}", aadharNo="${this.state.activeWholesalerAadharNo}", address="${this.state.activeWholesalerAddress}", city="${this.state.activeWholesalerCity}", type=${this.state.activeWholesalerType} WHERE id=${this.state.activeWholesalerId};`;
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
                }, 2000);            })
            .catch((err) => {
                console.log("error while updating party data", err);
            });
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let url = API_URL;

        const query = `INSERT INTO party(name, mobile,aadharNo, address,city, type) VALUES('${this.state.activeWholesalerName}', '${this.state.activeWholesalerMobile}','${this.state.activeWholesalerAadharNo}', '${this.state.activeWholesalerAddress}','${this.state.activeWholesalerCity}', ${this.state.activeWholesalerType})`;
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
                console.log(err);
            });
    }

    deleteRecord(id) {
        let url = API_URL;
        const query = `UPDATE party SET status = 0  WHERE id=${id};`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("deleted status data: ", res.data);
                console.log("Party deleted successfully");
                toast.error("Party deleted successfully");
                setTimeout(() => {
                    this.refreshParties();
                }, 2000);
            })
            .catch((err) => {
                console.log("record delete error: ", err);
            });
    }

    handleTabs = (event, newValue) => {
        this.setState({ value: newValue });
    };

    componentDidMount() {
        this.fetchPartiesData();
    }

    componentDidUpdate() {
        // const title = "Party data -" + moment().format("DD-MMMM-YYYY");
        $("#retailer_table").DataTable({
            destroy: true,
            keys: true,
            dom:
                "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
                "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
                "<'row'<'col-sm-12' tr>>" +
                "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
            buttons: [
                // "copy",
                {
                    extend: "csv",
                    
                    download: "open",
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4 ],
                    },
                },
                // "excelBootstrap4",
                {
                    extend: "print",
                   
                    download: "open",
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4],
                    },
                },
            ],
        });
    }

    renderPartiesData = () => {
        const wholesalers = this.state.wholesalersData;

        if (wholesalers == null) {
            return null;
        }

        return wholesalers.map((wholesaler) => {
            return (
                <tr>
                    <td align="center">
                        <Badge variant="primary">{wholesaler["id"]}</Badge>{" "}
                    </td>
                    <td align="center">{wholesaler["name"]}</td>
                    <td align="center">{wholesaler["mobile"]}</td>
                    <td align="center">{wholesaler["aadharNo"]}</td>
                    <td align="center">{wholesaler["address"]}</td>
                    <td align="center">
                        {wholesaler["city"] == null ? 0 : wholesaler["city"]}
                    </td>
                    <td align="center">
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={(e) => {
                                this.setState({
                                    activeWholesalerId: wholesaler["id"],
                                    activeWholesalerName: wholesaler["name"],
                                    activeWholesalerMobile: wholesaler["mobile"],
                                    activeWholesalerAadharNo: wholesaler["aadharNo"],
                                    activeWholesalerAddress: wholesaler["address"],
                                    activeWholesalerCity: wholesaler["city"],
                                    activeWholesalerType: wholesaler["type"],
                                    showUpdateModal: true,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faPenAlt} />
                        </Button>
                        <Link to={`ledgerManager/${wholesaler["id"]}`}>
                            <Button
                                className="mx-1"
                                color="primary"
                                variant="contained"
                                onClick={(e) => {}}
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
                                    this.deleteRecord(wholesaler["id"]);
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
                        Update Wholesaler
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate autoComplete="off">
                        <div className="mt-3">
                            <Row>
                                <Col size="12">
                                    <TextField
                                        id="WholesalerName"
                                        label="Wholesaler name"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={
                                            this.state.activeWholesalerName
                                        }
                                        onChange={(e) => {
                                            this.setState({
                                                activeWholesalerName: e.target.value,
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
                                            this.state.activeWholesalerMobile
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activeWholesalerMobile:
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
                                            this.state.activeWholesalerAadharNo
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activeWholesalerAadharNo:
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
                                            this.state.activeWholesalerAddress
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activeWholesalerAddress:
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
                                            this.state.activeWholesalerCity
                                        }
                                        onChange={(e) =>
                                            this.setState({
                                                activeWholesalerCity:
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
                                                this.state.activeWholesalerType
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    activeWholesalerType:
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
                                            <MenuItem value={3}>
                                                Wholesaler
                                            </MenuItem>
                                            <MenuItem value={4}>
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
                                add new wholesaler
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
                                    Add New wholesaler
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form noValidate autoComplete="off">
                                    <div className="mt-3">
                                        <Row>
                                            <Col size="12">
                                                <TextField
                                                    id="wholesalerName"
                                                    label="wholesaler name"
                                                    variant="outlined"
                                                    className="m-2"
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        this.setState({
                                                            activeWholesalerName:
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
                                                            activeWholesalerMobile:
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
                                                            activeWholesalerAadharNo:
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
                                                            activeWholesalerAddress:
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
                                                            activeWholesalerCity:
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
                                                        defaultValue={3}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                activePWholesalerType:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    >
                                                        <MenuItem value={3}>
                                                            WholesalerPartyManager
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
                                        className="display"
                                        style={{ width: "100%" }}
                                    >
                                        <thead>
                                            <tr align="center">
                                                <th>Wholesaler Id</th>
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