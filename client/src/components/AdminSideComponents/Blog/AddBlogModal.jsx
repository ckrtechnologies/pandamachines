import React, { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4 px-6 pt-2">
    <label className="block text-sm font-medium tracking-wide text-primaryColor">
      {label}
    </label>
    <input
      className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const AddBlogModal = ({ isOpen, setIsAddModalOpen, refetchBlogs }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
  });

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formData
      );
      setBlogData({ ...blogData, image: response.data.secure_url });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageUploading(false);
  };

  const handleSaveBlog = async () => {
    if (!blogData.title.trim()) {
      alert("Please enter a blog title");
      return;
    }
    if (!blogData.content.trim()) {
      alert("Please enter blog content");
      return;
    }
    if (!blogData.author.trim()) {
      alert("Please enter the author name");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/blog/create-blog`,
        blogData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      refetchBlogs();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold tracking-normal text-primaryColor">
            Add Blog
          </h2>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>
        <hr className="border-t-1 my-2 border-gray-300" />

        <InputField
          label="Blog Title"
          value={blogData.title}
          onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
          placeholder="Enter blog title"
        />

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryColor">
            Blog Content
          </label>
          <textarea
            className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={blogData.content}
            onChange={(e) =>
              setBlogData({ ...blogData, content: e.target.value })
            }
            placeholder="Enter blog content"
            rows={4}
          />
        </div>

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryColor">
            Author
          </label>
          <input
            className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            type="text"
            value={blogData.author}
            onChange={(e) =>
              setBlogData({ ...blogData, author: e.target.value })
            }
            placeholder="Enter author name"
          />
        </div>

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryColor">
            Upload Image
          </label>
          <input
            className="mt-2 w-full rounded border p-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageUploading && (
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          )}
          {blogData.image && (
            <img
              src={blogData.image}
              alt="Uploaded"
              className="mt-2 h-20 w-full rounded object-contain"
            />
          )}
        </div>

        <hr className="border-t-1 my-4 border-gray-300" />
        <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
            onClick={() => setIsAddModalOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="rounded bg-primaryBtnColor px-4 text-white duration-150 hover:bg-primaryBtnHoverColor"
            onClick={handleSaveBlog}
            disabled={
              isLoading ||
              !blogData.title.trim() ||
              !blogData.content.trim() ||
              !blogData.author.trim()
            }
          >
            {isLoading ? <ModalButtonLoader /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBlogModal;
