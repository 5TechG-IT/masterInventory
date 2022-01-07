import React, { Component } from "react";
import moment, { months } from "moment";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import "./style.css";

import { API_URL } from "../../global";
import { Col, Modal, Row } from "react-bootstrap";
const axios = require("axios");

class MonthlyCalander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workerId: props.workerId,
      month: props.month,

      presentyData: null,
      dateGrid: null,
      showNewModel: false,
      newStatus: "",
      newReason: "",
      newDay: null,

      showUpdateModel: false,
      activeRecordId: null,
      activeStatus: "",
      activeReason: "",
      activeDay: null,
    };
  }

  fetchPresentyData = () => {
    // if worker id is null
    if (!this.state.workerId) return null;
    console.log("month: ", this.state.month);
    let url = API_URL;
    const query = `SELECT *,DAY(date) as day, MONTH(date) as month FROM presenty WHERE workerId=${
      this.state.workerId
    } HAVING month=${this.state.month + 1} ;`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        console.log("presenty data: ", res.data);
        let presentyDataObj = {};
        res.data.forEach((record) => {
          presentyDataObj[record.day] = record;
        });

        console.log("presenty data obj: ", presentyDataObj);
        this.setState({ presentyData: presentyDataObj });
      })
      .catch((err) => {
        console.log("presenty data fetch error: ", err);
      });
  };

  componentDidMount() {
    this.fetchPresentyData();
    const totalDays = [0, 2, 4, 6, 7, 9, 11].includes(this.props.month)
      ? 31
      : [3, 5, 8, 10].includes(this.props.month)
      ? 30
      : 28;

    let grid = Array.from({ length: 42 }, (x) => 0);
    let firstDate = new Date();
    firstDate.setDate(1);
    let firstDay = firstDate.getDay();

    for (let i = firstDay, day = 1; day < totalDays; i++) {
      grid[i] = day++;
    }

    this.setState({
      dateGrid: grid,
    });
  }

  handleAddPresenty(e) {
    e.preventDefault();
    let url = API_URL;
    let date = new Date();
    date.setDate(this.state.newDay);
    const query = `INSERT INTO presenty(status, reason, workerId, date) values(${
      this.state.newStatus
    }, "${this.state.newReason}", ${this.state.workerId}, "${moment(
      date
    ).format("YYYY-MM-DD")}");`;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        console.log("presenty added response: ", res.data);
        this.fetchPresentyData();
        this.setState({ showNewModel: false });
      })
      .catch((err) => {
        console.log("presenty adding error: ", err);
      });
  }

  handleUpdatePresenty(e) {
    if (!this.state.activeRecordId) return;
    e.preventDefault();
    let url = API_URL;
    let date = new Date();
    date.setDate(this.state.newDay);
    const query = `UPDATE presenty set status=${this.state.activeStatus}, reason="${this.state.activeReason}" where id=${this.state.activeRecordId} `;
    let data = { crossDomain: true, crossOrigin: true, query: query };
    axios
      .post(url, data)
      .then((res) => {
        console.log("presenty updated response: ", res.data);
        this.fetchPresentyData();
        this.setState({ showUpdateModel: false });
        window.location.reload();
      })
      .catch((err) => {
        console.log("presenty updating error: ", err);
      });
  }

  renderNewModal() {
    return (
      <Modal
        show={this.state.showNewModel}
        onHide={(e) => this.setState({ showNewModel: false })}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => this.handleAddPresenty(e)}
          >
            <div className="mt-3 mb-3">
              <Row>
                <Col>
                  <FormControl
                    // variant="filled"
                    variant="outlined"
                    className="mb-3"
                    style={{ minWidth: "180px" }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) =>
                        this.setState({ newStatus: e.target.value })
                      }
                      name="newStatus"
                      value={this.state.newStatus}
                      size="small"
                      label="Status"
                    >
                      <MenuItem value={1}>Present</MenuItem>
                      <MenuItem value={2}>Absent</MenuItem>
                      <MenuItem value={3}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    id="newReason"
                    label="Reason"
                    variant="outlined"
                    size="small"
                    value={this.state.newReason}
                    className="mb-3"
                    style={{ minWidth: "30vw" }}
                    onChange={(e) =>
                      this.setState({ newReason: e.target.value })
                    }
                    fullWidth
                  />
                </Col>
              </Row>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ float: "right" }}
              >
                Add presenty
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }

  renderUpdateModal() {
    return (
      <Modal
        show={this.state.showUpdateModel}
        onHide={(e) => this.setState({ showUpdateModel: false })}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => this.handleUpdatePresenty(e)}
          >
            <div className="mt-3 mb-3">
              <Row>
                <Col>
                  <FormControl
                    // variant="filled"
                    variant="outlined"
                    className="mb-3"
                    style={{ minWidth: "180px" }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) =>
                        this.setState({ activeStatus: e.target.value })
                      }
                      name="newStatus"
                      value={this.state.activeStatus}
                      size="small"
                      label="Status"
                    >
                      <MenuItem value={1}>Present</MenuItem>
                      <MenuItem value={2}>Absent</MenuItem>
                      <MenuItem value={3}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    id="newReason"
                    label="Reason"
                    variant="outlined"
                    size="small"
                    value={this.state.activeReason}
                    className="mb-3"
                    style={{ minWidth: "30vw" }}
                    onChange={(e) =>
                      this.setState({ activeReason: e.target.value })
                    }
                  />
                </Col>
              </Row>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ float: "right" }}
              >
                Update presenty
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    return (
      <Box className="monthly-calender-root" p={2}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box pb={1} textAlign="center" borderBottom={1}>
            <b>{day}</b>
          </Box>
        ))}
        {this.state.presentyData &&
          this.state.dateGrid.map((day) => {
            if (day > 0) {
              return (
                <Card key={day}>
                  {this.state.presentyData[day] ? (
                    <Box
                      className="monthly-calender-day"
                      bgcolor={
                        this.state.presentyData[day].status == 1
                          ? "lightgreen"
                          : this.state.presentyData[day]?.status == 2
                          ? "tomato"
                          : "orange"
                      }
                      onClick={() => {
                        this.setState({
                          showUpdateModel: true,
                          activeRecordId: this.state.presentyData[day]?.id,
                          activeStatus: this.state.presentyData[day]?.status,
                          activeReason: this.state.presentyData[day]?.reason,
                        });
                      }}
                      border={day == new Date().getDate() ? 2 : ""}
                      borderColor="primary"
                    >
                      {day}
                    </Box>
                  ) : (
                    <Box
                      className="monthly-calender-day"
                      color="gray"
                      bgcolor="whitesmoke"
                      onClick={() => {
                        this.setState({
                          showNewModel: true,
                          newDay: day,
                        });
                      }}
                      border={day == new Date().getDate() ? 2 : ""}
                      // borderColor=""
                    >
                      {day}
                    </Box>
                  )}
                </Card>
              );
            } else {
              return <Box />;
            }
          })}
        {this.renderNewModal()}
        {this.renderUpdateModal()}
      </Box>
    );
  }
}

export default MonthlyCalander;
