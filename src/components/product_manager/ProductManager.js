import React, { Component } from "react";
import "./style.css";
import { Button, TextField, Paper } from "@material-ui/core";
import { Badge, Card, Modal, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenAlt } from "@fortawesome/free-solid-svg-icons";

//API handling components
import { API_URL } from "../../global";

// datatable setup
import jsZip from "jszip";
window.JSZip = jsZip;
var $ = require("jquery");
$.DataTable = require("datatables.net");
require("datatables.net-bs4");
require("datatables.net-autofill-bs4");
require("datatables.net-buttons-bs4");
require("datatables.net-buttons/js/buttons.colVis");
require("datatables.net-buttons/js/buttons.flash");
require("datatables.net-buttons/js/buttons.html5");
require("datatables.net-buttons/js/buttons.print");
require("datatables.net-responsive-bs4");
require("datatables.net-scroller-bs4");
require("datatables.net-select-bs4");
require("pdfmake");

const axios = require("axios");

export default class ProductManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showUpdateModel: false,
            name: "",
            date: moment(new Date()).format("YYYY-MM-DD"),
            quantity: 0,
            price: 0,
            position: "",
            productData: {},
            activeProductId: null,
            activeStock: null,
            description:"",
            isLoadingProductData: false,
            
        };
    }
    getproductData() {
        let url = API_URL;
        const query = `SELECT *  from products WHERE status = 1;`;
        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        this.setState({ isLoadingProductData: true });
        axios
            .post(url, data)
            .then((res) => {
                console.log("product data: ", res.data);
                this.setState({ productData: res.data, isLoadingProductData: false  });
                
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoadingProductData: false });
            });
    }

    handleAddSubmit = () => {
        let url = API_URL;
        const query = `INSERT INTO products(name,description, quantity, price, position) VALUES('${this.state.name}','${this.state.description}', ${this.state.quantity}, ${this.state.price}, '${this.state.position}')`;
        console.log(query)
        let data = {
            crossDomain: true,
            crossOrigin: true,
            query: query,
        };
        axios
            .post(url, data)
            .then((res) => {
                console.log("product inserted successfully");
                toast.success("Product inserted successfully");
                setTimeout(() => {
                    {
                        this.refreshProducts();
                    }
                }, 2000);
            })
            .catch((err) => {
                console.log("error while inserting new product", err);
            });
    };

    handleUpdateSubmit() {
        let url = API_URL;
        const query = `UPDATE products  SET quantity = ${this.state.activeStock}  , name = '${this.state.name}', description = '${this.state.description}' , price = ${this.state.unitPrice} , position = '${this.state.position}'  WHERE id=${this.state.activeProductId};`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("update status data: ", res.data);
                console.log("Stock updated successfully");
                toast.success("Stock updated successfully");
                setTimeout(() => {
                    {
                        this.refreshProducts();
                    }
                }, 2000);
            })
            .catch((err) => {
                console.log("stock update error: ", err);
            });
    }

    deleteRecord(id) {
        let url = API_URL;
        const query = `UPDATE products SET status = 0  WHERE id=${id};`;
        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log("deleted status data: ", res.data);
                console.log("Product deleted successfully");
                toast.error("Product deleted successfully");
                setTimeout(() => {
                    {
                        this.refreshProducts();
                    }
                }, 2000);
            })
            .catch((err) => {
                console.log("record delete error: ", err);
            });
    }

    refreshProducts() {
        window.location.reload(false);
    }

    componentDidMount() {
        this.getproductData();
    }

    componentDidUpdate() {
        const title = "Worker data -" + moment().format("DD-MMMM-YYYY");
        $("#product_table").DataTable({
          destroy: true,
          keys: true,
          dom:
            "<'row mb-2'<'col-sm-9' B><'col-sm-3' >>" +
            "<'row mb-2'<'col-sm-9' l><'col-sm-3' f>>" +
            "<'row'<'col-sm-12' tr>>" +
            "<'row'<'col-sm-7 mt-2 mr-5 pr-4'i><'ml-5' p>>",
          buttons: [
            // "copy",
            "csv",
            // "excelBootstrap4",
            {
              extend: "print",
              title,
              messageTop: `<h4 style='text-align:center'>${title}</h4>`,
              download: "open",
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
              },
            },
          ],
        });
      }

    renderUpdateProductModal() {
        return (
            <Modal
                show={this.state.showUpdateModal}
                onHide={(e) => this.setState({ showUpdateModal: false })}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Product stock
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate autoComplete="off">
                        <div className="mt-3">
                            <Row>
                                <Col size="12">
                                    <TextField
                                        id="updateName"
                                        label="Product Name"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={this.state.name}
                                        onChange={(e) => {
                                            this.setState({
                                                name: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                                <Col size="12">
                                    <TextField
                                        id="updateStock"
                                        label="Quantity"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={this.state.activeStock}
                                        onChange={(e) => {
                                            this.setState({
                                                activeStock: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col size="12">
                                    <TextField
                                        id="updateUnitPrice"
                                        label="Unit Price"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={this.state.unitPrice}
                                        onChange={(e) => {
                                            this.setState({
                                                unitPrice: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                                <Col size="12">
                                    <TextField
                                        id="updatePosition"
                                        label="Position"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={this.state.position}
                                        onChange={(e) => {
                                            this.setState({
                                                position: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                            <Col size="12">
                                    <TextField
                                        id="updateDescription"
                                        label="description"
                                        variant="outlined"
                                        className="m-2"
                                        defaultValue={this.state.description}
                                        onChange={(e) => {
                                            this.setState({
                                                description: e.target.value,
                                            });
                                        }}
                                    />
                                </Col>
                                <Col >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="m-2"
                                        style={{ float: "left" }}
                                        onClick={(e) => {
                                            this.setState({
                                                showUpdateModal: false,
                                            });
                                            this.handleUpdateSubmit();
                                        }}
                                    >
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }

    render() {
        return (
            <div
                className="container-fluid border m-0 p-1 main"
                style={{ backgroundColor: "aliceblue" }}
            >
                <Card>
                    <Card.Body className="mt-0 pt-3">
                        <div>
                            <div className="mt-3">
                                <TextField
                                    id="productCode"
                                    label="Product Code"
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    value={this.state.name}
                                    className="mr-3"
                                    onChange={(e) =>
                                        this.setState({
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="productName"
                                    label="Product Name"
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    value={this.state.description}
                                    className="mr-3"
                                    onChange={(e) =>
                                        this.setState({
                                            description: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="quantity"
                                    label="quantity"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    style={{maxWidth:100}}
                                    value={this.state.quantity}
                                    className="mr-3"
                                    onChange={(e) =>
                                        this.setState({
                                            quantity: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="price"
                                    label="price"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    value={this.state.price}
                                    className="mr-3"
                                    onChange={(e) =>
                                        this.setState({
                                            price: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="position"
                                    label="Position"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.position}
                                    className="mr-3"
                                    onChange={(e) =>
                                        this.setState({
                                            position: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleAddSubmit}
                                >
                                    Add product
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <div
                    component={Paper}
                    style={{ maxHeight: "74vh" }}
                    className="mt-2"
                >
                    {!this.state.isLoadingProductData && (
                    <table id="product_table" className="p-0 m-0 measure1" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th align="center">UID</th>
                                <th>Product Code</th>
                                <th>Product Name/ Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Position</th>
                                <th>Last Modified</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody colspan="2">
                            {this.state.productData.length > 0 ? (
                                this.state.productData.map((product) => {
                                    let color = product.stock < 5 ? 'red' : (product.stock > 5 ? 'black' : 'black');
                                    return (
                                        <tr key={product.id} getProductData={this.getProductData}>
                                            <td align="center">
                                                <Badge variant="primary">
                                                    {" "}
                                                    {product.id}
                                                </Badge>
                                            </td>
                                            <td
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {product.name}
                                            </td>
                                            <td>{product.description == null ? "N/A" : product.description}</td>
                                            <td style={{color: color}}>{product.quantity}</td>
                                            <td>₹ {product.price}</td>
                                            <td>{product.position}</td>
                                            
                                            <td>
                                                {moment(
                                                    product.lastModified
                                                ).format(
                                                    "DD / MM / YYYY hh:mm"
                                                )}
                                            </td>
                                            <td align="center">
                                                <Button
                                                    color="secondary"
                                                    variant="contained"
                                                    className="my-1 mr-1"
                                                    onClick={(e) => {
                                                        this.setState({
                                                            activeProductId:
                                                                product.id,
                                                            activeStock:
                                                                product.quantity,
                                                            name: product.name,
                                                            unitPrice: product.price,
                                                            position: product.position,   
                                                            description: product.description, 
                                                            showUpdateModal: true,
                                                        });
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPenAlt}
                                                    />
                                                </Button>
                                                {this.renderUpdateProductModal()}

                                                <Button
                                                    variant="contained"
                                                    className="my-1"
                                                    onClick={(e) => {
                                                        if (
                                                            window.confirm(
                                                                "Delete the item?"
                                                            )
                                                        ) {
                                                            this.deleteRecord(
                                                                product.id
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td>No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                     )}
                </div>
                <ToastContainer
                    position={toast.POSITION.TOP_RIGHT}
                    autoClose={3000}
                />
            </div>
        );
    }
}
