import React, { Component } from "react";

//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons-bs4/js/buttons.bootstrap4";
import $ from "jquery";

// styles
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";

// material UI imports
import {
  TableBody,
  TableContainer,
  Button,
  Paper,
  Box,
} from "@material-ui/core";
import { Row, Col, Button as Badge } from "react-bootstrap";

import moment from "moment";

// Toastify imports
import { toast } from "react-toastify";

//API handling components
import { API_URL } from "../../global";
import MonthlyCalander from "./MonthCalander";
const axios = require("axios");
require("jszip");
require("pdfmake");


class PresentyManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workerId: this.props.match.params.workerId,
      showUpdateModel: false,
      activeRecordId: null,
      activeWorkerId: null,
      workerData: null,
      PresentyData: null,
      status: "",
      reason: "",
      selectedMonth: null,
      totalPresenty: 0,
    };
  }

  fetchWorkerData() {
    if (!this.state.workerId) return null;

    let url = API_URL;
    const query = `SELECT * FROM worker WHERE id=${this.state.workerId};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        console.log("worker data: ", res.data);
        this.setState({ workerData: res.data });
      })
      .catch((err) => {
        console.log("worker data fetch error: ", err);
      });
  }

  fetchPresentyData = () => {
    if (!this.state.workerId) return null;

    let url = API_URL;
    const query = `SELECT * FROM presenty WHERE workerId=${this.state.workerId};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ PresentyData: res.data });
        this.initializeDataTable();
      })
      .catch((err) => {
      });
  };

  fetchTotalPresenty = () => {
    // if worker id is null
    if (!this.state.workerId) return null;

    let url = API_URL;
    const query = `SELECT COUNT(*) as total FROM presenty WHERE workerId=${this.state.workerId} and status=1;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ totalPresenty: res.data[0].total });
      })
      .catch((err) => {
      });
  };

  handleUpdateSubmit(e) {
    let url = API_URL;

    const query = `UPDATE presenty SET particular="${this.state.activeParticular}", debit="${this.state.activeDebit}", credit="${this.state.activeCredit}", balance="${this.state.activeBalance}" WHERE id=${this.state.activeRecordId};`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("presenty details updated successfully");
        this.fetchPresentyData();
      })
      .catch((err) => {
      });
  }

  handleAddPresenty(e) {
    e.preventDefault();
    let url = API_URL;
    const query = `INSERT INTO presenty(status, reason, workerId, date) values(${this.state.status
      }, "${this.state.reason}", ${this.state.workerId}, "${moment(
        new Date()
      ).format("YYYY-MM-DD")}");`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
      })
      .catch((err) => {
      });
  }

  refreshPresenty() {
    window.location.reload(false);
  }

  componentDidMount() {
    this.fetchWorkerData();
    this.fetchPresentyData();
    this.fetchTotalPresenty();
    this.setState({
      selectedMonth: new Date().getMonth() + 1,
    });
  }

  initializeDataTable() {
    const title = "Presenty-" + this.state.workerData[0].name;
    $("#presenty_table").DataTable({
      destroy: true,
      dom:
        "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
        "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
        "<'row'<'col-sm-12' tr>>" +
        "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
      buttons: [
        {
          extend: "csv",
          title,
          download: "open",
        },
        {
          extend: "print",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
        },
      ],
    });
  }

  renderWorkerData = () => {
    const worker = this.state.workerData;
    if (!worker) return null;

    return (
      <div className="mb-2">
        <h5 className="float-left mt-2">
          {worker[0]["id"]} | <b>{worker[0]["name"]}</b>
        </h5>
        <Button color="primary" variant="outlined" className="float-right pb-0">
          <h5>
            Total Presenty:&nbsp; &nbsp;
            <b>{this.state.totalPresenty}</b>
          </h5>
        </Button>
      </div>
    );
  };

  renderPresentyData = () => {
    if (this.state.PresentyData == null) {
      return null;
    }

    const presenty = this.state.PresentyData;
    let last_modified = null;
    let balance = 0;

    return presenty.map((record) => {
      // extract date only
      last_modified = moment(record["last_modified"]).format("D/MM/YYYY HH:MM");

      return (
        <tr key={record.id}>
          <td align="center">
            <Badge variant="primary">{record["id"]}</Badge>{" "}
          </td>
          <td>{moment(record["date"]).format("DD/MM/YYYY")}</td>
          <td>
            {record["status"] == 1
              ? "Present"
              : record["status"] == 2
                ? "Absent"
                : "Other"}
          </td>
          <td>{record["reason"] || "-"}</td>
          <td>{last_modified}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container-fluid border m-0 p-1">
        {this.renderWorkerData()}
        <br />
        <hr />
        <Row className="ml-0 mr-0">
          <Col md="5" className="p-0 m-0 measure1">
            <h5>This Month</h5>
            <Box p={2} display="flex" justifyContent="center">
              {this.state.selectedMonth && (
                <MonthlyCalander
                  month={this.state.selectedMonth}
                  workerId={this.state.workerId}
                />
              )}
            </Box>
          </Col>
          <Col md="7" className="p-0 m-0 measure1">
            <TableContainer component={Paper} style={{ maxHeight: "79vh" }}>
              <table
                id="presenty_table"
                className="display"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th align="center">ID</th>
                    <th align="center">Date</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>last modified</th>
                    {/* <th align="center">Actions</th> */}
                  </tr>
                </thead>
                <TableBody>{this.renderPresentyData()}</TableBody>
              </table>
            </TableContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PresentyManager;
