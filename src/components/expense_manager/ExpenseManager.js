import React, { Component } from "react";
import "./style.css";
import {
  Table,
  TableBody,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Paper,
  Grid,
  Box,
  Typography,
  CardHeader,
} from "@material-ui/core";
import { Badge, Card, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

const axios = require("axios");

export class ExpenseManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteModal: false,
      description: "",
      amount: "",
      expenseData: [],
      activeExpenseId: null,
      todaysExpense: 0,
      monthlyExpenseData: [],
      dailyExpenseData: [],
      date: moment(new Date()).format("YYYY-MM-DD"),
      isLoadingExpense: false,
    };
  }

  getExpenseData() {
    let url = API_URL;
    const query = `SELECT * from expenses ORDER BY id DESC;`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    this.setState({ isLoadingExpense: true });

    axios
      .post(url, data)
      .then((res) => {
        console.log("expenses data: ", res.data);
        this.setState({ expenseData: res.data, isLoadingExpense: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoadingExpense: false });
      });
  }

  getMonthlyExpense() {
    let url = API_URL;
    const date = new Date();
    const query = `SELECT YEAR(date) as year, MONTH(date) as month, SUM(amount) as amount from expenses 
    GROUP BY month
    HAVING year=${date.getFullYear()}
    ORDER BY month DESC;`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        console.log("Monthly expenses data: ", res.data);
        this.setState({ monthlyExpenseData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDailyExpense() {
    let url = API_URL;
    const date = new Date();
    const query = `SELECT YEAR(date) as year, MONTH(date) as month, DAY(date) as day, SUM(amount) as amount FROM expenses 
    GROUP BY day 
    HAVING year=${date.getFullYear()} and month=${date.getMonth() + 1}
    ORDER BY day DESC LIMIT 6;`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        console.log("Todays expenses data: ", res.data);
        this.setState({ dailyExpenseData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getExpenseData();
    this.getMonthlyExpense();
    this.getDailyExpense();
  }
  

  refreshData() {
    this.getExpenseData();
    this.getMonthlyExpense();
    this.getDailyExpense();
  }

  componentDidUpdate() {
    const title = "expense_table";
    $("#expense_table").DataTable({
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
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
        {
          extend: "print",
          title,
          messageTop: `<h4 style='text-align:center'>${title}</h4>`,
          download: "open",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
      ],
    });
  }

  handleSubmit(e, state) {
    e.preventDefault();
    let url = API_URL;
    const { description, amount } = state;
    const date = new Date();
    const query = `INSERT INTO expenses (description,date,amount) VALUES('${description}','${moment(
      date
    ).format()}',
    ${amount});`;

    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast("Expense added succesfully");
        // this.getExpenseData();
        window.location.reload();
        
      })
      .catch((err) => {
        console.log(err);
        toast("Failed to add expense");
      });
  }

  deleteExpense(id) {
    let url = API_URL;
    const query = `DELETE from expenses WHERE id=${id};`;
    let data = {
      crossDomain: true,
      crossOrigin: true,
      query: query,
    };
    axios
      .post(url, data)
      .then((res) => {
        toast.success("expense deleted successfully");
      
        window.location.reload();
        this.getExpenseData();

       
      })
      .catch((err) => {
        console.log(err);
        toast("Failed to delete expense");
      });
  }

  renderDailyExpense() {
    let currDate = new Date().getDate();

    return (
      <Card className="mb-2">
        <Card.Body className="mt-0 pt-3">
          <h6>Daily Expense</h6>
          <Grid container spacing={1}>
            {this.state.dailyExpenseData.map((record, index) => (
              <Grid item md={2}>
                <Card>
                  <Box display="flex" justifyContent="space-between" p={1}>
                    <Typography>
                      {currDate == record.day ? "Today" : record.day}
                    </Typography>
                    <Typography>
                      <b>{record.amount}</b>
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card.Body>
      </Card>
    );
  }

  renderMonthlyExpense() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let currMonth = new Date().getMonth() + 1;

    return (
      <Card className="mb-2">
        <Card.Body className="mt-0 pt-3">
          <h6>Monthly Expense</h6>
          <Grid container spacing={1}>
            {this.state.monthlyExpenseData.map((record, index) => (
              <Grid item md={2}>
                <Card>
                  <Box display="flex" justifyContent="space-between" p={1}>
                    <Typography>
                      {currMonth == record.month
                        ? "This Month"
                        : months[record.month - 1]}
                    </Typography>
                    <Typography>
                      <b>{record.amount}</b>
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return (
      <div
        className="container-fluid border m-0 p-1 main"
        style={{ backgroundColor: "aliceblue" }}
      >
        {this.renderDailyExpense()}
        {this.renderMonthlyExpense()}
        <Card>
          <Card.Body className="mt-0 pt-3">
            <h6>Add Expenses</h6>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => this.handleSubmit(e, this.state)}
            >
              <div className="mt-3">
                <TextField
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  size="small"
                  value={this.state.amount}
                  className="mr-3"
                  onChange={(e) => this.setState({ amount: e.target.value })}
                />
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  size="small"
                  value={this.state.description}
                  className="mr-3"
                  style={{ minWidth: "30vw" }}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                />
                <TextField
                  id="date"
                  label="date"
                  variant="outlined"
                  type="date"
                  size="small"
                  value={this.state.date}
                  className="mr-3"
                  onChange={(e) => this.setState({ date: e.target.value })}
                />
                <Button variant="contained" color="primary" type="submit">
                  Add expense
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
        
      
           {!this.state.isLoadingExpense && (
          <table
            stickyHeader
            size="medium"
            aria-label="simple table"
            component={Paper}
            id="expense_table"
           
          >
            <thead>
              <tr>
                <td align="center">Expense Id</td>
                <td>Description</td>
                <td>Amount</td>
                <td>Date</td>
                <td align="center">Option</td>
              </tr>
            </thead>
            <tbody>
              {this.state.expenseData.length > 0 ? (
                this.state.expenseData.map((expense) => {
                  return (
                    <tr key={expense.id}>
                      <td align="center">
                        <Badge variant="primary"> {expense.id}</Badge>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {expense.description}
                      </td>
                      <td>₹ {expense.amount}</td>
                      <td>
                        {moment(expense.date).format("D MMMM YYYY ")}
                      </td>
                      <td align="center">
                        <Button
                          color="secondary"
                          variant="contained"
                          className="mt-1 mb-1"
                          onClick={(e) => {
                            this.setState({
                              activeExpenseId: expense.id,
                            });
                            this.setState({ showDeleteModal: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        <Modal
                          show={this.state.showDeleteModal}
                          onHide={(e) =>
                            this.setState({ showDeleteModal: false })
                          }
                          size="md"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                              Delete expense record
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>Do you really want to delete this expense?</p>
                            <Button
                              color="danger"
                              variant="contained"
                              className="mt-1 mb-1"
                              onClick={() => {
                                this.deleteExpense(this.state.activeExpenseId);
                                this.setState({ showDeleteModal: false });
                              }}
                            >
                              Delete
                            </Button>
                          </Modal.Body>
                        </Modal>
                      </td>
                    </tr>
                  );
                })
              ) : ""}
            </tbody>
          </table>
             )}
        {/* </TableContainer> */}
        <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
      </div>
    );
  }
}

export default ExpenseManager;
