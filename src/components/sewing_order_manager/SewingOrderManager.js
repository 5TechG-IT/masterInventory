// core react components
import React, { Component } from "react";

// UI components
import {
	TextField,
	AppBar,
	Tab,
	Table,
	TableBody,
	TableContainer,
	Button,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	FormControl,
	MenuItem,
	Select,
	InputLabel,
} from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import {
	Row,
	Col,
	ListGroupItem,
	ListGroup,
	Badge,
	Spinner,
} from "react-bootstrap";

// alert components
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

// miscellaneous components
import moment from "moment";

// stylesheets
import "./style.css";

// add child modules
import AddShirt from "./AddShirt";
import AddPant from "./AddPant";
import SearchMeasurement from "./SearchMeasurement";
import ViewOrder from "./viewOrder";

//API handling components
import { API_URL } from "./../../global";
const axios = require("axios");

class SewingOrderManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orderId: "",
			itemId: "",

			customerName: "",
			customerMobile: "",
			customerAddress: "",
			deliveryDate: new Date(),
			advPayment: "",

			shirtMeasurementId: null,
			shirtMeasurement: null,
			pantMeasurementId: null,
			pantMeasurement: null,

			sewingItems: [],
			sewingItemItem: 1,
			sewingItemType: 1,
			sewingItemQuantity: 1,
			sewingItemPrice: 105,

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

			searchInput: "",

			tabValue: "1",
			printref: null,
		};
	}

	//fun: to get latest sewingItems->itemId, shirtMeasurementId, pantMeasurementId
	getLatestIds() {
		let url = API_URL + "/executeQuery";
		const query1 = `SELECT MAX(shirtId) as shirtId from shirtMeasurement;`;
		const query2 = `SELECT MAX(pantId) as pantId from pantMeasurement;`;
		const query3 = `SELECT MAX(itemId) as itemId from sewingItems;`;

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
				this.setState({ shirtMeasurementId: res.data[0].shirtId + 1 });
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.post(url, data[1])
			.then((res) => {
				this.setState({ pantMeasurementId: res.data[0].pantId + 1 });
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.post(url, data[2])
			.then((res) => {
				this.setState({ itemId: res.data[0].itemId + 1 });
			})
			.catch((err) => {
				console.log(err);
			});
	}

	getSewingOderData = () => {
		let url = API_URL + "/executeQuery";
		const query = `SELECT * from sewingOrders order by orderId DESC;`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				this.setState({ sewingOrderData: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleTabs = (event, newValue) => {
		this.setState({ tabValue: newValue });
	};

	getShirtM(shirtMeasurement) {
		this.setState({ shirtMeasurement: shirtMeasurement });

		if (Object.keys(shirtMeasurement).length > 7) {
			this.setState({
				shirtMeasurementId: shirtMeasurement.shirtId,
			});
			this.setState({ customerName: shirtMeasurement.customerName });
			this.setState({ customerMobile: shirtMeasurement.customerMobile });
			this.setState({ customerAddress: shirtMeasurement.customerAddress });
		}
	}

	getPantM(pantMeasurement) {
		this.setState({ pantMeasurement: pantMeasurement });

		if (Object.keys(pantMeasurement).length > 7) {
			this.setState({
				pantMeasurementId: pantMeasurement.pantId,
			});
			this.setState({ customerName: pantMeasurement.customerName });
			this.setState({ customerMobile: pantMeasurement.customerMobile });
			this.setState({ customerAddress: pantMeasurement.customerAddress });
		}
	}

	addSewingItem() {
		let state = this.state;
		let addedItems = {
			item: state.sewingItemItem,
			type: state.sewingItemType,
			quantity: state.sewingItemQuantity,
			price: state.sewingItemPrice,
		};
		this.setState({ sewingItems: [...state.sewingItems, addedItems] });
	}

	removeSewingItem(index) {
		let sewingItems = this.state.sewingItems;
		sewingItems.splice(index, 1);
		this.setState({ sewingItems });
	}

	handleOrderSave(e) {
		let url = API_URL + "/executeQuery";

		// calculate object length
		let shirtMeasurementLength =
			this.state.shirtMeasurement != null
				? Object.keys(this.state.shirtMeasurement).length
				: 0;
		let pantMeasurementLength =
			this.state.pantMeasurement != null
				? Object.keys(this.state.pantMeasurement).length
				: 0;

		//insert shirtMeasurementData to DB
		if (shirtMeasurementLength !== 0 && shirtMeasurementLength < 8) {
			const {
				height,
				chest,
				shoulder,
				handGloves,
				neck,
				frontage,
			} = this.state.shirtMeasurement;
			const query = `INSERT INTO shirtMeasurement (height,chest,shoulder,handGloves,neck,frontage) VALUES('${height}','${chest}','${shoulder}','${handGloves}','${neck}','${frontage}')`;

			let data = {
				crossDomain: true,
				crossOrigin: true,
				query: query,
			};
			axios
				.post(url, data)
				.then((res) => {
					console.log("shirtMeasurement added to DB");
				})
				.catch((err) => {
					console.log(err);
				});
		}

		// insert pantMeasurementData to DB
		if (pantMeasurementLength !== 0 && pantMeasurementLength < 8) {
			const {
				height,
				waist,
				seat,
				thigh,
				knee,
				bottom,
			} = this.state.pantMeasurement;
			const query = `INSERT INTO pantMeasurement (height,waist,seat,thigh,knee,bottom) VALUES('${height}','${waist}','${seat}','${thigh}','${knee}','${bottom}')`;

			let data = {
				crossDomain: true,
				crossOrigin: true,
				query: query,
			};

			axios
				.post(url, data)
				.then((res) => {
					console.log("pantMeasurement added to DB");
				})
				.catch((err) => {
					console.log(err);
				});
		}

		// insert sewingItems to DB
		if (this.state.sewingItems.length > 0) {
			for (let i = 0; i < this.state.sewingItems.length; i++) {
				const { item, type, quantity, price } = this.state.sewingItems[i];
				const query = `INSERT INTO sewingItems (item, type, quantity, price) VALUES(${item},${type},${quantity},${price})`;

				let data = {
					crossDomain: true,
					crossOrigin: true,
					query: query,
				};

				axios
					.post(url, data)
					.then((res) => {
						console.log("sewing item added to DB");
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}

		// insert sewingOrder to DB
		if (
			this.state.customerName &&
			this.state.customerMobile &&
			this.state.customerAddress
		) {
			const sId =
				shirtMeasurementLength === 0
					? null
					: shirtMeasurementLength < 8
					? this.state.shirtMeasurementId
					: this.state.shirtMeasurement.shirtId;

			const pId =
				pantMeasurementLength === 0
					? null
					: pantMeasurementLength < 8
					? this.state.pantMeasurementId
					: this.state.pantMeasurement.pantId;

			// form item Ids
			let itemIds = null;
			if (this.state.sewingItems.length > 0) {
				const itemId = this.state.itemId;
				itemIds = "" + itemId;
				for (let i = 1; i < this.state.sewingItems.length; i++) {
					itemIds = itemIds + "$" + (itemId + i);
				}
			}

			// calculate total bill
			let totalBill = 0;
			if (this.state.sewingItems != null) {
				for (let i = 0; i < this.state.sewingItems.length; i++) {
					totalBill += parseInt(this.state.sewingItems[i].price);
				}

				const date = new Date();

				const query = `INSERT INTO sewingOrders (customerName, customerMobile, customerAddress, shirtMeasurementId, pantMeasurementId, itemIds, totalPrice, advPayment, OrderDate, deliveryDate, status) VALUES('${
					this.state.customerName
				}', '${this.state.customerMobile}', '${
					this.state.customerAddress
				}', ${sId}, ${pId}, '${itemIds}', ${totalBill}, ${
					this.state.advPayment
				}, '${moment(date).format()}','${this.state.deliveryDate}',1)`;

				let data = {
					crossDomain: true,
					crossOrigin: true,
					query: query,
				};

				axios
					.post(url, data)
					.then((res) => {
						console.log("sewing orders data added to DB");
						Swal.fire({
							title: "Order Confirmed",
							text: "Sewing orders data saved successfully",
							icon: "success",
						});
						this.getLatestIds();
						this.getSewingOderData();

						this.setState({ customerName: "" });
						this.setState({ customerAddress: "" });
						this.setState({ customerMobile: "" });
						this.setState({ advPayment: "" });
						this.setState({ deliveryDate: new Date() });

						this.setState({ sewingItems: [] });

						this.setState({ shirtMeasurement: null });
						this.setState({ pantMeasurement: null });
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	}

	handleStatusChange(e, id) {
		let url = API_URL + "/executeQuery";
		const query = `Update sewingOrders SET status=${e.target.value} where orderId ='${id}';`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				toast(`order status updated`);
				this.getSewingOderData();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentDidMount() {
		this.getLatestIds();
		this.getSewingOderData();
	}

	renderOrderHistory() {
		if (this.state.sewingOrderData == null) {
			return (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "70vh",
					}}
				>
					<Spinner animation="border" variant="primary" />
				</div>
			);
		}
		return (
			<Row>
				<Col md="12" className="m-0 p-1 measure1" style={{ minHeight: "70vh" }}>
					<TableContainer component={Paper} style={{ maxHeight: "75vh" }}>
						<Table
							stickyHeader
							size="medium"
							aria-label="simple table"
							component={Paper}
						>
							<TableHead>
								<TableRow>
									<TableCell align="center">Order Id</TableCell>
									<TableCell>Customer name</TableCell>
									<TableCell>Address</TableCell>
									<TableCell align="center">Mobile no.</TableCell>
									<TableCell align="center">Bill amount</TableCell>
									<TableCell align="center">Order date</TableCell>
									<TableCell align="center">Status</TableCell>
									<TableCell align="center">Options</TableCell>
									<TableCell align="center">Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.sewingOrderData.length > 0 ? (
									this.state.sewingOrderData.map((order) => {
										if (
											this.state.searchInput !== "" &&
											order.customerName
												.toUpperCase()
												.indexOf(this.state.searchInput.toUpperCase()) < 0
										) {
											return null;
										}
										return (
											<TableRow key={order.orderId}>
												<TableCell align="center">{order.orderId}</TableCell>
												<TableCell style={{ textTransform: "capitalize" }}>
													{order.customerName}
												</TableCell>
												<TableCell>{order.customerAddress}</TableCell>
												<TableCell align="center">
													{order.customerMobile}
												</TableCell>

												<TableCell align="center">
													₹ {order.totalPrice}
												</TableCell>
												<TableCell align="center">
													{moment(order.orderDate).format("D / M / YYYY")}
												</TableCell>
												<TableCell align="center">
													<h6>
														{order.status === 1 ? (
															<Badge variant="warning">In Progress</Badge>
														) : order.status === 2 ? (
															<Badge variant="success">Completed</Badge>
														) : (
															<Badge variant="danger">Canceled</Badge>
														)}
													</h6>
												</TableCell>
												<TableCell>
													<ViewOrder orderId={order.orderId} />
												</TableCell>
												<TableCell align="center">
													<FormControl
														variant="filled"
														style={{ minWidth: "120px" }}
														size="small"
														className="mb-n2 mt-n2"
													>
														<InputLabel id="demo-simple-select-outlined-label">
															Status
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-label"
															id="demo-simple-select-outlined"
															label="status"
															onChange={(e) =>
																this.handleStatusChange(e, order.orderId)
															}
														>
															<MenuItem value={1}>In progress</MenuItem>
															<MenuItem value={2}>Completed</MenuItem>
															<MenuItem value={3}>Canceled</MenuItem>
														</Select>
													</FormControl>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell>No data found</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Col>
			</Row>
		);
	}

	renderSewingItems() {
		let sewingItemRows = [];
		const sewingItems = this.state.sewingItems;

		if (sewingItems.length < 1) {
			return <p>No items added</p>;
		} else {
			for (let i = 0; i < sewingItems.length; i++) {
				let sewingItem = sewingItems[i];
				let index = i;

				sewingItemRows.push(
					<TableRow>
						<TableCell align="center">
							{sewingItem.item === 1 ? "शर्ट" : "पँट"}
						</TableCell>
						<TableCell align="center">
							{this.state.sewingItemTypeNames[sewingItem.type - 1]}
						</TableCell>
						<TableCell align="center">{sewingItem.quantity}</TableCell>
						<TableCell align="center">{sewingItem.price}</TableCell>
						<TableCell align="center">
							<Button
								color="secondary"
								onClick={() => {
									this.removeSewingItem(index);
								}}
							>
								X
							</Button>
						</TableCell>
					</TableRow>
				);
			}
		}

		return (
			<Row className="m-0 p-0">
				<TableContainer component={Paper} style={{ maxHeight: "82vh" }}>
					<Table
						stickyHeader
						size="small"
						aria-label="simple table"
						component={Paper}
					>
						<TableHead>
							<TableRow>
								<TableCell align="center">S/P</TableCell>
								<TableCell align="center">Type</TableCell>
								<TableCell align="center">Quantity</TableCell>
								<TableCell align="center">Price</TableCell>
								<TableCell align="center">X</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{sewingItemRows}</TableBody>
					</Table>
				</TableContainer>
			</Row>
		);
	}

	renderNewOrder() {
		return (
			<form>
				<Row>
					<Col>
						<TextField
							id="custName"
							label="Customer name"
							variant="outlined"
							className="mr-2"
							value={this.state.customerName}
							onChange={(e) => this.setState({ customerName: e.target.value })}
							required="true"
						/>
					</Col>
					<Col>
						<TextField
							id="cutomerMobile"
							label="Mobile No."
							variant="outlined"
							className="mr-2"
							type="number"
							value={this.state.customerMobile}
							onChange={(e) =>
								this.setState({ customerMobile: e.target.value })
							}
							required="true"
						/>
					</Col>
					<Col>
						<TextField
							id="custAddress"
							label="Address"
							variant="outlined"
							className="mr-2"
							value={this.state.customerAddress}
							onChange={(e) =>
								this.setState({ customerAddress: e.target.value })
							}
							required="true"
						/>
					</Col>
					<Col>
						<TextField
							id="advPayment"
							label="Adv. Payment"
							variant="outlined"
							className="mr-2"
							value={this.state.advPayment}
							onChange={(e) => this.setState({ advPayment: e.target.value })}
							required="true"
						/>
					</Col>
					<Col>
						<TextField
							id="deliveryDate"
							variant="outlined"
							className="mr-2"
							type="date"
							label="Delivery Date"
							value={this.state.deliveryDate}
							onChange={(e) => this.setState({ deliveryDate: e.target.value })}
							required="true"
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Col>
				</Row>
				<Row className="m-0 p-0 mt-3">
					<Col className="m-0 p-0" md="1">
						<FormControl variant="filled" size="small">
							<InputLabel id="demo-simple-select-outlined-label">
								Item
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="item"
								style={{ minWidth: "95px" }}
								defaultValue={this.state.sewingItemItem}
								onChange={(e) =>
									this.setState({ sewingItemItem: e.target.value })
								}
							>
								<MenuItem value={1}>शर्ट</MenuItem>
								<MenuItem value={2}>पँट</MenuItem>
							</Select>
						</FormControl>
					</Col>
					<Col className="m-0 p-0" md="2">
						<FormControl variant="filled" size="small">
							<InputLabel id="demo-simple-select-outlined-label">
								प्रकार
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="type"
								style={{ minWidth: "95px" }}
								value={this.state.sewingItemType}
								defaultValue={1}
								onChange={(e) => {
									this.setState({ sewingItemType: e.target.value });
								}}
							>
								<MenuItem value={1}>साधा</MenuItem>
								<MenuItem value={2}>अॅपल कट</MenuItem>
								<MenuItem value={3}>मॅनेला</MenuItem>
								<MenuItem value={4}>मॅनेला साईडकट</MenuItem>
								<MenuItem value={5}>संग्राम कुर्ता</MenuItem>
								<MenuItem value={6}>नेहरू शर्ट</MenuItem>
								<MenuItem value={7}>३ बटन शर्ट</MenuItem>
								<MenuItem value={8}>४ बटन शर्ट</MenuItem>
								<MenuItem value={9}>नॅरो पँट</MenuItem>
								<MenuItem value={10}>स्टेट पँट</MenuItem>
								<MenuItem value={11}>नाडी बटन विजार</MenuItem>
								<MenuItem value={12}>बेल्ट विजार</MenuItem>
								<MenuItem value={13}>सफारी</MenuItem>
								<MenuItem value={14}>शेरवानी</MenuItem>
								<MenuItem value={15}>विजार पँट</MenuItem>
							</Select>
						</FormControl>
					</Col>
					<Col className="m-0 p-0" md="1">
						<TextField
							id="quantity"
							label="Quantity"
							variant="outlined"
							type="number"
							size="small"
							className="mt-1 mr-2"
							value={this.state.sewingItemQuantity}
							onChange={(e) => {
								this.setState({ sewingItemQuantity: e.target.value });
							}}
							required="true"
						/>
					</Col>
					<Col className="m-0 p-0" md="3">
						<TextField
							id="price"
							label="Price"
							variant="outlined"
							type="number"
							value={this.state.sewingItemPrice}
							size="small"
							className="mt-1 mr-2"
							onChange={(e) => {
								this.setState({ sewingItemPrice: e.target.value });
							}}
							required="true"
						/>
						<Button
							color="primary"
							variant="contained"
							className="mt-1"
							onClick={(e) => {
								this.addSewingItem();
							}}
						>
							Add
						</Button>
					</Col>
					<Col className="mt-1 p-0" md="1">
						<AddShirt
							getShirtM={(shirtMeasurement) => this.getShirtM(shirtMeasurement)}
						/>
					</Col>
					<Col className="mt-1 p-0" md="1">
						<AddPant
							getPantM={(pantMeasurement) => this.getPantM(pantMeasurement)}
						/>
					</Col>
					<Col className="mt-1 p-0" md="3">
						<SearchMeasurement
							getShirtM={(shirtMeasurement) => this.getShirtM(shirtMeasurement)}
							getPantM={(pantMeasurement) => this.getPantM(pantMeasurement)}
						/>
					</Col>
				</Row>
				<div className="mt-2 p-2 measure">
					{this.renderSewingItems()}
					<hr />
					<Row className="mt-0">
						<Col md={6}>
							{/* shirt measurements */}
							<p className="mb-2 text-center">Shirt Measurements</p>
							<ListGroup variant="flush">
								<ListGroupItem className="dim">
									Height
									<span>
										{this.state.shirtMeasurement != null &&
											this.state.shirtMeasurement.height}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Chest
									<span>
										{this.state.shirtMeasurement != null &&
											this.state.shirtMeasurement.chest}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Shoulder
									<span>
										{this.state.shirtMeasurement != null &&
											this.state.shirtMeasurement.shoulder}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Hand gloves
									<span>
										{this.state.shirtMeasurement != null &&
											this.state.shirtMeasurement.handGloves}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Neck
									<span>
										{this.state.shirtMeasurement != null &&
											this.state.shirtMeasurement.neck}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Frontage
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
									Height
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.height}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Waist
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.waist}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Seat
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.seat}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Thigh
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.thigh}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Knee
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.knee}
									</span>
								</ListGroupItem>
								<ListGroupItem className="dim">
									Bottom
									<span>
										{this.state.pantMeasurement != null &&
											this.state.pantMeasurement.bottom}
									</span>
								</ListGroupItem>
							</ListGroup>
						</Col>
					</Row>
				</div>
				<Button
					className="mt-2 mr-1"
					color="secondary"
					variant="contained"
					style={{ float: "right" }}
					onClick={(e) => {
						this.handleOrderSave(e);
					}}
					disabled={
						this.state.customerName &&
						this.state.customerAddress &&
						this.state.customerMobile
							? false
							: true
					}
				>
					confirm order
				</Button>
			</form>
		);
	}

	render() {
		return (
			<TabContext
				value={this.state.tabValue}
				className="container-fluid border m-0 p-0 main"
			>
				<AppBar position="static" color="default">
					<TabList
						onChange={this.handleTabs}
						aria-label="sewing order manager tabs"
						indicatorColor="primary"
						textColor="primary"
					>
						<Tab label="New Order" value="1" />
						<Tab label="Order history" value="2" />
					</TabList>
				</AppBar>
				<TabPanel
					value="1"
					className="container-fluid"
					style={{ padding: "15px 18px 0px 10px" }}
				>
					{this.renderNewOrder()}
				</TabPanel>

				<TabPanel value="2" className="container-fluid mt-0 pt-3 pl-4 pr-3">
					<Row>
						<Col className="m-0 p-0">
							<TextField
								id="custName"
								label="search name"
								variant="outlined"
								className="ml-1 p-0"
								placeholder={"enter name to search"}
								onChange={(e) => this.setState({ searchInput: e.target.value })}
								required="true"
							/>
						</Col>
					</Row>
					{this.renderOrderHistory()}
				</TabPanel>

				<ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={5000} />
			</TabContext>
		);
	}
}

export default SewingOrderManager;
