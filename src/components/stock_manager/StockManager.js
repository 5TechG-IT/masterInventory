import React, { Component } from "react";

//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
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
  TextField,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
} from "@material-ui/core";
import { Row, Col, Button as Btn1, Modal, Badge } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

// Toastify imports
import { toast } from "react-toastify";

// import child components
import { AddNewEntry } from "./AddNewEntry.js";

//API handling components
import { API_URL } from "./../../global";
const axios = require("axios");

export default class StockManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partyId: 0,
      showAddModal: false,
      showUpdateModel: false,
      activeProduct: null,
      activeQuantity: null,
      activeAmount: null,
      activePaid: null,
      activePending: null,
      totalBalance: 0,

      productCount: null,
      LedgerData: null,
      isLoadingLedger: false,
      products: [
        "preform_500_ml",
        "perform_1_lit",
        "preform_2_lit",
        "l_dawar_500_ml",
        "l_dawar_1_lit",
        "l_dawar_2_lit",
        "l_dawar_5_lit",
        "l_dawar_20_lit",
        "l_warana_1_lit",
        "green_cap",
        "blue_cap",
        "white_cap",
        "b_dawar_500_ml",
        "b_dawar_1_lit",
        "b_dawar_2_lit",
        "b_warana_1_lit",
        "can_5_lit",
        "jar_20_lit",
        "handle_2_lit",
        "cello_tape",
      ],
    };
  }

  fetchProductCount() {
    const query = `SELECT * FROM stockCount;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log("stockCount data: ", res.data);
        this.setState({ productCount: res.data });
        this.initializeDataTable();
      })
      .catch((err) => {
        console.log("stockCount data fetch error: ", err);
      });
  }

  fetchLedgerData = () => {
    const query = `SELECT * FROM stockLedger WHERE status=1;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    this.setState({ isLoadingLedger: true });
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log("BTledger data: ", res.data);
        this.setState({ LedgerData: res.data, isLoadingLedger: false });
        this.initializeDataTable();
      })
      .catch((err) => {
        console.log("BTledger data fetch error: ", err);
        this.setState({ isLoadingLedger: false });
      });
  };

  handleUpdateSubmit(e) {
    let url = API_URL;

    const query = `UPDATE stockLedger SET paid = paid + ${this.state.activePaid}, pending = pending - ${this.state.activePaid} WHERE id=${this.state.activeRecordId};`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("Record details updated successfully");
        this.fetchLedgerData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateProductCount(productId, quantity) {
    const query = `UPDATE stockCount SET quantity = quantity - ${quantity}  WHERE productId=${productId};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log("count update status data: ", res.data);
        console.log("count updated successfully");
        setTimeout(() => {
          this.refreshLedger();
        }, 2000);
      })
      .catch((err) => {
        console.log("record delete error: ", err);
      });
  }

  deleteRecord(id, productId, quantity) {
    const query = `UPDATE stockLedger SET status = 0  WHERE id=${id};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log("deleted status data: ", res.data);
        console.log("record deleted successfully");
        toast.error("Record deleted successfully");
        this.updateProductCount(productId, quantity);
        setTimeout(() => {
            this.refreshLedger();
          }, 2000);
      })
      .catch((err) => {
        console.log("record delete error: ", err);
      });
  }

  refreshLedger() {
    window.location.reload(false);
  }

  componentDidMount() {
    this.fetchLedgerData();
    this.fetchProductCount();
  }

  componentDidUpdate() {
    this.initializeDataTable();
  }

  renderProductCount = () => {
    if (!this.state.productCount) return null;

    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box p={1}>
            <Typography variant="h6">Product Stock</Typography>
          </Box>
        </Grid>
        {this.state.products.map((product, index) => (
          <Grid item md={2}>
            <Card>
              <Box display="flex" justifyContent="space-between" p={1}>
                <Typography>{product.replaceAll("_", " ")}</Typography>
                <Typography>
                  <b>{this.state.productCount[index]["quantity"]}</b>
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  renderLedgerData = () => {
    if (this.state.LedgerData == null) {
      return null;
    }

    const ledger = this.state.LedgerData;
    let last_modified = null;

    return ledger.map((record) => {
      // extract date only
      last_modified = moment(record["last_modified"]).format(
        "DD/MM/YYYY HH:MM"
      );

      return (
        <tr>
          <td align="center">
            <Badge variant="primary">
              {record["id"]}
              <span hidden>$</span>
            </Badge>{" "}
          </td>
          <td>
            {this.state.products[record["productId"] - 1].replaceAll("_", " ")}
          </td>
          <td>{record["quantity"]}</td>
          <td>{record["amount"]}</td>
          <td>{record["paid"]}</td>
          <td>{record["pending"]}</td>
          <td>{last_modified}</td>
          <td align="center">
            <Button
              color="secondary"
              variant="contained"
              className="mr-2"
              onClick={(e) => {
                this.setState({
                  activeRecordId: record.id,
                  activePaid: record.pending,
                });
                this.setState({ showUpdateModel: true });
              }}
            >
              <FontAwesomeIcon icon={faPenAlt} />
            </Button>
            <Modal
              show={this.state.showUpdateModel}
              onHide={(e) => this.setState({ showUpdateModel: false })}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Update record
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form noValidate autoComplete="off">
                  <div className="mt-3">
                    <Row>
                      <Col>
                        <TextField
                          id="paid"
                          label="Paid"
                          variant="outlined"
                          className="m-2"
                          defaultValue={this.state.activePaid}
                          onChange={(e) =>
                            this.setState({
                              activePaid: e.target.value,
                            })
                          }
                        />
                        <Btn1
                          className="mt-3"
                          onClick={(e) => {
                            this.setState({
                              showUpdateModel: false,
                            });
                            this.handleUpdateSubmit(e);
                          }}
                        >
                          Update
                        </Btn1>
                      </Col>
                    </Row>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            {/* delete record */}
            <Button
              variant="contained"
              onClick={(e) => {
                if (window.confirm("Delete the item?")) {
                  this.deleteRecord(
                    record.id,
                    record.productId,
                    record.quantity
                  );
                }
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </td>
        </tr>
      );
    });
  };

  initializeDataTable() {
    const title = "Stock data-" + moment().format("DD/MM/YYYY");
    $("#ledger_table").DataTable({
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
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7],
          },
        },
        {
          extend: "print",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7],
          },
        },
      ],
    });
  }

  render() {
    return (
      <div className="container-fluid border m-0 p-1">
        {this.renderProductCount()}
        <br />
        <div className="btn-group mb-3" role="group" aria-label="Basic example">
          <AddNewEntry refreshLedger={() => this.refreshLedger()} />
        </div>

        <Row className="ml-0 mr-0">
          <Col md="12" className="p-0 m-0 measure1">
            {/* <TableContainer component={Paper} style={{ maxHeight: "79vh" }}> */}
            {this.state.isLoadingLedger && (
              <Box
                width="100%"
                height="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress />
              </Box>
            )}
            {!this.state.isLoadingLedger && (
              <table
                id="ledger_table"
                className="display"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th align="center">ID</th>
                    <th>Product</th>
                    <th>quantity</th>
                    <th align="center">amount</th>
                    <th>paid</th>
                    <th>pending</th>
                    <th>last modified</th>
                    <th align="center">Options</th>
                  </tr>
                </thead>
                <TableBody>{this.renderLedgerData()}</TableBody>
              </table>
            )}
            {/* </TableContainer> */}
          </Col>
        </Row>
      </div>
    );
  }
}
