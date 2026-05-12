import React from "react";
import { FiVideoOff } from "react-icons/fi";

const VideoPlayer = ({ videoUrl, videoTitle = "Video" }) => {
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regExp);

    return match ? match[1] : null;
  };

  if (!videoUrl) {
    return (
      <div className="hidden sm:flex relative h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition-colors hover:border-gray-400 hover:bg-gray-100">

        {/* Video icon */}
        <FiVideoOff className="mb-2 text-2xl text-gray-400" />

        <p className="text-sm font-medium text-gray-700">
          No video available
        </p>

        <p className="mt-1 text-xs text-gray-500">
          No video to display right now.
        </p>
      </div>
    );
  }

  if (isYoutubeUrl(videoUrl)) {
    const youtubeId = extractYoutubeId(videoUrl);
    if (youtubeId) {
      return (
        <div className=" h-72 flex items-center justify-center relative rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?si=YaajTwkMA7Z0R68y`}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
  }

  return (
    <div className=" h-72 flex items-center justify-center relative rounded-lg overflow-hidden">
      <video
        width="100%"
        height="100%"
        controls
        className="w-full h-full object-contain"
        poster={undefined}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
