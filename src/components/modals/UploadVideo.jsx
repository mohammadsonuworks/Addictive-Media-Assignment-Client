import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { UPLOAD_VIDEO_CONFIG, UPLOAD_VIDEO_ENDPOINT } from "../../config";
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

export default function UploadVideoModal({ open, onClose }) {
  const [formAlert, setFormAlert] = React.useState({
    isVisible: false,
  });
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [file, setFile] = React.useState(null);

  const upload_video = ({ file, title, description }) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    fetch(UPLOAD_VIDEO_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 1) {
          setFormAlert({
            isVisible: true,
            severity: "success",
            message: data.message,
          });
          setTimeout(() => {
            setFormAlert({
              isVisible: false,
            });
            onClose(data.data);
          }, 3000);
        } else {
          setFormAlert({
            isVisible: true,
            severity: "error",
            message: data.message,
          });
        }
      });
  };

  const handle_save = () => {
    if (!file) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: "Please select a file",
      });
      return;
    }
    const isFileTypeSupported =
      UPLOAD_VIDEO_CONFIG.ACCEPTED_FILE_TYPES.includes(file.type);
    if (!isFileTypeSupported) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `File type ${file.type} is not supported.`,
      });
      return;
    }
    const maximumAllowedFileSizeInBytes =
      UPLOAD_VIDEO_CONFIG.MAX_FILE_SIZE_IN_MB * 1024 * 1024;
    if (file.size > maximumAllowedFileSizeInBytes) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `File size is greater than allowed size.`,
      });
      return;
    }
    const titleWordsCount = count_num_of_words_in_text(title.trim());
    if (titleWordsCount === 0) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `Title can not be empty.`,
      });
      return;
    }
    if (titleWordsCount > UPLOAD_VIDEO_CONFIG.TITLE_MAX_WORDS) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `Title can not be more than ${UPLOAD_VIDEO_CONFIG.TITLE_MAX_WORDS} words.`,
      });
      return;
    }
    const descriptionWordsCount = count_num_of_words_in_text(
      description.trim()
    );
    if (descriptionWordsCount === 0) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `Description can not be empty.`,
      });
      return;
    }
    if (descriptionWordsCount > UPLOAD_VIDEO_CONFIG.DESCRIPTION_MAX_WORDS) {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: `Description can not be more than ${UPLOAD_VIDEO_CONFIG.DESCRIPTION_MAX_WORDS} words.`,
      });
      return;
    }
    setFormAlert({
      isVisible: true,
      severity: "success",
      message: "Valid inputs. Uploading video. Please wait ...",
    });
    upload_video({ file, title, description });
  };

  const alertElement = (
    <Alert style={{ marginTop: "1rem" }} severity={formAlert.severity}>
      {formAlert.message}
    </Alert>
  );
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <input
          type="file"
          accept={UPLOAD_VIDEO_CONFIG.ACCEPTED_FILE_TYPES.join(",")}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <TextField
          id="videoTitle"
          label="Title"
          variant="outlined"
          style={{ marginTop: "2rem", width: "100%" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="videoDescription"
          label="Description"
          multiline
          rows={4}
          style={{ marginTop: "2rem", width: "100%" }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Alert style={{ marginTop: "1rem" }} severity="info">
          Maximum File Size : {UPLOAD_VIDEO_CONFIG.MAX_FILE_SIZE_IN_MB} MB{" "}
          <br />
          Allowed File Types :{" "}
          {UPLOAD_VIDEO_CONFIG.ACCEPTED_FILE_TYPES.join(", ")}
          <br />
          Title maximum words : {UPLOAD_VIDEO_CONFIG.TITLE_MAX_WORDS}
          <br />
          Description maximum words :{" "}
          {UPLOAD_VIDEO_CONFIG.DESCRIPTION_MAX_WORDS}
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
          <Button variant="contained" color="success" onClick={handle_save}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
