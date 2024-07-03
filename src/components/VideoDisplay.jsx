import Button from "@mui/material/Button";
import VideoPlayer from "./modals/VideoPlayer";
import { useState } from "react";

const VideoDisplay = ({ videoUrl, title, description }) => {
  const [videoPlayer, setVideoPlayer] = useState({
    isVisible: false,
  });
  const open_video_player = (videoUrl) => {
    setVideoPlayer({
      isVisible: true,
      videoUrl,
    });
  };
  const close_video_player = () => {
    setVideoPlayer({
      isVisible: false,
    });
  };
  const videoPlayerPopup = (
    <VideoPlayer
      open={videoPlayer.isVisible}
      videoUrl={videoPlayer.videoUrl}
      onClose={close_video_player}
    />
  );
  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        gap: "2rem",
        backgroundColor: "lightgray",
        padding: "12px",
        alignContent: "center",
      }}
    >
      <video style={{ width: "200px" }}>
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Button
          variant="contained"
          color="success"
          onClick={() => open_video_player(videoUrl)}
        >
          Play Video
        </Button>
      </div>
      {videoPlayer.isVisible && videoPlayerPopup}
    </div>
  );
};

export default VideoDisplay;
