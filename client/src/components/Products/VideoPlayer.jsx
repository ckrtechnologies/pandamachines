import React from "react";

const VideoPlayer = ({ videoUrl, videoTitle = "Video" }) => {
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!videoUrl) {
    return (
      <div className=" h-72 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No video available</p>
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
