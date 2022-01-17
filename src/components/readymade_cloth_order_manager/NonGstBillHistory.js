import React, { Component } from "react";
import { Row, Col, Modal, Card, Table as Tbl } from "react-bootstrap";
import { faPlusCircle, faSyncAlt, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";

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
const axios = require("axios");

export default class NonbillHistory extends Component {
  constructor(props) {
    super();

    this.state = {
      billList: null,
      showUpdateModel: false,
      activeBillId: null,
      activePaid: 0,
      startDate: moment(new Date()).format("YYYY-MM-DD"),
      endDate: moment(new Date()).format("YYYY-MM-DD"),
      aadharCard: null,
      adjustment: 0,
      balance: 0,
      code: null,
      date: null,
      paid: 0,
      partyId: null,
      pname: null,
      address: null,
      mobile: 0,
      companyType: 1,
      total: 0,
      discount: null,
      receiverName: null,
      date: moment(new Date()).format("YYYY-MM-DD"),
      paymentMode: 0,
      itemsList: [],
      isLoadingItems: false,
    };
  }

  fetchBillList = () => {
    let url = API_URL;
    const query = `SELECT ngb.*, p.name as pname,mobile,p.address,companyType,discount FROM nonGstBill as ngb inner join party as p where ngb.partyId = p.id AND ngb.status=1 ORDER BY ngb.id DESC`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ billList: res.data });

        // init data table
        this.initializeDataTable();
      })
      .catch((err) => {
      });
  };

  refreshProducts() {
    var data = this.state.billList;
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;

    var result = data.filter(function (obj) {
      return obj.date >= startDate && obj.date <= endDate;
    })
    this.setState({ billList: result });
  }

  clearFilter() {
    let url = API_URL;
    const query = `SELECT gb.* , p.name as pname FROM gstBill as gb inner join party as p where gb.partyId = p.id AND gb.status=1 ORDER BY gb.id DESC ;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ billList: res.data });

        // init data table
        this.initializeDataTable();
        window.location.reload();
      })
      .catch((err) => {
      });
  };

  fetchBillItemList = () => {
    let url = API_URL;
    const query = `SELECT bl.* FROM billList as bl inner join nonGstBill as ngb on bl.billId=ngb.id where bl.billId= ${this.state.activeBillId}`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ itemsList: res.data });

        // init data table
        this.initializeDataTable();
      })
      .catch((err) => {
      });
  };

  deleteRecord(id) {
    let url = API_URL;
    const query = `UPDATE nonGstBill SET status = 0  WHERE id=${id};`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("Record deleted successfully");
        window.location.reload();
        this.fetchBillList();
      })
      .catch((err) => {
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
    const query = `UPDATE nonGstBill SET balance = total - ${this.state.activePaid}, paid = paid + ${this.state.activePaid} WHERE id=${this.state.activeBillId};`;
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
      });
  }

  componentDidUpdate() {
    const title = "Party data -" + moment().format("DD-MMMM-YYYY");
    $("#billList").DataTable({
      destroy: true,
      keys: true,
      dom:
        "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
        "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
        "<'row'<'col-sm-12' tr>>" +
        "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
      buttons: [
        {
          extend: "csv",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
        {
          extend: "print",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
      ],
    });
  }


  renderMemoList = () => {
    if (this.state.billList == null) return null;
    return this.state.billList.map((bill) => {
      let color = bill.balance > 0 ? 'red' : '';
      return (
        <tr align="center">
          <td>{bill.id}</td>
          <td>{bill.pname}</td>
          <td>{bill.total}</td>
          <td>{bill.paid}</td>
          <td style={{ color: color }}>{bill.balance}</td>
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
                    pname: bill.pname,
                    mobile: bill.mobile,
                    address: bill.address,
                    companyType: bill.companyType,
                    total: bill.total,
                    adjustment: bill.adjustment,
                    discount: bill.discount,
                    receiverName: bill.receiverName,
                    paymentMode: bill.paymentMode,
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
                  activePaid: bill.paid,
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
                  <div className="row">
                    {/* <div className="col-2 col-md-2 text-center">
                      <img
                        style={{ marginLeft: '-1.5em' }}
                        src="/Assets/patil.png"
                        height="200"
                        width="200"
                      />
                    </div> */}
                    <div className="col-10">
                      <h5 className="text-center pb-0 mb-0">
                        <h2><b>MASTER INVENTORY</b></h2>
                      </h5>
                      <hr />
                    </div>
                  </div>
                  <hr />

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>
                      Invoice No. <b>{this.state.newaId}</b>
                    </p>
                    <p>
                      Date <b>{moment(new Date()).format("D / M / YYYY")}</b>
                    </p>
                  </span>

                  <h5 className="text-center pb-0 mb-0">
                    <b>TAX INVOICE</b>
                  </h5>


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
                        <b>{this.state.pname || this.state.newPartyName}</b>
                      </h6>
                    </Col>
                    <Col md={6}>
                      <h6
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        Receiver name:{" "}
                        <b>{this.state.receiverName}</b>
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
                        Address: <b>{this.state.address}</b>
                      </h6>
                    </Col>
                    <Col md={6}>
                      <h6
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        Mobile No: <b>{this.state.mobile}</b>
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
                        <b>{moment(new Date()).format("DD / MM / YYYY")}</b>
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
                        Payment Mode:
                        <b>
                          {this.state.paymentMode == 1 ? "cash" : this.state.paymentMode == 2 ? "cheque" : this.state.paymentMode == 3 ? "online" : ""}

                        </b>
                      </h6>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Body className="m-0 pt-0">
                  <Tbl striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Particular</th>
                        <th>Description</th>
                        <th>Batch</th>
                        <th>Part Qty.</th>
                        <th>Rate</th>
                        <th>Discount %</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    {this.state.itemsList.length > 0 ? (
                      <tbody>
                        {this.state.itemsList.map((item, index) => {
                          return (
                            <tr key={"" + item.particular}>
                              <td>{item.particular} </td>
                              <td>{item.description}</td>
                              <td>{item.batch}</td>
                              <td>{item.quantity}</td>
                              <td>{item.rate}</td>
                              <td>{this.state.discount}</td>
                              <td>{item.amount}</td>
                            </tr>
                          );
                        })}
                        <br></br>
                        <tr>
                          <td colSpan="4">Total amount</td>
                          <td></td>
                          <td></td>
                          <td colSpan="2">
                            {this.state.total}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4" style={{ fontWeight: 'bold' }}>Grand Total</td>
                          <td></td>
                          <td></td>
                          <td colSpan="2" style={{ fontWeight: 'bold' }}>{this.state.total}</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan="6">No items added</td>
                        </tr>
                      </tbody>
                    )}
                  </Tbl>
                  <p className="text-center" style={{ marginBottom: '-1em', marginTop: '1em', fontSize: '10px' }}>developed by 5TechG Lab | M:7028828831/9172227004</p>
                </Card.Body>
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
        <div className="row">
          <form autoComplete="off">


            <div className="row ml-4 mt-4">

              <TextField
                id="Start Date"
                label="Date From"
                variant="outlined"
                type="date"
                className="mr-2"
                required={true}
                size="small"
                value={this.state.startDate}
                onChange={(e) =>
                  this.setState({ startDate: e.target.value })
                }
              />


              <TextField
                id="End date"
                label="Date To"
                variant="outlined"
                type="date"
                className="mr-2"
                size="small"
                value={this.state.endDate}
                onChange={(e) =>
                  this.setState({ endDate: e.target.value })
                }
              />
              <Button
                color="primary"
                variant="contained"
                className="mb-3 ml-2"
                onClick={(e) => { this.refreshProducts() }}
              >
                <FontAwesomeIcon icon={faSyncAlt} size="2x" />
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className="ml-3 p-1"
                size="small"
                style={{ height: '40px' }}

                onClick={(e) => { this.clearFilter() }}
              >
                <FontAwesomeIcon
                  icon={faWindowClose}
                  size="2x"
                />
              </Button>
            </div>
          </form>
          <ToastContainer />
        </div>
        <Row>
          <Col
            md="12"
            className="m-0 p-1 measure1"
            style={{ minHeight: "85vh" }}
          >
            <div>
              <table id="billList" class="display" style={{ width: "100%" }}>
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