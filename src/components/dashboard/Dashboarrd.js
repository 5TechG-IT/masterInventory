import React, { Component } from "react";
import PropTypes from "prop-types";
import "./dashboard.css";
// import { AuthContext } from "../../Context/authContext";
// import { BASE_URL } from "./../common/global.js";

// Axios for HTTP req
const axios = require("axios");

export default class Dashboard extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            sitesCount:0,
            machinesCount:0,
            engineersCount:0,
            accountantsCount:0,
            partnersCount:0,
            creditCount:0,
        };
    }
    

    // fetchSitesCount() {
    //     let url = BASE_URL;
    //     const query = `SELECT COUNT(id) as siteCount FROM sites WHERE status = 1 AND status = 1;`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("sites count: ", res.data);
    //             this.setState({ sitesCount: res.data[0]["siteCount"] });
    //         })
    //         .catch((err) => {
    //             console.log("siteCount data error: ", err);
    //         });
    // }

    // fetchMachinesCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT COUNT(id) as machineCount FROM machines WHERE status = 1 AND status = 1;`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("machines count: ", res.data);
    //             this.setState({ machinesCount: res.data[0]["machineCount"] });
    //         })
    //         .catch((err) => {
    //             console.log("machines data error: ", err);
    //         });
    // }

    // fetchEngineersCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT COUNT(id) as engineersCount FROM users WHERE type = 2 AND  status = 1;`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("engineers count: ", res.data);
    //             this.setState({ engineersCount: res.data[0]["engineersCount"] });
    //         })
    //         .catch((err) => {
    //             console.log("engineers data error: ", err);
    //         });
    // }

    // fetchAccountantsCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT COUNT(id) as accountantsCount FROM users WHERE type = 3 AND status = 1;`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("accountants count: ", res.data);
    //             this.setState({ accountantsCount: res.data[0]["accountantsCount"] });
    //         })
    //         .catch((err) => {
    //             console.log("accountants data error: ", err);
    //         });
    // }

    // fetchPartnersCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT COUNT(id) as partnersCount FROM users WHERE type = 4 AND status = 1 ;`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("partners count: ", res.data);
    //             this.setState({ partnersCount: res.data[0]["partnersCount"] });                
    //         })
    //         .catch((err) => {
    //             console.log("partners data error: ", err);
    //         });
    // }

    // fetchDebitCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT SUM(debit) as debitCount FROM finance WHERE  status = 1`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("debit count: ", res.data);
    //             this.setState({ debitCount: res.data[0]["debitCount"] });                
    //         })
    //         .catch((err) => {
    //             console.log("debit data error: ", err);
    //         });
    // }

    // fetchCreditCount() {
    //     let url = BASE_URL;
        
    //     const query = `SELECT SUM(credit) as creditCount FROM finance WHERE  status = 1`;
    //     let data = { crossDomain: true, crossOrigin: true, query: query };

    //     axios
    //         .post(url, data)
    //         .then((res) => {
    //             console.log("credit count: ", res.data);
    //             this.setState({ creditCount: res.data[0]["creditCount"] });                
    //         })
    //         .catch((err) => {
    //             console.log("credit data error: ", err);
    //         });
    // }

    // componentDidMount() {
    //     this.fetchSitesCount();
    //     this.fetchMachinesCount();
    //     this.fetchEngineersCount();
    //     this.fetchAccountantsCount();
    //     this.fetchPartnersCount();
    //     this.fetchCreditCount();
    //     this.fetchDebitCount();
    // }
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
                                                <h3>Total Sites<h1 className="small-box-footer" style={{float:'right',fontSize:'55px'}}>{this.state.sitesCount}</h1></h3>
                                                
                                                <p>(Active)</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>
                                                    Total engineers
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.engineersCount}{" "}
                                                    </h1>
                                                </h3>
                                                <p>Bounce Rate</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>
                                                    Total machines
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.machinesCount}{" "}
                                                    </h1>
                                                </h3>
                                                <p>User Registrations</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-danger">
                                            <div className="inner">
                                                <h3>
                                                    Total accountants
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.accountantsCount}{" "}
                                                    </h1>
                                                </h3>
                                                <p>Unique Visitors</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-danger">
                                            <div className="inner">
                                                <h3>
                                                    Total partners
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.partnersCount}{" "}
                                                    </h1>
                                                </h3>
                                                <p>Unique Visitors</p>
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
                                        <div className="small-box bg-info">
                                            <div className="inner text-center">
                                                <h3>
                                                    Total{" "}
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.debitCount}{" "}
                                                    </h1>
                                                </h3>
                                                <h3>debit</h3>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    {/* ./col */}
                                    <div className="col-lg-3 col-6">
                                        {/* small box */}
                                        <div className="small-box bg-success">
                                            <div className="inner text-center">
                                                <h3>
                                                    Total{" "}
                                                    <h1
                                                        className="small-box-footer"
                                                        style={{
                                                            float: "right",
                                                            fontSize: "55px",
                                                        }}
                                                    >
                                                        {this.state.creditCount}{" "}
                                                    </h1>
                                                </h3>
                                                <h3>credit</h3>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* /.row */}
                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    }
}
