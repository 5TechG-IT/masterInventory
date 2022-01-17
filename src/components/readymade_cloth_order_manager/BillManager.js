import React, { Component, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import moment from "moment";

import { Row, Col, Card, Button as Btn1, Modal, Badge, Table as Tbl } from "react-bootstrap";
import {
  faPenAlt,
  faBook,

  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

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

const axios = require("axios");

const filter = createFilterOptions();
const PaymentMode = [
  { label: "Cash", name: "cash", value: "1" },
  { label: "cheque", name: "cheque", value: "2" },
  { label: "Online", name: "Online", value: "3" },
];

export default class BillManager extends Component {
  constructor(props) {
    super();

    this.state = {
      billId: null,
      newId: 0,
      partyId: 0,
      partyName: null,
      newPartyName: null,
      receiverName: null,
      address: null,
      mobileNumber: null,
      gstin: null,
      billType: 1,
      code: null,
      companyType: 1,
      discount: null,

      PaymentMode: [],
      priceMode: 1,
      priceModeName: null,

      date: moment(new Date()).format("YYYY-MM-DD"),

      particularValue: null,
      particular: null,
      product: null,
      hsn: "2201",
      partQty: 1,
      batch: "",
      description: "N/A",
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
      advance: 0,
      grandTotal: 0,
      discount: 0,
      discountAmount: 0,

      printComponentRef: null,

      partyList: null,
      productData: null,

      latestInsertId: 0,


      showAddModal: false,
      showUpdateModel: false,
      value: "1",
      activePartyId: "",
      activePartyName: "",
      activePartyMobile: "",
      activePartyAadharNo: "",
      activePartyCity: "",
      activePartyAddress: "",
      activePartyType: 1,
      partiesData: null,
      adharNo: null,
      priceMode: 1,


    };
  }

  maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  getIdPartyList() {
    let url = API_URL;
    const query = `SELECT id, name, address, mobile FROM party WHERE status=1;`;
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
    const query = `SELECT id FROM capDeliveryMemo ORDER BY id DESC LIMIT 1;`;
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

  fetchDescription(productId) {

    if (this.state.productData == null)
      return null;
    let description = this.state.productData.find(
      (product) => {
        if (product.id == productId) {
          return product.description;
        }
      }
    ).description
    this.setState(
      {
        description: description,
      },
    );
  }

  fetchRate(productId) {

    if (!this.state.productData)
      return;
    let rate = this.state.productData.find(
      (product) => {
        if (product.id == productId) {
          return product.price;
        }
      }
    ).price
    this.setState(
      {
        rate: rate,
      },
    );
  }

  calculateTaxes = () => {
    const total = this.state.total;
    const discountAmount = Number(total - (total / 100) * this.state.discount);

    this.setState(
      {
        discountAmount: Number(total - (total / 100) * this.state.discount),
        sgst: Number((discountAmount / 100) * 9).toFixed(2),
        cgst: Number((discountAmount / 100) * 9).toFixed(2),
        igst: Number((discountAmount / 100) * 18).toFixed(2),
      },
      this.calculateGrandTotal

    );
    console.log(discountAmount)
  };

  calculateGrandTotal = () => {
    let grandTotal;
    if (this.state.billType === 1) {
      grandTotal =
        Number(this.state.discountAmount) +
        Number(this.state.igst)
    } else {
      grandTotal = Number(this.state.discountAmount);
    }
    this.setState({ grandTotal: grandTotal.toFixed(2) });
  };

  addItems = () => {
    if (!this.state.productName || !this.state.rate) return;
    let items = this.state.addedItems;
    const ifExists = items.find(
      (item) => item.productName === this.state.productName
    );
    if (ifExists) {
      items = items.map((item) => {
        if (item.productName === this.state.productName) {
          return {
            productName: this.state.productName,
            batch: this.state.batch,
            partQty: +item.partQty + +this.state.partQty,
            rate: +item.rate + +this.state.rate,
            description: this.state.description,
            discount: this.state.discount,
            amount: +item.amount + +this.state.rate * +this.state.partQty,
          };
        }
      });
    } else {
      items.push({
        productName: this.state.productName,
        batch: this.state.batch,
        partQty: this.state.partQty,
        rate: this.state.rate,
        discount: this.state.discount,
        description: this.state.description,
        amount: this.state.rate * this.state.partQty,
      });
    }

    this.setState({ addedItems: items });
    console.log(this.state.addedItems);

    // update total & balance
    let total =
      Number(this.state.total) + Number(this.state.rate * this.state.partQty);
    this.setState({ total: total }, this.calculateTaxes);
    let balance = total + Number(this.state.advance);
    this.setState({ balance: balance });
  };

  deleteItem = (index) => {
    let itemList = this.state.addedItems;

    // update total & balance
    let total = this.state.total - itemList[index]["amount"];
    let balance = total + Number(this.state.advance);
    this.setState({ total: total }, this.calculateTaxes);
    this.setState({ balance: balance });

    let updatedList = itemList.filter((item, _index) => {
      if (index !== _index) return item;
    });
    this.setState({ addedItems: updatedList });
  };


  handleClear = () => {
    window.location.reload();
    return null;
  };

  insertBillList = () => {
    let url = API_URL;
    const newDate = moment(new Date()).format("YYYY-MM-DD");
    this.state.addedItems.map((item, index) => {
      const query = `INSERT INTO billList(billType, billId, partyId, particular, description,discount,  batch, quantity, rate, amount) VALUES(
          ${this.state.billType},
          ${this.state.billId},
          ${this.state.partyId},
          '${item.productName}', 
          '${item.description}', 
          ${item.discount},
          '${item.batch}',  
          ${item.partQty}, 
          ${item.rate}, 
          ${item.amount}
        )`;
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

  fetchNewId() {
    let url = API_URL;
    const query = `select max(id)+1 as newId from billList;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        let data = [];
        this.setState({
          newId: (res.data[0].newId)
        });
        console.log(res.data[0].newId);

      })
      .catch((err) => {
        console.log("New Id fetch error: ", err);
      });
  }

  insertLedgerRecord = () => {
    const query = `INSERT INTO ledger(party_id, particular, total, memo_id) VALUES(${this.state.partyId}, 'reference memo id: ${this.state.latestInsertId}', ${this.state.total}, ${this.state.latestInsertId})`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log("insert response: ", res.data.insertId);
      })
      .catch((err) => {
        console.log("failed to insert ledger, error: ", err);
      });
  };

  insertNewPartyAndSave = () => {
    const query = `INSERT INTO party (name, address, mobile) values("${this.state.newPartyName}", "${this.state.address}", "${this.state.mobileNumber}")`;
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
    const date = moment(new Date()).format("YYYY-MM-DD");
    let query;
    if (this.state.billType === 1) {
      query = `INSERT INTO gstBill (partyId,partyName, receiverName, date, mobileNo, companyType, gstin , code, total, balance, status , last_modified , gst , paid,paymentMode) values(
        ${this.state.partyId},
        '${this.state.newPartyName}',  
        '${this.state.receiverName}', 
        '${moment(
        date
      ).format()}',
        ${this.state.mobileNumber},
        ${this.state.companyType},
        '${this.state.gstin}', 
        ${this.state.code}, 
        ${this.state.grandTotal},
        ${this.state.balance}+${this.state.igst}-${this.state.paid}, 
        1,
        '${moment(
        date
      ).format()}',
        ${this.state.igst},
        ${this.state.paid},
        ${this.state.priceMode}
        )`;
    } else if (this.state.billType === 2) {
      query = `INSERT INTO nonGstBill (partyId, partyName, receiverName, date, mobileNo,companyType, code, total,discount, balance, status , last_modified , paid, paymentMode) values(
        ${this.state.partyId},
        '${this.state.newPartyName}',  
        '${this.state.receiverName}', 
        '${moment(
        date
      ).format()}',
        ${this.state.mobileNumber},
        ${this.state.companyType},
        ${this.state.code}, 
        ${this.state.grandTotal},
        ${this.state.discount},
        ${this.state.balance}-${this.state.paid}, 
        1,
        '${moment(
        date
      ).format()}',
        ${this.state.paid},
        ${this.state.priceMode}
        )`;
    }
    else {
      query = `INSERT INTO quotations (partyId, partyName, receiverName, date, mobileNo,companyType, code, total,discount, balance, status , last_modified , paid, paymentMode) values(
        ${this.state.partyId},
        '${this.state.newPartyName}',  
        '${this.state.receiverName}', 
        '${moment(
        date
      ).format()}',
        ${this.state.mobileNumber},
        ${this.state.companyType},
        ${this.state.code}, 
        ${this.state.grandTotal},
        ${this.state.discount},
        ${this.state.balance}-${this.state.paid}, 
        1,
        '${moment(
        date
      ).format()}',
        ${this.state.paid},
        ${this.state.priceMode}
        )`;
    }

    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(API_URL, data)
      .then((res) => {
        toast.success("Generated Bill successfully");
        this.setState({ billId: res.data.insertId }, this.insertBillList);
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

  getproductData = () => {
    let url = API_URL;
    const query = `SELECT *  from products WHERE status = 1;`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        console.log("product data: ", res.data);
        this.setState({ productData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleAddSubmit(e) {
    e.preventDefault();
    let url = API_URL;

    const query = `INSERT INTO party(name, mobile,aadharNo, address,city, type) VALUES('${this.state.activePartyName}', ${this.state.activePartyMobile},'${this.state.activePartyAadharNo}' ,'${this.state.activePartyAddress}','${this.state.activePartyCity}', ${this.state.activePartyType})`;
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

  refreshParties() {
    window.location.reload(false);
  }

  componentDidMount() {
    this.getLatestId();
    this.getIdPartyList();
    this.getproductData();
    this.fetchNewId();
    this.fetchDescription();
  }

  render() {
    return (
      <form className="mb-5" style={{ margin: '10px' }} onSubmit={(e) => e.preventDefault()}>
        <div
          class="btn-group row"
          role="group"
          aria-label="Basic example"
        >
          <Button
            className="mt-1 mr-1 mb-3"
            color="secondary"
            variant="contained"
            onClick={(e) => {
              this.setState({ showAddModal: true });
            }}
          >
            add new party
          </Button>
        </div>

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
              Add New Party
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
                      label="aadharNo"
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
                          Retialer
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
        <div className="row m-3">
          <FormControl style={{ minWidth: "250px" }} className="mr-2 mb-2 smt-0">
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={
                this.state.partyList != null
                  ? this.state.partyList.map((item) => item.id + ", " + item.name)
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Party name"
                  variant="outlined"
                  size="small"
                  value={this.state.newPartyName}
                  onChange={(event) =>
                    this.setState({ newPartyName: event.target.value })
                  }
                />
              )}
              onChange={(event, value) => {
                console.log(value);
                if (value != null && value.length > 2) {
                  this.setState({
                    partyId: value.split(", ")[0],
                    partyName: value.split(", ")[1],
                  });
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
            id="receiver Name"
            label="receiver name"
            variant="outlined"
            className={"mr-2"}
            value={this.state.receiverName}
            onChange={(e) => this.setState({ receiverName: e.target.value })}

            size="small"
          />

          <TextField
            id="custAddress"
            label="Address"
            variant="outlined"
            className="mr-2"
            value={
              this.state.partyId
                ? this.state.partyList.find(
                  (party) => party.id == this.state.partyId
                )?.address
                : this.state.address || ""
            }
            onChange={(e) => this.setState({ address: e.target.value })}
            disabled={!!this.state.partyId}
            size="small"
          />

          <ButtonGroup className="mr-2">
            {PaymentMode.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`paymentmode-${idx}`}
                type="radio"
                variant={
                  idx % 2
                    ? "outline-success"
                    : "outline-success"
                }
                name="paymentmode"
                required="true"
                value={radio.value}
                checked={this.state.priceMode === radio.value}
                onChange={(e) => {
                  this.setState({ priceMode: e.target.value })
                  this.setState({ priceModeName: radio.name })

                }}
                className="ToggleClassBtnRadio"
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>


          <TextField
            id="mobileNo"
            label="Mobile Number"
            variant="outlined"
            className="mr-2 mt-1"
            value={this.state.mobileNumber}
            onChange={(e) => this.setState({ mobileNumber: e.target.value })}
            size="small"
          />

          <FormControl
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
              <MenuItem value={3}>Quotation</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="gstin"
            label="GSTIN"
            variant="outlined"
            className={"mr-2 mt-1 " + (this.state.billType === 2 ? 'd-none' : '')}
            value={this.state.gstin}
            onChange={(e) => this.setState({ gstin: e.target.value })}

            size="small"
          />

          <TextField
            id="code"
            label="Code"
            variant="outlined"
            className="mr-2 mt-1"
            value={this.state.code}
            onChange={(e) => this.setState({ code: e.target.value })}
            size="small"
          />

          <TextField
            id="paid"
            label="Paid"
            variant="outlined"
            className="mr-2 mt-1 mb-3"
            value={this.state.paid}
            onChange={(e) => this.setState({ paid: e.target.value })}
            size="small"
          />

          <hr />

          <Row>
            <Col>

              <FormControl style={{ minWidth: "250px" }} className="mr-2 mb-2 smt-0">
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={
                    this.state.productData != null
                      ? this.state.productData.map((item) => item.id + ", " + item.name)
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product name"
                      variant="outlined"
                      size="small"
                      value={this.state.productName}
                    />
                  )}
                  onChange={(event, value) => {
                    console.log(value);
                    if (value != null && value.length > 2) {
                      this.setState({
                        productId: Number(value.split(", ")[0]),
                        productName: value.split(", ")[1],
                      });

                      this.fetchDescription(String(value.split(", ")[0]));
                      this.fetchRate(Number(value.split(", ")[0]));

                    } else {
                      this.setState({
                        productId: null,
                        productName: "",
                      });
                    }

                  }}
                />
              </FormControl>

            </Col>
            <Col>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                className="mr-2 mt-1"
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })}

                required="true"
                size="small"
                type="text"
              />
            </Col>
            <Col>
              <TextField
                id="batch"
                label="Batch"
                variant="outlined"
                className="mr-2 mt-1"
                value={this.state.batch}
                onChange={(e) => this.setState({ batch: e.target.value })}
                required="true"
                size="small"
                type="text"
              />
            </Col>
            <Col>
              <TextField
                id="partQty"
                label="Part Qty"
                variant="outlined"
                className="mr-2 mt-1"
                value={this.state.partQty}
                onChange={(e) => this.setState({ partQty: e.target.value })}
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
                onChange={(e) => this.setState({ rate: e.target.value })}
                required="true"
                size="small"
                type="number"
              />
            </Col>
            <Col>
              <TextField
                id="discount"
                label="Discount % "
                variant="outlined"
                className="mr-2 mt-1"
                required="true"
                size="small"
                type="percentage"
                inputProps={{ maxLength: 2 }}
                value={this.state.discount}
                onChange={(e) => this.setState({ discount: e.target.value })}
              />
            </Col>

            <Col>
              <Button
                color="primary"
                variant="contained"
                className="mt-1"
                onClick={this.addItems}

              >
                Add
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-1 p-2 measure" ref={(el) => (this.printComponentRef = el)}>
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="mt-2 p-0">
                <Card.Header>
                  <div className="row">
                    <div className="col-2 col-md-2 text-center">
                      <img
                        style={{ marginLeft: '-1.5em' }}
                        src="/Assets/patil.png"
                        height="200"
                        width="200"
                      />
                    </div>
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
                      Invoice No. <b>{this.state.newId}</b>
                    </p>
                    <p>
                      Date <b>{moment(new Date()).format("D / M / YYYY")}</b>
                    </p>
                  </span>

                  <h5 className="text-center pb-0 mb-0">
                    <b> {this.state.billType == 3 ? "QUOTATION" : "TAX INVOICE"}</b>
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
                        <b>{this.state.partyName || this.state.newPartyName}</b>
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
                        Address:{" "}
                        <b>{this.state.address || this.state.activePartyAddress}</b>
                      </h6>
                    </Col>
                    <Col md={6}>
                      <h6
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        Mobile No: <b>{this.state.mobileNumber}</b>
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
                        GSTIN: <b>{this.state.gstin}</b>
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
                        Payment Mode: <b>{this.state.priceModeName}</b>
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
                </Card.Body>
                <Card.Body className="m-0 pt-0">
                  <Tbl striped bordered hover size="sm" >
                    <thead>
                      <tr>
                        <th>Particular</th>
                        <th>Description</th>
                        <th>Batch</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Discount %</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {this.state.addedItems.length > 0 ? (
                      <tbody>
                        {this.state.addedItems.map((item, index) => {
                          return (
                            <tr key={"" + item.productName}>
                              <td>{item.productName} </td>
                              <td>{item.description}</td>
                              <td>{item.batch}</td>
                              <td>{item.partQty}</td>
                              <td>{item.rate}</td>
                              <td>{item.discount}</td>
                              <td>{item.amount}</td>
                              <td className="d-print-none" align="center">
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => this.deleteItem(index)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        <br></br>
                        {this.state.billType === 1 ? (
                          <>
                            <tr>
                              <td colSpan="4">Total amount before tax</td>
                              <td></td>
                              <td></td>

                              <td colSpan="2">{this.state.total}</td>
                            </tr>
                            <tr>
                              <td colSpan="4">Total amount after discount</td>
                              <td></td>
                              <td></td>

                              <td colSpan="2">{this.state.discountAmount}</td>
                            </tr>
                            <tr>
                              <td colSpan="4">SGST 9%</td>
                              <td></td>
                              <td></td>

                              <td colSpan="2">{this.state.sgst}</td>
                            </tr>
                            <tr>
                              <td colSpan="4">CGST 9%</td>
                              <td></td>
                              <td></td>

                              <td colSpan="2">{this.state.cgst}</td>
                            </tr>
                            <tr>
                              <td colSpan="4">IGST 18%</td>
                              <td></td>
                              <td></td>

                              <td colSpan="2">{this.state.igst}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan="4">Total amount</td>
                            <td></td>
                            <td></td>

                            <td colSpan="2">{this.state.total}</td>
                          </tr>

                        )}

                        <tr>
                          <td colSpan="4" style={{ fontWeight: 'bold' }}>Grand Total</td>
                          <td></td>
                          <td></td>

                          <td colSpan="2" style={{ fontWeight: 'bold' }}>{this.state.grandTotal}</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan="6">No items added</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    )}
                  </Tbl>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="col-10">
          <ReactToPrint content={() => this.printComponentRef}>
            <PrintContextConsumer>
              {({ handlePrint }) => (
                <Button
                  onClick={handlePrint}
                  className="mt-2 mr-1"
                  color="primary"
                  variant="contained"
                  style={{ float: "right" }}
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
            onClick={this.handleSave}
            disabled={
              this.state.partyName
                ? false
                : true
            }
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
        </div>
      </form>
    );
  }
}