import React, { Component } from "react";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import moment from "moment";

//API handling components
import { API_URL } from "./../../global";
const axios = require("axios");

export class Statistics extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalShow: false,
			readymadeTotal: "",
			todaysReadymadeTotal: "",
			sewingTotal: "",
			todaysSewingTotal: "",
			expensesTotal: "",
			todaysExpensesTotal: "",
		};
	}
	componentDidMount() {
		const date = new Date();
		let url = API_URL + "/executeQuery";
		const query1 = `SELECT SUM(totalPrice) as RMT1 FROM readymadeOrders union SELECT SUM(totalPrice) as RMT2 FROM readymadeOrders WHERE orderDate like '${moment(
			date
		).format("YYYY-MM-DD")}%'`;
		const query2 = `SELECT SUM(totalPrice) as ST1 FROM sewingOrders union SELECT SUM(totalPrice) as ST2 FROM sewingOrders WHERE orderDate like '${moment(
			date
		).format("YYYY-MM-DD")}%'`;
		const query3 = `SELECT SUM(amount) as E1 FROM expenseManager union SELECT SUM(amount) as E2 FROM expenseManager WHERE date like '${moment(
			date
		).format("YYYY-MM-DD")}%'`;
		let data = [
			{
				crossDomain: true,
				crossOrigin: true,
				query: query1,
			},
			{
				crossDomain: true,
				crossOrigin: true,
				query: query2,
			},
			{
				crossDomain: true,
				crossOrigin: true,
				query: query3,
			},
		];
		axios
			.post(url, data[0])
			.then((res) => {
				console.log(res.data);
				this.setState({ readymadeTotal: res.data[0].RMT1 });
				this.setState({ todaysReadymadeTotal: res.data[1].RMT1 });
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.post(url, data[1])
			.then((res) => {
				console.log(res.data);
				this.setState({ sewingTotal: res.data[0].ST1 });
				this.setState({ todaysSewingTotal: res.data[1].ST1 });
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.post(url, data[2])
			.then((res) => {
				console.log(res.data);
				this.setState({ expensesTotal: res.data[0].E1 });
				this.setState({ todaysExpensesTotal: res.data[1].E1 });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const format = new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 2,
		});
		const {
			readymadeTotal,
			sewingTotal,
			expensesTotal,
			todaysReadymadeTotal,
			todaysSewingTotal,
			todaysExpensesTotal,
		} = this.state;
		return (
			<div>
				{/* <Button
					variant="info btn-sm btn-block"
					// onClick={() => this.setState({ modalShow: true })}
				>
					View Statistics
				</Button> */}
				{/* <Modal
					show={this.state.modalShow}
					onHide={() => this.setState({ modalShow: false })}
					size="md"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Statistics
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col>
								<h6 className="text-center">Today's statistics</h6>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Readymade section</h6>
										<Button variant="info" size="sm" block>
											{format.format(readymadeTotal)}
										</Button>
									</Card.Body>
								</Card>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Tailoring section</h6>
										<Button variant="info" size="sm" block>
											{format.format(sewingTotal)}
										</Button>
									</Card.Body>
								</Card>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Expenses</h6>
										<Button variant="danger" size="sm" block>
											{format.format(expensesTotal)}
										</Button>
									</Card.Body>
								</Card>
							</Col>
							<Col>
								<h6 className="text-center">Total statistics</h6>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Readymade section</h6>
										<Button variant="info" size="sm" block>
											{format.format(todaysReadymadeTotal)}
										</Button>
									</Card.Body>
								</Card>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Tailoring section</h6>
										<Button variant="info" size="sm" block>
											{format.format(todaysSewingTotal)}
										</Button>
									</Card.Body>
								</Card>
								<Card className="mb-1 p-1">
									<Card.Body className="m-0 p-1">
										<h6>Expenses</h6>
										<Button variant="danger" size="sm" block>
											{format.format(todaysExpensesTotal)}
										</Button>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Modal.Body>
				</Modal> */}
			</div>
		);
	}
}

export default Statistics;
