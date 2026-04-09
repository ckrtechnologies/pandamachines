/**
 * Returns a transformed Cloudinary image URL.
 * Safely skips non-Cloudinary URLs and already-transformed URLs.
 */

export const getCloudinaryImageUrl = (url, options = {}) => {
  try {
    if (!url || typeof url !== "string") return url;

    // Only process Cloudinary URLs
    if (!url.includes("/upload/") || !url.includes("cloudinary")) {
      return url;
    }

    // Prevent double transformation
    if (/\/upload\/.*(w_|q_|f_|c_|dpr_)/.test(url)) {
      return url;
    }

    const {
      width = 800,
      quality = "auto",
      format = "auto",
      crop = "limit",
      dpr = "auto",
    } = options;

    const transformation = [
      `f_${format}`,
      `q_${quality}`,
      `w_${width}`,
      `c_${crop}`,
      `dpr_${dpr}`,
    ].join(",");

    return url.replace("/upload/", `/upload/${transformation}/`);
  } catch {
    return url; // safe fallback
  }
};
