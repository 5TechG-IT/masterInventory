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
	InputLabel,
	MenuItem,
	Select,
	FormControl,
} from "@material-ui/core";
import {
	Modal,
	Button as Btn1,
	Row,
	Col,
	Badge,
	Table as Tbl,
	Spinner,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//API handling components
import { API_URL } from "../../../global";
const axios = require("axios");

export class FarmerManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			showDeleteModal1: false,
			showDeleteModal2: false,
			activeTaskId: "",
			taskId: "",
			workerId: "",
			workerName: "",
			workerType: "",
			sewingOrderId: "",
			shirtPrice: 105,
			pantPrice: 130,
			cuttingPrice: 80,
			shirtQuantity: 0,
			pantQuantity: 0,
			totalPrice: 0,
			taskData: {},
			tastId: "",
			addedItem: [],
			taskItem: [],
		};
	}
	getTaskData() {
		let url = API_URL + "/executeQuery";
		const query = `SELECT * from workerTasks order by taskId DESC;`;
		let data = {
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				console.log(res.data);
				this.setState({ taskData: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	getLatestId() {
		let url = API_URL + "/executeQuery";
		const query1 = `SELECT MAX(taskId) as tID from workerTasks;`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query1,
		};
		axios
			.post(url, data)
			.then((res) => {
				console.log(res.data);
				this.setState({ taskId: res.data[0].tID + 1 });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	componentDidMount() {
		this.getTaskData();
		this.getLatestId();
	}
	addBillItem(state) {
		const {
			sewingOrderId,
			shirtQuantity,
			pantQuantity,
			shirtPrice,
			pantPrice,
			totalPrice,
			cuttingPrice,
			workerType,
		} = state;
		const tempItem = {
			sewingOrderId: sewingOrderId,
			shirtQuantity: shirtQuantity,
			pantQuantity: pantQuantity,
		};
		const total1 = shirtQuantity * shirtPrice + pantQuantity * pantPrice;
		const total2 = shirtQuantity * cuttingPrice + pantQuantity * cuttingPrice;
		if (workerType === "Cutter") {
			this.setState({ totalPrice: totalPrice + total2 });
		} else {
			this.setState({ totalPrice: totalPrice + total1 });
		}
		this.setState({
			addedItem: [...state.addedItem, tempItem],
			sewingOrderId: "",
			shirtQuantity: 0,
			pantQuantity: 0,
		});
	}
	handleSubmit(e, state) {
		e.preventDefault();
		const date = new Date();
		let url = API_URL + "/executeQuery";
		const { workerId, workerName, totalPrice, addedItem, taskId } = state;
		const values = addedItem.map((item) => {
			return `('${item.sewingOrderId}','${item.shirtQuantity}','${item.pantQuantity}','${taskId}')`;
		});
		const params = values.join(",");
		const query1 = `INSERT INTO workerTasks (workerId,workerName,totalAmount,date,status) VALUES('${workerId}','${workerName}','${totalPrice}','${moment(
			date
		).format()}',1)`;
		const query2 = `INSERT INTO workerTaskItems (orderId,shirtCount,pantCount,taskId) VALUES${params};`;
		console.log(query1);
		console.log(query2);
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
		];
		axios
			.post(url, data[0])
			.then((res) => {
				toast.success("Task added successfully");
				this.getTaskData();
				this.getLatestId();
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.post(url, data[1])
			.then((res) => {
				console.log(res, "items added");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	fetchWorkerName(e) {
		e.preventDefault();
		this.setState({ workerId: e.target.value });

		let url = API_URL + "/executeQuery";
		const query = `SELECT workerName,type from workerManager WHERE workerId=${e.target.value};`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				console.log(res.data[0]["workerName"]);
				this.setState({ workerName: res.data[0]["workerName"] });
				this.setState({ workerType: res.data[0]["type"] });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	handleStatusChange = (e, id) => {
		let url = API_URL + "/executeQuery";
		const query = `Update workerTasks SET status=${e.target.value} where taskId =${id};`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				toast(`Task status updated`);
				this.getTaskData();
			})
			.catch((err) => {
				console.log(err);
			});
	};
	renderTaskItems(taskId) {
		let url = API_URL + "/executeQuery";
		const query = `SELECT * FROM workerTaskItems WHERE taskId=${taskId};`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				this.setState({ taskItem: res.data });
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	deleteTask(taskId) {
		let url = API_URL + "/executeQuery";
		const query = `DELETE from workerTasks WHERE taskId=${taskId};`;
		let data = {
			crossDomain: true,
			crossOrigin: true,
			query: query,
		};
		axios
			.post(url, data)
			.then((res) => {
				toast.success("Task deleted successfully");
				this.getTaskData();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	render() {
		return (
			<div className="container-fluid m-0 p-1">
				<TableContainer component={Paper} style={{ maxHeight: "79vh" }}>
					<Table stickyHeader aria-label="simple table" component={Paper}>
						<TableHead>
							<TableRow>
								<TableCell align="center">Party Id</TableCell>
								<TableCell>Name</TableCell>
								<TableCell align="center">Contact No</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Type</TableCell>
								<TableCell align="center">Options</TableCell>		
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.taskData.length > 0 ? (
								this.state.taskData.map((task) => {
									return (
										<TableRow key={task.taskId}>
											<TableCell align="center">
												<Badge variant="primary"> {task.taskId}</Badge>
											</TableCell>
											<TableCell align="center">
												<Badge variant="info">{task.workerId}</Badge>
											</TableCell>
											<TableCell
												align="center"
												style={{ textTransform: "capitalize" }}
											>
												{task.workerName}
											</TableCell>
											<TableCell align="center">₹ {task.totalAmount}</TableCell>

											<TableCell>
												{moment(task.date).format("dddd, D/M/YYYY hh:mm ")}
											</TableCell>
											<TableCell align="center">
												<h6>
													{task.status === 1 ? (
														<Badge variant="warning">Pending</Badge>
													) : (
														<Badge variant="success">Completed</Badge>
													)}
												</h6>
											</TableCell>
											<TableCell align="center">
												<FormControl
													variant="filled"
													style={{ minWidth: "100px" }}
													size="small"
													className="mb-n2 mt-n2 mr-2"
												>
													<InputLabel id="demo-simple-select-outlined-label">
														Status
													</InputLabel>
													<Select
														labelId="demo-simple-select-outlined-label"
														id="demo-simple-select-outlined"
														label="status"
														onChange={(e) =>
															this.handleStatusChange(e, task.taskId)
														}
													>
														<MenuItem value={1}>Pending</MenuItem>
														<MenuItem value={2}>Completed</MenuItem>
													</Select>
												</FormControl>
												<Button
													color="primary"
													variant="contained"
													className="mt-1 mb-1 mr-2"
													onClick={(e) => {
														this.setState({ showDeleteModal1: true });
														this.renderTaskItems(task.taskId);
													}}
												>
													<FontAwesomeIcon icon={faEye} />
												</Button>
												<Button
													color="secondary"
													variant="contained"
													className="mt-1 mb-1"
													onClick={(e) => {
														this.setState({
															activeTaskId: task.taskId,
														});
														this.setState({ showDeleteModal2: true });
													}}
												>
													<FontAwesomeIcon icon={faTrash} />
												</Button>
												{/* view modal */}
												<Modal
													show={this.state.showDeleteModal1}
													onHide={(e) => {
														this.setState({ showDeleteModal1: false });
													}}
													size="md"
													aria-labelledby="contained-modal-title-vcenter"
													centered
												>
													<Modal.Header closeButton>
														<Modal.Title id="contained-modal-title-vcenter">
															Task overview
														</Modal.Title>
													</Modal.Header>
													<Modal.Body>
														{this.state.taskItem.length > 0 ? (
															<Tbl striped bordered hover>
																<thead>
																	<tr>
																		<th>bill no</th>
																		<th>shirt</th>
																		<th>Pant</th>
																	</tr>
																</thead>
																<tbody>
																	{this.state.taskItem.map((item) => {
																		return (
																			<tr key={item.orderId}>
																				<td>{item.orderId} </td>
																				<td>{item.shirtCount} </td>
																				<td>{item.pantCount} </td>
																			</tr>
																		);
																	})}
																</tbody>
															</Tbl>
														) : (
															<div className="view-loader">
																<Spinner animation="border" variant="primary" />
															</div>
														)}
													</Modal.Body>
												</Modal>

												{/* delete modal */}
												<Modal
													show={this.state.showDeleteModal2}
													onHide={(e) =>
														this.setState({ showDeleteModal2: false })
													}
													size="md"
													aria-labelledby="contained-modal-title-vcenter"
													centered
												>
													<Modal.Header closeButton>
														<Modal.Title id="contained-modal-title-vcenter">
															Delete task record
														</Modal.Title>
													</Modal.Header>
													<Modal.Body>
														<p>Do you really want to delete this task?</p>
														<Button
															color="danger"
															variant="contained"
															className="mt-1 mb-1"
															onClick={() =>
																this.deleteTask(this.state.activeTaskId)
															}
														>
															Delete
														</Button>
													</Modal.Body>
												</Modal>
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
				<ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={5000} />
			</div>
		);
	}
}

export default FarmerManager;
