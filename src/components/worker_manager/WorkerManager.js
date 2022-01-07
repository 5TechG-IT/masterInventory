import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

// material UI imports
import {
  AppBar,
  Tab,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Row, Col, Button as Btn1, Modal, Badge } from "react-bootstrap";

// font awasome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenAlt,
  faBook,
  faTrash,
  faSyncAlt,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

// Toastify imports
import { ToastContainer, toast } from "react-toastify";
// import "../ledger_manager/exportManager/node_modules/react-toastify/dist/ReactToastify.css";

//API handling components
import { API_URL } from "../../global";

// import child components
// import RetailerWorkerManager from "./RetailerWorkerManager";
// import DistributorWorkerManager from "./DistributorWorkerManager";

import moment from "moment";

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

class WorkerManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      showUpdateModel: false,
      value: "1",
      activeWorkerId: "",
      activeWorkerName: "",
      activeWorkerMobile: "",
      activeWorkerAddress: "",
      activeWorkerCity: "",
      activeWorkerType: 1,
      workersData: null,
      isLoadingWorkerData: false,
    };
  }

  fetchWorkersData() {
    let url = API_URL;
    const query = `SELECT * FROM worker WHERE status=1;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    this.setState({ isLoadingWorkerData: true });
    axios
      .post(url, data)
      .then((res) => {
        console.log("worker data: ", res.data);
        this.setState({ workersData: res.data, isLoadingWorkerData: false });
      })
      .catch((err) => {
        console.log("worker data error: ", err);
        this.setState({ isLoadingWorkerData: false });
      });
  }

  handleUpdateSubmit(e) {
    e.preventDefault();
    let url = API_URL;

    const query = `UPDATE worker SET name="${this.state.activeWorkerName}", mobile="${this.state.activeWorkerMobile}", address="${this.state.activeWorkerAddress}", city ='${this.state.activeWorkerCity}', type=${this.state.activeWorkerType} WHERE id=${this.state.activeWorkerId};`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("Worker details updated successfully");
        setTimeout(() => {
            this.refreshWorkers();
          }, 2000);
       
      })
      .catch((err) => {
        console.log("error while updating worker data", err);
      });
  }

  handleAddSubmit(e) {
    e.preventDefault();
    let url = API_URL;

    const query = `INSERT INTO worker(name, mobile, address,city, type) VALUES('${this.state.activeWorkerName}', '${this.state.activeWorkerMobile}', '${this.state.activeWorkerAddress}','${this.state.activeWorkerCity}', ${this.state.activeWorkerType})`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("worker details added successfully");
        setTimeout(() => {
          this.refreshWorkers();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteRecord(id) {
    let url = API_URL;
    const query = `UPDATE worker SET status = 0  WHERE id=${id};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        console.log("deleted status data: ", res.data);
        console.log("Worker deleted successfully");
        toast.error("Worker deleted successfully");
        setTimeout(() => {
          this.refreshWorkers();
        }, 2000);
      })
      .catch((err) => {
        console.log("record delete error: ", err);
      });
  }

  handleTabs = (event, newValue) => {
    this.setState({ value: newValue });
  };

  refreshWorkers() {
    window.location.reload(false);
  }

  componentDidMount() {
    this.fetchWorkersData();
  }

  componentDidUpdate() {
    const title = "Worker data -" + moment().format("DD-MMMM-YYYY");
    $("#worker_table").DataTable({
      destroy: true,
      keys: true,
      dom:
        "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
        "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
        "<'row'<'col-sm-12' tr>>" +
        "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
      buttons: [
        // "copy",
        "csv",
        // "excelBootstrap4",
        {
          extend: "print",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
        },
      ],
    });
  }

  renderWorkersData = () => {
    const workers = this.state.workersData;

    if (workers == null) {
      return null;
    }

    return workers.map((worker) => {
      return (
        <tr>
          <td align="center">
            <Badge variant="primary">{worker["id"]}</Badge>{" "}
          </td>
          <td align="center">{worker["name"]}</td>
          <td align="center">
            <a href={"tel:" + worker["mobile"]}>
              <Button className="mx-1" color="primary" variant="secondary">
                {worker["mobile"]}
              </Button>
            </a>
          </td>
          <td align="center">{worker["address"]}</td>
          
          <td align="center">
            {worker["city"] == null ? 0 : worker["city"]}
          </td>
          <td align="center">
            {worker["type"] == 1 ? "Retailer" : "Distributor"}
          </td>
          <td align="center">
            <Button
              color="secondary"
              variant="contained"
              onClick={(e) => {
                this.setState({
                  activeWorkerId: worker["id"],
                  activeWorkerName: worker["name"],
                  activeWorkerMobile: worker["mobile"],
                  activeWorkerAddress: worker["address"],
                  activeWorkerCity: worker["city"],
                  activeWorkerType: worker["type"],
                  showUpdateModal: true,
                });
              }}
            >
              <FontAwesomeIcon icon={faPenAlt} />
            </Button>
            <Link to={`ledgerManager/${worker["id"]}`}>
              <Button
                className="mx-1"
                color="primary"
                variant="contained"
                onClick={(e) => {}}
              >
                <FontAwesomeIcon icon={faBook} />
              </Button>
            </Link>
            <Link to={`presentyManager/${worker["id"]}`}>
              <Button
                className="mx-1"
                color="primary"
                variant="contained"
                onClick={(e) => {}}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
              </Button>
            </Link>
            <Button
              className="mx-1"
              color="danger"
              variant="contained"
              onClick={(e) => {
                if (window.confirm("Delete the item?")) {
                  this.deleteRecord(worker["id"]);
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

  renderAddWorkerModal() {
    return (
      <Modal
        show={this.state.showAddModal}
        onHide={(e) => this.setState({ showAddModal: false })}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Worker
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate autoComplete="off">
            <div className="mt-3">
              <Row>
                <Col size="12">
                  <TextField
                    id="workerName"
                    label="Worker name"
                    variant="outlined"
                    className="m-2"
                    defaultValue=""
                    onChange={(e) => {
                      this.setState({
                        activeWorkerName: e.target.value,
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
                        activeWorkerMobile: e.target.value,
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
                        activeWorkerAddress: e.target.value,
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
                        activeWorkerCity: e.target.value,
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
                        activeWorkerType: e.target.value,
                      })
                    }
                  >
                    <MenuItem value={1}>Retialer</MenuItem>
                    <MenuItem value={2}>Distributor</MenuItem>
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
    );
  }

  renderUpdateWorkerModal() {
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
            Update Worker
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate autoComplete="off">
            <div className="mt-3">
              <Row>
                <Col size="12">
                  <TextField
                    id="workerName"
                    label="Worker name"
                    variant="outlined"
                    className="m-2"
                    defaultValue={this.state.activeWorkerName}
                    onChange={(e) => {
                      this.setState({
                        activeWorkerName: e.target.value,
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
                    defaultValue={this.state.activeWorkerMobile}
                    onChange={(e) =>
                      this.setState({
                        activeWorkerMobile: e.target.value,
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
                    defaultValue={this.state.activeWorkerAddress}
                    onChange={(e) =>
                      this.setState({
                        activeWorkerAddress: e.target.value,
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
                    defaultValue={this.state.activeWorkerCity}
                    onChange={(e) =>
                      this.setState({
                        activeWorkerCity: e.target.value,
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
                      defaultValue={this.state.activeWorkerType}
                      onChange={(e) =>
                        this.setState({
                          activeWorkerType: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={1}>Retailer</MenuItem>
                      <MenuItem value={2}>Distributor</MenuItem>
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
      <TabContext
        value={this.state.value}
        className="container-fluid border m-0 p-0 main"
      >
       
        <TabPanel value="1" className="m-0 p-0">
          <div className="container-fluid border m-0 p-1">
            <div class="btn-group" role="group" aria-label="Basic example">
              <Button
                className="mt-1 mr-1 mb-3"
                color="secondary"
                variant="contained"
                size="small"
                onClick={(e) => {
                  this.setState({ showAddModal: true });
                }}
              >
                add new worker
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="mt-1 mr-1 mb-3 ml-5"
                onClick={this.refreshWorkers}
              >
                <FontAwesomeIcon icon={faSyncAlt} size="2x" />
              </Button>
            </div>

            {this.renderUpdateWorkerModal()}
            {this.renderAddWorkerModal()}
            <Row className="ml-0 mr-0">
              <Col md="12" className="p-0 m-0 measure1">
                <div>
                  {!this.state.isLoadingWorkerData && (
                    <table
                      id="worker_table"
                      className="display"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr align="center">
                          <th>Worker Id</th>
                          <th>Name</th>
                          <th>Mobile No</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>Type</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>{this.renderWorkersData()}</tbody>
                    </table>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </TabPanel>
        {/* <TabPanel value="2" className="m-0 p-0">
                    <RetailerWorkerManager />
                </TabPanel>
                <TabPanel value="3" className="m-0 p-0">
                    <DistributorWorkerManager />
                </TabPanel> */}

        <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={5000} />
      </TabContext>
    );
  }
}

export default WorkerManager;
