import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { ADD_BIO_CONFIG, ADD_BIO_ENDPOINT } from "../../config";
import { count_num_of_words_in_text } from "../../utils";

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

export default function AddBioModal({ open, onClose }) {
  const [bioText, setBioText] = React.useState("");
  const [formAlert, setFormAlert] = React.useState({
    isVisible: false,
  });
  const alertElement = (
    <Alert style={{ marginTop: "1rem" }} severity={formAlert.severity}>
      {formAlert.message}
    </Alert>
  );
  const add_bio = (bio) => {
    fetch(ADD_BIO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        bio,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const isReqSuccessful = data.code === 1;
        if (isReqSuccessful === false) {
          setFormAlert({
            isVisible: true,
            severity: "error",
            message: data.message,
          });
        } else {
          setFormAlert({
            isVisible: true,
            severity: "success",
            message: data.message,
          });
          setTimeout(() => {
            onClose(bio);
          }, 3000);
        }
      });
  };
  const handle_save_bio = (bio) => {
    const numOfWordsInBio = count_num_of_words_in_text(bio);
    const isBioLengthValid =
      numOfWordsInBio >= ADD_BIO_CONFIG.MINIMUM_WORDS_COUNT &&
      numOfWordsInBio <= ADD_BIO_CONFIG.MAXIMUM_WORDS_COUNT;
    if (isBioLengthValid) {
      setFormAlert({
        isVisible: true,
        severity: "success",
        message: "Please wait. Saving bio ...",
      });
      add_bio(bio);
    } else {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `Bio should be between ${ADD_BIO_CONFIG.MINIMUM_WORDS_COUNT} and ${ADD_BIO_CONFIG.MAXIMUM_WORDS_COUNT} words`,
      });
    }
  };
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextField
          id="outlined-multiline-static"
          label="Add Bio"
          multiline
          rows={4}
          defaultValue=""
          style={{ width: "100%" }}
          onChange={(e) => setBioText(e.target.value)}
        />
        <Alert style={{ marginTop: "1rem" }} severity="info">
          Minimum words : {ADD_BIO_CONFIG.MINIMUM_WORDS_COUNT}, Maximum words :{" "}
          {ADD_BIO_CONFIG.MAXIMUM_WORDS_COUNT}
        </Alert>
        {formAlert.isVisible && alertElement}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "end",
            gap: "0.5rem",
          }}
        >
          <Button variant="contained" color="error" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handle_save_bio(bioText.trim())}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
