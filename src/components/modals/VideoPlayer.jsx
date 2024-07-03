import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function VideoPlayer({ open, videoUrl, onClose }) {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <div>
            <video width="400px" controls src={videoUrl}></video>
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button variant="contained" color="error" onClick={() => onClose()}>
              Close
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
