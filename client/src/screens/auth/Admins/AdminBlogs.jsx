import React from "react";
import { FiPlus, FiEdit, FiTrash2, FiInbox } from "react-icons/fi";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddBlogModal from "../../../components/AdminSideComponents/Blog/AddBlogModal";
import EditBlogModal from "../../../components/AdminSideComponents/Blog/EditBlogModal";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";

const AdminBlogs = () => {
  const [dummyBlogDetails, SetDummyBlogDetails] = useState([]);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [isDeleteBlogModalOpen, setIsDeleteBlogModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [dltLoading, setDltLoading] = useState(false);
  const navigate = useNavigate();

  const allBlogs = () => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/blog/get-all-blog`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        SetDummyBlogDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    allBlogs();
  }, []);

  const handleDelete = () => {
    setDltLoading(true);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/blog/delete-blog/${blogToDelete._id}`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        allBlogs();
        setIsDeleteBlogModalOpen(false);
        setDltLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setDltLoading(false);
      });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Blogs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your blogs</p>
        </div>
        <div>
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => setIsAddBlogModalOpen(true)}
          >
            <FiPlus className="mr-2" />
            Add Blog
          </button>
        </div>
      </div>
      {loading ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-[200px] bg-gray-300 w-full"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full m-4"></div>
                </div>
              ))}
          </div>
        </div>
      ) : dummyBlogDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FiInbox className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No blogs found
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            It looks like you haven’t added any blogs yet. Click the button
            above to create first blog post!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {dummyBlogDetails.map((data, index) => (
            <div
              className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:duration-300"
              key={index}
            >
              <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-transform">
                <button
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => {
                    setSelectedBlogId(data._id);
                    setIsEditBlogModalOpen(true);
                  }}
                >
                  <FiEdit className="text-blue-600" />
                </button>

                <button
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => {
                    setBlogToDelete(data);
                    setIsDeleteBlogModalOpen(true);
                  }}
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
              <div>
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-[200px] w-[300px] "
                />
              </div>
              <div>
                <h1 className="font-semibold px-2 pt-4">
                  {data.title.split(" ").slice(0, 10).join(" ") +
                    (data.title.split(" ").length > 10 ? "..." : "")}
                </h1>
              </div>

              <div>
                <p className="text-gray-500">
                  <h1 className="font-semibold px-2 pt-2">
                    {data.content.split(" ").slice(0, 25).join(" ") +
                      (data.content.split(" ").length > 25 ? "..." : "")}
                  </h1>
                </p>
              </div>
              <button
                className="flex justify-center items-center text-orange-500 font-semibold px-2 pb-4"
                onClick={() => {
                  navigate(`/admin-blog-details/${data._id}`);
                }}
              >
                Read More <MdOutlineArrowRightAlt size={30} />
              </button>
            </div>
          ))}
        </div>
      )}
      <AddBlogModal
        isOpen={isAddBlogModalOpen}
        setIsAddModalOpen={setIsAddBlogModalOpen}
        refetchBlogs={allBlogs}
      />
      <EditBlogModal
        isOpen={isEditBlogModalOpen}
        setIsEditModalOpen={setIsEditBlogModalOpen}
        blogId={selectedBlogId}
        refetchBlogs={allBlogs}
      />
      <DeleteAlertModal
        isOpen={isDeleteBlogModalOpen}
        onClose={() => setIsDeleteBlogModalOpen(false)}
        dltType="blog"
        dltName={blogToDelete?.title}
        onConfirm={handleDelete}
        dltLoading={dltLoading}
      />
    </div>
  );
};

export default AdminBlogs;
