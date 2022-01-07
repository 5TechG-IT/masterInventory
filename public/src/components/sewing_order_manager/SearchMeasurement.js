import React, { useState } from "react";
import {
	Button as Btn1,
	TextField,
	FormControl,
	FormGroup,
} from "@material-ui/core";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//API handling components
import { API_URL } from "./../../global";
const axios = require("axios");

function SearchMeasurement(props) {
	const [show, setShow] = useState(false);
	const [orderId, setOrderId] = useState(0);
	const [loading, SetLoading] = useState(false);
	const handleModal = () => {
		setShow(!show);
	};
	const handleSearch = (e) => {
		e.preventDefault();
		SetLoading(true);
		let url = API_URL + "/executeQuery";
		const query1 = `SELECT shirtMeasurement.*,sO.customerName,sO.customerMobile,sO.customerAddress from shirtMeasurement inner join sewingOrders AS sO on sO.shirtMeasurementId=shirtMeasurement.shirtId where sO.orderId=${orderId};`;
		const query2 = `SELECT pantMeasurement.*,sO.customerName,sO.customerMobile,sO.customerAddress from pantMeasurement inner join sewingOrders AS sO on sO.pantMeasurementId=pantMeasurement.pantId where sO.orderId=${orderId};`;
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
				if (res.data.length) {
					console.log(res.data[0]);
					props.getShirtM(res.data[0]);
					toast.success("Shirt measurements found");
				} else {
					props.getShirtM({});
					toast.info(`Sorry shirt data not found for ${orderId}`);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.post(url, data[1])
			.then((res) => {
				if (res.data.length) {
					props.getPantM(res.data[0]);
					toast.success("Pant measurements found");
				} else {
					props.getPantM({});
					toast.info(`Sorry pant data not found for ${orderId}`);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		SetLoading(false);
	};
	return (
		<div>
			<Btn1
				variant="contained"
				color="primary"
				className="mr-2"
				onClick={handleModal}
			>
				Search Old Measurement
			</Btn1>
			<Modal
				show={show}
				onHide={handleModal}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Search by Order Id
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<FormGroup>
							<FormControl>
								<TextField
									id="height"
									label="Order ID"
									variant="outlined"
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
								/>
							</FormControl>
							<FormControl>
								<Button
									style={{ float: "right" }}
									type="submit"
									className="mt-2"
									onClick={handleSearch}
								>
									{loading ? (
										<Spinner animation="border" variant="light" size="sm" />
									) : (
										"Search"
									)}
								</Button>
							</FormControl>
						</FormGroup>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default SearchMeasurement;
