import axios from "axios";

const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_NAME;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(UPLOAD_URL, formData);
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
};

export default uploadToCloudinary;
