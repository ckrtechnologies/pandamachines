import React from "react";
import { PiVideoDuotone } from "react-icons/pi";

const VideoThumbnail = ({ videoUrl, isActive, onClick, title = "Video" }) => {
  // Check if it's a YouTube URL
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Extract YouTube ID
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!videoUrl) {
    return null;
  }

  // For YouTube videos - show embedded preview
  if (isYoutubeUrl(videoUrl)) {
    const youtubeId = extractYoutubeId(videoUrl);
    if (!youtubeId) return null;

    return (
      <div
        className={`w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer relative ${
          isActive ? "ring-2 ring-orange-500" : ""
        }`}
        onClick={onClick}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?si=YaajTwkMA7Z0R68y`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PiVideoDuotone className="w-6 h-6 text-white ml-1 drop-shadow-lg" />
        </div>
      </div>
    );
  }

  // For uploaded video files - show video with play button overlay
  return (
    <div
      className={`w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer relative overflow-hidden ${
        isActive ? "ring-2 ring-orange-500" : ""
      }`}
      onClick={onClick}
    >
      <video
        width="100%"
        height="100%"
        className="w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition">
        <PiVideoDuotone className="w-6 h-6 text-white drop-shadow-lg" />
      </div>
    </div>
  );
};

export default VideoThumbnail;
