// core react components
import React, { Component } from "react";

// UI components
import { Button } from "@material-ui/core";
import {
	Row,
	Col,
	ListGroupItem,
	ListGroup,
	Card,
	Modal,
	Table as Tbl,
	Spinner,
} from "react-bootstrap";

// Icon components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

// miscellaneous components
import ReactToPrint from "react-to-print";
import moment from "moment";

// stylesheets
import "./style.css";

//API handling components
import { API_URL } from "./../../global";
const axios = require("axios");

class ViewOrder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false,
			shirtMeasurement: null,
			pantMeasurement: null,

			sewingItems: [],

			sewingItemTypeNames: [
				"साधा",
				"अॅपल कट",
				"मॅनेला",
				"मॅनेला साईडकट",
				"संग्राम कुर्ता",
				"नेहरू शर्ट",
				"३ बटन शर्ट",
				"४ बटन शर्ट",
				"नॅरो पँट",
				"स्टेट पँट",
				"नाडी बटन विजार",
				"बेल्ट विजार",
				"सफारी",
				"शेरवानी",
				"विजार पँट",
			],

			sewingOrderData: null,

			printrefM: null,
			printrefB: null,
		};
	}

	// fun: to fetch measurements
	getMeasurements(shirtId, pantId) {
		let url = API_URL + "/executeQuery";

		// 1. fetch shirt measurement
		if (shirtId != null) {
			const query = `SELECT * from shirtMeasurement where shirtId=${shirtId};`;
			let data = {
				crossDomain: true,
				crossOrigin: true,
				query: query,
			};
			axios
				.post(url, data)
				.then((res) => {
					this.setState({ shirtMeasurement: res.data[0] });
				})
				.catch((err) => {
					console.log(err);
				});
		}

		// 1. fetch pant measurement
		if (pantId != null) {
			const query = `SELECT * from pantMeasurement where pantId=${pantId};`;
			let data = {
				crossDomain: true,
				crossOrigin: true,
				query: query,
			};
			axios
				.post(url, data)
				.then((res) => {
					this.setState({ pantMeasurement: res.data[0] });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	// fun: to fetch sewing items
	getSewingItems(sewingItems) {
		let url = API_URL + "/executeQuery";

		if (sewingItems != null) {
			//  prepare sewingItems id's list
			let sewingItemsList = sewingItems.split("$").join(",");

			const query = `SELECT * FROM sewingItems WHERE itemId IN (${sewingItemsList});`;
			let data = {
				crossDomain: true,
				crossOrigin: true,
				query: query,
			};
			axios
				.post(url, data)
				.then((res) => {
					this.setState({ sewingItems: res.data });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	// fun: to fetch order data of specified ID
	getSewingOderData = (orderId) => {
		let url = API_URL + "/executeQuery";

		// fetch order data
		let query = `SELECT * from sewingOrders where orderId=${orderId};`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				this.setState({ sewingOrderData: res.data[0] });
				// fetch measurements
				this.getMeasurements(
					res.data[0].shirtMeasurementId,
					res.data[0].pantMeasurementId
				);
				// fetch sewingItems
				this.getSewingItems(res.data[0].itemIds);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	componentDidMount() {
		this.getSewingOderData(this.props.orderId);
	}

	renderSewingItems() {
		const sewingItems = this.state.sewingItems;
		if (sewingItems.length < 1) {
			return (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "22vh",
					}}
				>
					<Spinner animation="border" variant="primary" />
				</div>
			);
		}
		return (
			<Row className="m-0 p-0">
				<Tbl striped bordered hover size="sm">
					<thead>
						<tr>
							<th>S/P</th>
							<th>Type</th>
							<th>Qty</th>
							<th>Rate</th>
						</tr>
					</thead>
					{sewingItems.length > 0 ? (
						<tbody>
							{sewingItems.map((sewingItem, index) => {
								return (
									<tr key={index}>
										<td>{sewingItem.item === 1 ? "shirt" : "pant"} </td>
										<td>
											{this.state.sewingItemTypeNames[sewingItem.type - 1]}
										</td>
										<td>{sewingItem.quantity}</td>
										<td>₹ {sewingItem.price}</td>
									</tr>
								);
							})}
							<tr>
								<td colSpan="3" align="right">
									Total
								</td>
								<td>₹ {this.state.sewingOrderData.totalPrice}</td>
							</tr>
						</tbody>
					) : (
						<tbody>
							<tr>
								<td colSpan="4">No items added</td>
							</tr>
						</tbody>
					)}
				</Tbl>
			</Row>
		);
	}

	renderBill() {
		let orderData = this.state.sewingOrderData;
		return (
			<div className="mt-1 p-2 measure">
				<Row>
					<Col className="mx-auto">
						<Card className="mt-2 p-0">
							<Card.Header>
								<Card.Title className="text-center pb-0 mb-0">
									Guruprasad collection & Readymade center
								</Card.Title>
								<p className="text-center pb-0 mb-0">
									Shop no. 8, Indraprastha building, Near Sawarkar Statue
									Pandharpur
								</p>
								<p className="text-center">Mob.no. 9922190541, 9518959867</p>
								<span
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<p>Date {moment(new Date()).format("D / M / YYYY")}</p>

									<p>Bill No. {orderData != null && orderData.orderId}</p>
								</span>
							</Card.Header>
							<Card.Body className="pb-0 mb-0">
								<div className="dim">
									<p style={{ textTransform: "capitalize" }}>
										<b>Customer name</b>{" "}
										{orderData != null && orderData.customerName}
									</p>

									<p style={{ textTransform: "capitalize" }}>
										<b>Mobile</b>{" "}
										{orderData != null && orderData.customerMobile}
									</p>
								</div>
								<div className="dim">
									<p
										style={{ textTransform: "capitalize" }}
										className="mb-0 pb-0"
									>
										<b>Address</b>{" "}
										{orderData != null && orderData.customerAddress}
									</p>
								</div>
								<hr />
								{/* Order overview */}
								{this.renderSewingItems()}
								<hr />
								<div className="dim">
									<p>
										<b>Delivery Date</b>{" "}
										{orderData != null &&
											moment(orderData.deliveryDate).format("D / M / YYYY")}
									</p>
									<p>
										{" "}
										<b>Adv. Payment</b> ₹{" "}
										{orderData != null && orderData.advPayment}
									</p>
									<p>
										{" "}
										<b>Pending Payment</b> ₹{" "}
										{orderData != null &&
											parseInt(orderData.totalPrice) -
												parseInt(orderData.advPayment)}
									</p>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
	render() {
		return (
			<div>
				<Button
					color="secondary"
					variant="contained"
					className="ml-4"
					onClick={(e) => {
						this.setState({});
						this.setState({ showModal: true });
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
				<Modal
					show={this.state.showModal}
					onHide={(e) => this.setState({ showModal: false })}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<div>
							<ReactToPrint
								trigger={() => (
									<Button
										className="mt-2 mr-1"
										color="primary"
										variant="contained"
									>
										Print Measures
									</Button>
								)}
								content={() => this.el1}
							/>
							<ReactToPrint
								trigger={() => (
									<Button
										className="mt-2 mr-1"
										color="secondary"
										variant="contained"
									>
										Print Bill
									</Button>
								)}
								content={() => this.el2}
							/>
						</div>
					</Modal.Header>
					<Modal.Body>
						<div className="mt-1 p-2 measure2" ref={(el) => (this.el2 = el)}>
							{this.renderBill()}
						</div>
						<div ref={(el) => (this.el1 = el)}>
							<hr />
							<p>
								Order Id:{" "}
								{this.state.sewingOrderData != null &&
									this.state.sewingOrderData.orderId}
							</p>

							{this.renderSewingItems()}
							<Row className="m-1 pt-2 pb-2 measure">
								<Col md={6}>
									{/* shirt measurements */}
									<p className="mb-2 text-center">Shirt Measurements</p>
									<ListGroup variant="flush">
										<ListGroupItem className="dim">
											उंची
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.height}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											छाती
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.chest}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											शोल्डर
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.shoulder}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											बाही
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.handGloves}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											गळा
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.neck}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											फ्रंट
											<span>
												{this.state.shirtMeasurement != null &&
													this.state.shirtMeasurement.frontage}
											</span>
										</ListGroupItem>
									</ListGroup>
								</Col>
								<Col md={6}>
									{/* Pant measurements */}
									<p className="mb-2 text-center">Pant Measurements</p>
									<ListGroup variant="flush">
										<ListGroupItem className="dim">
											उंची
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.height}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											कंबर
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.waist}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											सीट
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.seat}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											मांडी
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.thigh}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											गुडघा
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.knee}
											</span>
										</ListGroupItem>
										<ListGroupItem className="dim">
											बॉटम
											<span>
												{this.state.pantMeasurement != null &&
													this.state.pantMeasurement.bottom}
											</span>
										</ListGroupItem>
									</ListGroup>
								</Col>
							</Row>
						</div>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

export default ViewOrder;
