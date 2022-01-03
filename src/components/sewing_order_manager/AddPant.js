import React, { useState } from "react";
import { Button as Btn1, TextField } from "@material-ui/core";
import { Modal, Button } from "react-bootstrap";

function AddPant(props) {
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [seat, setSeat] = useState("");
  const [thigh, setThigh] = useState("");
  const [knee, setKnee] = useState("");
  const [bottom, setBottom] = useState("");
  const handleModal = () => {
    setShow(!show);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    var pant = {
      height: height,
      waist: waist,
      seat: seat,
      thigh: thigh,
      knee: knee,
      bottom: bottom,
    };
    props.getPantM(pant);
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
        पँटचे माप
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
            पँटची मापे
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
                id="waist"
                label="कंबर"
                variant="outlined"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <TextField
                id="seat"
                label="सीट"
                variant="outlined"
                className="mr-2"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
              />
              <TextField
                id="thigh"
                label="मांडी"
                variant="outlined"
                value={thigh}
                onChange={(e) => setThigh(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <TextField
                id="knee"
                label="गुडघा"
                variant="outlined"
                className="mr-2"
                value={knee}
                onChange={(e) => setKnee(e.target.value)}
              />
              <TextField
                id="bottom"
                label="बॉटम"
                variant="outlined"
                value={bottom}
                onChange={(e) => setBottom(e.target.value)}
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

export default AddPant;
