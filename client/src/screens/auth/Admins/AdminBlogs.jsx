import React from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const AdminBlogs = () => {
  const dummyBlogDetails = [
    {
      img: "https://img.machinedesign.com/files/base/ebm/machinedesign/image/2019/05/machinedesign_com_sites_machinedesign.com_files_3._Cleaning_the_Machines.png?auto=format,compress&fit=max&q=45&w=640&width=640",
      heading: "Dummy 1",
    },
    {
      img: "https://www.industrybuying.com/wp-content/uploads/2024/09/Types-of-Drilling-Machines.jpg",
      heading: "Dummy 2",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Fotothek_df_ps_0000315_Montagehalle_einer_Maschinenfabrik.jpg/330px-Fotothek_df_ps_0000315_Montagehalle_einer_Maschinenfabrik.jpg",
      heading: "Dummy 3",
    },
    {
      img: "https://www.graphicpkg.com/custom-content/uploads/2023/08/Reciprocating-Pick-Place-Machines_Machine-Detail_Card_600x450.png",
      heading: "Dummy 4",
    },
    {
      img: "https://firstmold.com/wp-content/uploads/2024/08/Universal-Milling-Machines.webp",
      heading: "Dummy 5",
    },
    {
      img: "https://img.machinedesign.com/files/base/ebm/machinedesign/image/2019/05/machinedesign_com_sites_machinedesign.com_files_3._Cleaning_the_Machines.png?auto=format,compress&fit=max&q=45&w=640&width=640",
      heading: "Dummy 6",
    },
    {
      img: "https://www.industrybuying.com/wp-content/uploads/2024/09/Types-of-Drilling-Machines.jpg",
      heading: "Dummy 7",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Fotothek_df_ps_0000315_Montagehalle_einer_Maschinenfabrik.jpg/330px-Fotothek_df_ps_0000315_Montagehalle_einer_Maschinenfabrik.jpg",
      heading: "Dummy 8",
    },
    {
      img: "https://www.graphicpkg.com/custom-content/uploads/2023/08/Reciprocating-Pick-Place-Machines_Machine-Detail_Card_600x450.png",
      heading: "Dummy 9",
    },
    {
      img: "https://firstmold.com/wp-content/uploads/2024/08/Universal-Milling-Machines.webp",
      heading: "Dummy 10",
    },
  ];

  const dummyHeading =
    "Water Purification RO Plant, the best seller of the decade";

  const visibleHeading = dummyHeading.slice(0, 32) + "...";
  const hiddenHeading = dummyHeading.slice(32).trim();

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
          <button className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap">
            <FiPlus className="mr-2" />
            Add Blog
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {dummyBlogDetails.map((data, index) => (
          <div
            className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:duration-300"
            key={index}
          >
            <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-transform">
              <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <FiEdit className="text-blue-600" />
              </button>
              <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <FiTrash2 className="text-red-600" />
              </button>
            </div>
            <div>
              <img
                src={data.img}
                alt={data.heading}
                className="h-[200px] w-[300px] "
              />
            </div>
            <div>
              <h1 className="font-semibold px-2 pt-4">{visibleHeading}</h1>
            </div>
            <div>
              <p className="pl-2 text-gray-500">
                This space is for description. We can know betterly this blog
                through read more button.
              </p>
            </div>
            <button className="flex justify-center items-center text-orange-500 font-semibold px-2 pb-4">
              Read More <MdOutlineArrowRightAlt size={30} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
