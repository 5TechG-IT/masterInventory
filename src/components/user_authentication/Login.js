import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import LinearProgress from "@material-ui/core/LinearProgress";
import "react-toastify/dist/ReactToastify.css";

import "./assets/Login.css";
//API handling components
import { API_URL } from "./../../global";

const axios = require("axios");

const data = { userName: "admin", password: "admin" };

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsLoading(true);
    // let url = API_URL + "/executeQuery";
    // //production
    // const query = `SELECT * from users where name like '${userName}' AND password like '${password}';`;
    // //dev
    // //const query = `SELECT * from users where name like 'admin' AND password like 'admin@123';`;
    // let data = {
    //   crossDomain: true,
    //   crossOrigin: true,
    //   query: query,
    // };
    // axios
    //   .post(url, data)
    //   .then((res) => {
    //     if (res.data.length > 0) {
    //       setIsAuthenticated(true);
    //     } else {
    //       setIsLoading(false);
    //       toast("Incorrect username and password");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("HTTP request error: ", err);
    //   });

    if (userName === data.userName) {
      if (password === data.password) {
        // setIsAuthenticated(true);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            isAuthenticated: true,
            userName,
            password,
          })
        );
        history.push("/dashboard");
      }
    }
  };
  // const redirect = () => {
  //   // if (isAuthenticated) {
  //   console.log(localStorage.getItem("isAuthenticated"));
  //   if (localStorage.getItem("isAuthenticated")) {
  //     return (
  //       <Redirect
  //         to={{
  //           pathname: "/",
  //           state: {
  //             userName: userName,
  //             password: password,
  //           },
  //         }}
  //       />
  //     );
  //   }
  // };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log({ auth });
    if (auth?.isAuthenticated) {
      history.push("/dashhboard");
    }
  });

  return (
    <div className="wrapper">
      {/* {redirect()} */}
      {/* <h3 className="heading pb-4">गुरुप्रसाद कलेक्शन</h3> */}
      <h3 className="heading pb-4">LIBERTY LIGHT HOUSE</h3>
      <Card
        className="pt-5 pb-5 pl-3 pr-3 w-25 login-temp"
        style={{ boxShadow: "0px 0px 30px 0px rgba(30, 23, 16, 0.2)" }}
      >
        <div className="text-center mb-3">
          <FontAwesomeIcon
            size="3x"
            className="mb-2"
            icon={faUser}
          ></FontAwesomeIcon>
          <h5 className="sub-head">Admin Login</h5>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username here"
              //   ToDo: remove default value before production
              //defaultValue="admin"
              onChange={(e) => setUserName(e.target.value)}
              style={{ fontSize: "15px" }}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              //   ToDo: remove default value before production
              //defaultValue="admin@123"
              placeholder="Enter your password here"
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: "15px" }}
              required
            />
          </Form.Group>
          <Button variant="primary btn-block" type="submit">
            Log In
          </Button>
        </Form>
        {isLoading ? <LinearProgress color="secondary" /> : null}
      </Card>
      <p className="mt-2" style={{ color: "#fff" }}>
        Powered by 5TechG
      </p>
      <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
    </div>
  );
}

export default Login;
