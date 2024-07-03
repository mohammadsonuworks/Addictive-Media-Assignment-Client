import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { USER_METADATA_ENDPOINT, USER_VIDEOS_ENDPOINT } from "../config";
import AddBioModal from "./modals/AddBio";
import UploadVideoModal from "./modals/UploadVideo";
import VideoDisplay from "./VideoDisplay";

const Dashboard = () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }

  useEffect(() => {
    fetch(USER_METADATA_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const isReqSuccessful = data.code === 1;
        if (isReqSuccessful) {
          setUser(data.data);
        } else {
          setFormAlert({
            isVisible: true,
            message: data.message,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setIsPageSpinnerVisible(false);
      });
  }, []);

  useEffect(() => {
    fetch(USER_VIDEOS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const isReqSuccessful = data.code === 1;
        if (isReqSuccessful) {
          setUser((user) => {
            return {
              ...user,
              videos: data.data.videos,
            };
          });
        } else {
          setFormAlert({
            isVisible: true,
            message: data.message,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user videos:", error);
      })
      .finally(() => {
        setUserVideosLoading(false);
      });
  }, []);

  const [formAlert, setFormAlert] = React.useState({
    isVisible: false,
  });
  const [isPageSpinnerVisible, setIsPageSpinnerVisible] = useState(true);
  const [userVideosLoading, setUserVideosLoading] = useState(true);
  const [user, setUser] = useState({
    videos: [],
  });
  const [isAddBioModalOpen, setIsAddBioModalOpen] = useState(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);

  const handle_add_bio = () => {
    setIsAddBioModalOpen(true);
  };

  const handle_upload_video = () => {
    setIsUploadVideoModalOpen(true);
  };

  const handle_close_bio = (bio = "NA") => {
    if (bio !== "NA") {
      setUser((user) => {
        return {
          ...user,
          bio,
        };
      });
    }
    setIsAddBioModalOpen(false);
  };

  const handle_close_upload_video = (data = "NA") => {
    if (data !== "NA") {
      setUser((user) => {
        return {
          ...user,
          videos: user.videos ? [...user.videos, data] : [data],
        };
      });
    }
    setIsUploadVideoModalOpen(false);
  };

  const alertElement = (
    <Alert style={{ marginTop: "1rem" }} severity={formAlert.severity}>
      {formAlert.message}
    </Alert>
  );
  const videosSection = userVideosLoading ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : user.videos && user.videos.length > 0 ? (
    user.videos.map((video) => (
      <VideoDisplay
        key={video.videoUrl}
        title={video.title}
        description={video.description}
        videoUrl={video.videoUrl}
      />
    ))
  ) : (
    <p>No videos uploaded yet.</p>
  );

  const jsxCode = isPageSpinnerVisible ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload Data</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>First Name:</strong> {user.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
        {user.bio && (
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
        )}
      </div>
      {user.bio ? null : (
        <Button variant="contained" onClick={handle_add_bio}>
          Add Bio
        </Button>
      )}
      <br />
      <Button
        variant="contained"
        color="warning"
        style={{ marginTop: "1rem", marginBottom: "3rem" }}
        onClick={handle_upload_video}
      >
        Upload Video
      </Button>
      {videosSection}
    </div>
  );

  return (
    <>
      {<AddBioModal open={isAddBioModalOpen} onClose={handle_close_bio} />}
      {
        <UploadVideoModal
          open={isUploadVideoModalOpen}
          onClose={handle_close_upload_video}
        />
      }
      {formAlert.isVisible && alertElement}
      {jsxCode}
    </>
  );
};

export default Dashboard;
