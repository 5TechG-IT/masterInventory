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
		<div className="container-fluid  main-navbar">
			<div>
				<Card className="mb-2">
					<Card.Body className="p-2 profile-body">
						<Avatar className="profile">
							{props.user.slice(0, 1).toUpperCase()}
						</Avatar>
						<Badge
							variant="warning"
							className="mt-2"
							style={{ textTransform: "capitalize" }}
						>
							{props.user}
						</Badge>
					</Card.Body>
				</Card>
				<Card border="primary" className="mb-2">
					<Card.Body className="m-0 p-1">
						<h6>Menu</h6>
						<Link to="/dashboard">
							<Button variant="primary" size="sm" block className="mb-2">
								Dashboard
							</Button>
						</Link>
						<Link to="/mainDashboard">
							<Button variant="primary" size="sm" block className="mb-2">
								Bill Manager
							</Button>
						</Link>
						<Link to="/productManager">
							<Button variant="primary" size="sm" block className="mb-2" >
								Product manager
							</Button>
						</Link>
						<Link to="/stockManager">
							<Button variant="primary" size="sm" block className="mb-2">
								Stock manager
							</Button>
						</Link>
						<Link to="/expenseManager">
							<Button variant="primary" size="sm" block className="mb-2">
								Expense manager
							</Button>
						</Link>
						<Link to="/partyManager">
							<Button variant="primary" size="sm" block className="mb-2">
								Party manager
							</Button>
						</Link>
						<Link to="/workerManager">
							<Button variant="primary" size="sm" block className="mb-2">
								Worker manager
							</Button>
						</Link>
					

						{/* <Link to="/partyManager">
							<Button variant="primary" size="sm" block className="mb-2">
								Setting
							</Button>
						</Link> */}

					</Card.Body>
				</Card>
				{/* <Card className="m-0 p-1">
					<Card.Body className="m-0 p-1">
						<Statistics />
					</Card.Body>
				</Card> */}
			</div>
			<Row>
				<Col xs={6} className="mx-auto">
					<Button
						variant="dark btn-block"
						size="sm"
						className="mb-2"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Col>
			</Row>
		</div>


	);
}

export default NavbarPanel;
