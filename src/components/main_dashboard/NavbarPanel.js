
import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import "./style.css";
import { useContex,useState } from "react";

import Statistics from "./Statistics";


function NavbarPanel(props) {
	const handleLogout = () => {
		props.logout();
	};

	// const [userName, setUserName] = useState(
	// 	localStorage.getItem("userName") != "null"
	// 		? String(localStorage.getItem("userName"))
	// 		: false
	// );
	// console.log(userName)
	

        return (
            <div>
                {/* Main Sidebar Container */}
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <div className="brand-link">
                        <Link to={`/dashboard`}>
                            <img
                                src="dist/img/AdminLTELogo.png"
                                alt="AdminLTE Logo"
                                className="brand-image img-circle elevation-3"
                                style={{ opacity: ".8" }}
                            />
                            <span className="brand-text font-weight-light">
                                <b>Master Inventory</b>
                            </span>
                        </Link>
                    </div>
                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar user panel (optional) */}
                        {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image mt-1">
                                <img
                                    src="dist/img/user2-160x160.jpg"
                                    className="img-circle elevation-2"
                                    alt="User Image"
                                />
                            </div>
                            <div className="info" className="d-flex">
                                <a className="d-flex d-auto mx-2" style={{ textTransform: "capitalize" }}>
									{props.user}
                                </a>
                                <div class="clearfix"></div>

                                <Button
                                    variant="outline-secondary"
                                    onClick={handleLogout}
                                    size="sm"
                                >
                                    <i class="fas fa-sign-out-alt m-0"></i>
                                </Button>
                            </div>
                        </div> */}

                        {/* Sidebar Menu */}
                        <nav className="mt-2">
                            <ul
                                className="nav nav-pills nav-sidebar flex-column nav-treeview"
                                data-widget="treeview"
                                role="menu"
                                data-accordion="false"
                            >
                                {/* Add icons to the links using the .nav-icon class
                                with font-awesome or any other icon font library */}
                               
								<Link to="/dashboard">
							<Button variant="Primary" size="sm" block  className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}}>
								Dashboard
							</Button>
						</Link>
                               
								<Link to="/mainDashboard">
							<Button variant="light" size="sm" block  className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}} >
								Bill Manager
							</Button>
						</Link>
                              
								<Link to="/productManager">
							<Button variant="light" size="sm" block className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}}  >
								Product manager
							</Button>
						</Link>
                               

								<Link to="/stockManager">
							<Button variant="light" size="sm" block className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}} >
								Stock manager
							</Button>
						</Link>
                               
								<Link to="/expenseManager">
							<Button variant="light" size="sm" block className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}}>
								Expense manager
							</Button>
						</Link>
                                
								<Link to="/partyManager">
							<Button variant="light" size="sm" block className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}}  >
								Party manager
							</Button>
						</Link>
                                
								<Link to="/workerManager">
							<Button variant="light" size="sm" block className="nav-link active" style={{marginBottom:'8px',height:'25px',paddingBottom:'23px',paddingTop:'5px'}}  >
								Worker manager
							</Button>
						</Link>
                               
                            </ul>
                        </nav>
                        {/* /.sidebar-menu */}
                    </div>
                    {/* /.sidebar */}
                </aside>
            </div>
        );
  
}

export default NavbarPanel;