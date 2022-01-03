import React, { useState } from "react";
import { Button as Btn1, TextField } from "@material-ui/core";
import { Modal, Button } from "react-bootstrap";

function AddShirt(props) {
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [handGloves, setHandGloves] = useState("");
  const [neck, setNeck] = useState("");
  const [frontage, setFrontage] = useState("");
  const handleModal = () => {
    setShow(!show);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    var shirt = {
      height: height,
      chest: chest,
      shoulder: shoulder,
      handGloves: handGloves,
      neck: neck,
      frontage: frontage,
    };
    props.getShirtM(shirt);
    setShow(!show);
  };
  return (
    <div>
      <Btn1
        variant="contained"
        color="primary"
        className="mr-2"
        onClick={handleModal}
      >
        शर्टचे माप
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
            शर्टची मापे
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate autoComplete="off">
            <div className="mt-3">
              <TextField
                id="height"
                label="उंची"
                variant="outlined"
                className="mr-2"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <TextField
                id="chest"
                label="छाती"
                variant="outlined"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <TextField
                id="shoulder"
                label="शोल्डर"
                variant="outlined"
                className="mr-2"
                value={shoulder}
                onChange={(e) => setShoulder(e.target.value)}
              />
              <TextField
                id="Hand_gloves"
                label="बाही"
                variant="outlined"
                value={handGloves}
                onChange={(e) => setHandGloves(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <TextField
                id="neck"
                label="गळा"
                variant="outlined"
                className="mr-2"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
              />
              <TextField
                id="frontage"
                label="फ्रंट"
                variant="outlined"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <Button style={{ float: "right" }} onClick={handleSubmit}>
                Add
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddShirt;
