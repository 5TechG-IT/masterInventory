import React, { Component } from "react";
import PropTypes from "prop-types";
import "./dashboard.css";
// import { AuthContext } from "../../Context/authContext";
//API handling components
import moment from "moment";

import { API_URL } from "./../../global";

// Axios for HTTP req
const axios = require("axios");

export default class Dashboard extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            billCount: 0,
            sales: 0,
            expenseCount: 0,
            partyCount: 0,
            gstSales: 0,
            nonGstSales: 0,
            expenseAmount: 0,
            gstMonthlyAmount: 0,
            nonGstMonthlyAmount: 0,
            monthlyExpenses: 0,
            date: moment(new Date()).format("YYYY-MM-DD"),

        };
    }


    fetchGstBillsCount() {
        let url = API_URL;
        const billCount = this.state.billCount;
        const query = `SELECT COUNT(id) as billCount FROM billList WHERE status = 1 `;

        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("billCount count: ", res.data);
                this.setState({ billCount: res.data[0]["billCount"] });
            })
            .catch((err) => {
                console.log("billCount data error: ", err);
            });
    }

    fetchSalesCount() {
        let url = API_URL;
        const query = `SELECT SUM(amount) as sales FROM billList WHERE status = 1`;
        console.log(query)
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("sales count: ", res.data);
                this.setState({ sales: res.data[0]["sales"] });

            })
            .catch((err) => {
                console.log("sales data error: ", err);
            });
    }



    fetchExpensesCount() {
        let url = API_URL;

        const query = `SELECT SUM(amount) as expenseCount FROM expenses`;

        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("expenseCount count: ", res.data);
                this.setState({ expenseCount: res.data[0]["expenseCount"] });
            })
            .catch((err) => {
                console.log("expenseCount data error: ", err);
            });
    }

    fetchPartiesCount() {
        let url = API_URL;

        const query = `SELECT COUNT(id) as partyCount FROM party WHERE status = 1;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("partyCount count: ", res.data);
                this.setState({ partyCount: res.data[0]["partyCount"] });
            })
            .catch((err) => {
                console.log("partyCount data error: ", err);
            });
    }


    fetchGstSales() {
        let url = API_URL;

        const query = `SELECT SUM(amount) as gstSales FROM billList WHERE status = 1 AND billType= 1`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("gstSales count: ", res.data);
                this.setState({ gstSales: res.data[0]["gstSales"] });
            })
            .catch((err) => {
                console.log("gstSales data error: ", err);
            });
    }

    fetchnonGstSales() {
        let url = API_URL;

        const query = `SELECT SUM(amount) as nonGstSales FROM billList WHERE status = 1 AND billType= 2`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("nonGstSales count: ", res.data);
                this.setState({ nonGstSales: res.data[0]["nonGstSales"] });
            })
            .catch((err) => {
                console.log("nonGstSales data error: ", err);
            });
    }


    fetchExpenseAmountCount() {
        let url = API_URL;
        const date = new Date();
        const query = `SELECT YEAR(date) as year, MONTH(date) as month, DAY(date) as day, SUM(amount) as amount FROM expenses 
        GROUP BY day 
        HAVING year=${date.getFullYear()} and month=${date.getMonth() + 1}
        ORDER BY day DESC LIMIT 6;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("expenseAmount count: ", res.data);
                this.setState({ expenseAmount: res.data[0]["amount"] });
            })
            .catch((err) => {
                console.log("expenseAmount data error: ", err);
            });
    }
        fetchMonthlyGstSales() {
            let url = API_URL;
            const date = new Date();
            const query = ` select sum(paid) from gstBill where date between DATE_FORMAT(NOW() ,'%Y-%m-01') and last_day(now())`;
            let data = { crossDomain: true, crossOrigin: true, query: query };
    
            axios
                .post(url, data)
                .then((res) => {
                    console.log("gstSalesMonthlyAmount count: ", res.data);
                    this.setState({ gstMonthlyAmount: res.data[0]["sum(paid)"] });
                })
                .catch((err) => {
                    console.log("expenseAmount data error: ", err);
                });
        }
        fetchMonthlyNonGstSales() {
            let url = API_URL;
            const date = new Date();
            const query = ` select sum(paid) from nonGstBill where date between DATE_FORMAT(NOW() ,'%Y-%m-01') and last_day(now())`;
            let data = { crossDomain: true, crossOrigin: true, query: query };
    
            axios
                .post(url, data)
                .then((res) => {
                    console.log("nonGstSalesMonthlyAmount count: ", res.data);
                    this.setState({ nonGstMonthlyAmount: res.data[0]["sum(paid)"] });
                })
                .catch((err) => {
                    console.log("nonGstMonthlyAmount data error: ", err);
                });
        }
        fetchMonthlyExpense() {
            let url = API_URL;
            const date = new Date();
            const query = ` select sum(amount) from expenses where date between DATE_FORMAT(NOW() ,'%Y-%m-01') and last_day(now())`;
            let data = { crossDomain: true, crossOrigin: true, query: query };
    
            axios
                .post(url, data)
                .then((res) => {
                    console.log("monthlyExpenses count: ", res.data);
                    this.setState({ monthlyExpenses: res.data[0]["sum(amount)"] });
                })
                .catch((err) => {
                    console.log("monthlyExpenses data error: ", err);
                });
        }

    componentDidMount() {
        this.fetchGstBillsCount();
        this.fetchExpensesCount();
        this.fetchPartiesCount();
        this.fetchSalesCount();
        this.fetchGstSales();
        this.fetchnonGstSales();
        this.fetchExpenseAmountCount();
        this.fetchMonthlyGstSales();
        this.fetchMonthlyNonGstSales();
        this.fetchMonthlyExpense();
    }
    render() {
        return (
            <>
                <div>
                    {/* Main content */}
                    <div class="content-wrapper">
                        <div className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <h1 className="m-0">Dashboard</h1>
                                    </div>
                                    {/* /.col */}
                                </div>
                                {/* /.row */}
                            </div>
                            {/* /.container-fluid */}
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                {/* Small boxes (Stat box) */}
                                <div className="row">
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-info">
                                            <div className="inner">
                                                <h3>Total Bills</h3>

                                                <h2>{this.state.billCount}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>Total Sale</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{
                                                    new Intl.NumberFormat('en-IN').format(this.state.sales)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-danger">
                                            <div className="inner">
                                                <h3>Total Expenses</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> {new Intl.NumberFormat('en-IN').format(this.state.expenseCount)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>Total Parties</h3>
                                                <h2>{this.state.partyCount}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                </div>

                                {/* todays boxes */}

                                <div className="content-header">
                                    <div className="container-fluid">
                                        <div className="row mb-2">
                                            <div className="col-sm-6">
                                                <h1 className="m-0">Todays</h1>
                                            </div>
                                            {/* /.col */}
                                        </div>
                                        {/* /.row */}
                                    </div>
                                    {/* /.container-fluid */}
                                </div>

                                {/* Small boxes (Stat box) */}
                                <div className="row">
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>GST Sale</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.gstSales)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-danger">
                                            <div className="inner">
                                                <h3>NON GST Sale</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.nonGstSales)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-primary">
                                            <div className="inner">
                                                <h3>Expense Amount</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.expenseAmount)}</h2>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                {/* /.row */}
                                <div className="content-header">
                                    <div className="container-fluid">
                                        <div className="row mb-2">
                                            <div className="col-sm-6">
                                                <h1 className="m-0">Monthly</h1>
                                            </div>
                                            {/* /.col */}
                                        </div>
                                        {/* /.row */}
                                    </div>
                                    {/* /.container-fluid */}
                                </div>
                                <div className="row">
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-info">
                                            <div className="inner">
                                                <h3>GST Sale</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.gstMonthlyAmount)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>NON GST Sale</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.nonGstMonthlyAmount)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>Expense Amount</h3>
                                                <h2><i class="fas fa-rupee-sign"></i> &nbsp;{new Intl.NumberFormat('en-IN').format(this.state.monthlyExpenses)}</h2>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    }
}
