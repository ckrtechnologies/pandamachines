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
      <div className="relative h-72 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-100">
      {/* Video icon */}
      <svg
        className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    
      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
        No video available
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        There is no video to display at this moment.
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
