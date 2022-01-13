import React, { useState } from "react";
import { Row, Col, Navbar, Button } from "react-bootstrap";
import {
	Switch,
	HashRouter as Router,
	Route,
	Redirect,
} from "react-router-dom";
// import CSS styles
import "bootstrap/dist/css/bootstrap.css";

// import components
import NavbarPanel from "./NavbarPanel";
import PartyManager from "../party_manager/PartyManager";
import ExpenseManager from "../expense_manager/ExpenseManager";
import ProductManager from "../product_manager/ProductManager";
import OrderManager from "../readymade_cloth_order_manager/OrderManager";
import VendorManager from "../vendor_manager/VendorManager";
import LedgerManager from "../ledger_manager/LedgerManager";
import WorkerManager from "../worker_manager/WorkerManager";
import StockManager from "../stock_manager/StockManager";
import Dashboard from "../dashboard/Dashboarrd";
import PresentyManager from "../presenty_manager/PresentyManager";

function Main(props) {
	// const [authenticated, setAuthenticated] = useState(props.location.state);
	const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));

	function logout() {
	// setAuthenticated(false);
	console.log("hii")
	setAuth(null);
	localStorage.setItem("auth", null);
	}

	// const handleLogout = () => {
	// 	console.log("hii")
	// 	props.logout();
	// };

	if (auth && auth.isAuthenticated) {
		//const { userName } = authenticated;
		const userName = auth.userName;
		return (
			<Router>
				{/* <!-- Navbar --> */}
				<nav class="main-header navbar navbar-expand navbar-white navbar-light" style={{ backgroundColor: '#343a40' }}>
					{/* <!-- Left navbar links --> */}
					{/* <ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
						</li>
					</ul> */}

					{/* <!-- Right navbar links --> */}
					<ul class="navbar-nav ml-auto">
						{/* <!-- Navbar Search --> */}
						<li class="nav-item">
							<div className="image mt-1">
								<img
									src="dist/img/user2-160x160.jpg"
									className="img-circle elevation-2 mr-2"
									alt="User Image"
									style={{ width: '30px', height: '30px' }}
								/>
								<a className="brand-text mr-2" style={{ textTransform: 'capitalize' }}>{userName}</a>
								<Button
									variant="outline-secondary"
									 onClick={logout}
									size="sm"
								>
									<i class="fas fa-sign-out-alt m-0"></i>
								</Button>
							</div>

						</li>

						{/* <!-- Messages Dropdown Menu --> */}

						{/* <!-- Notifications Dropdown Menu --> */}


					</ul>
				</nav>
				{/* <!-- /.navbar --> */}
				{/* <Navbar bg="dark" expand="lg">
					<Navbar.Brand id="title" href="#home">
					Master Inventory
					</Navbar.Brand>
				</Navbar> */}
				<div className="container-fluid m-0 p-0">
					<Row className="m-0 p-0">
						<Col className="col-sm-2 mt-1 pl-1 pr-1">
						<NavbarPanel user={userName}  />
						</Col>
						<Col className="col-sm-10 mt-1 p-0">
							<Switch>
								{/* Manager Routes */}
								<Route
									exact
									path="/mainDashboard"
									component={OrderManager}
								/>
								<Route path="/productManager" exact component={ProductManager} />
								<Route path="/expenseManager" exact component={ExpenseManager} />
								<Route path="/partyManager" exact component={PartyManager} />
								<Route path="/workerManager" exact component={WorkerManager} />
								<Route path="/stockManager" exact component={StockManager} />
								<Route path="/dashboard" exact component={Dashboard} />
								<Route path="/presentyManager/:workerId" exact component={PresentyManager} />



								<Route
									path="/ledgerManager/:partyId"
									exact
									component={LedgerManager}
								/>
							</Switch>
						</Col>
					</Row>
				</div>
			</Router>
		);
	} else {
		return <Redirect to="/auth" />;
	}
}

export default Main;
