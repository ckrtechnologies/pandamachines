import React, { useState } from "react";
import { FaBox, FaTh, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const GuidanceRegistrationForm = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(60000);
  const [discussionTime, setDiscussionTime] = useState("30");

  return (
    <div className="px-4 py-6 xl:px-6 bg-[#fff8f4]">
      <div className="p-10 bg-white shadow-lg rounded-md">
        <div className="bg-blue-100 text-center py-3 rounded mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900">
            REGISTER HERE & GET A CALL BACK FROM US !
          </h2>
        </div>

        <form
          onSubmit={() => navigate("/guidance-booking-confirm")}
          className="space-y-6"
        >
          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              In which type of plant do you want to register ?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaTh size={18} className="text-gray-500 mr-2" />
                  <select className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none">
                    <option value="">Select Category</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaBox size={18} className="text-gray-500 mr-2" />
                  <select className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none">
                    <option value="">Select Sub Category</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <AiFillProduct size={24} className="text-gray-500 mr-2" />
                  <select className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none">
                    <option value="">Select Product</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              How Much do you want to Invest ?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10000"
                max="100000"
                step="1000"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full"
              />
              <span className="text-white bg-[#00395F] px-3 py-1 rounded">
                {investment / 1000}k
              </span>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Your Information Please ?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaUser size={16} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Full Name here"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <IoMdCall size={20} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Mob Number"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <MdEmail size={20} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    placeholder="E-mail Id"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Discussion Time
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "30"}
                  onChange={() => setDiscussionTime("30")}
                />
                <span>
                  30 mins <br /> <span className="text-[#1B6392]">₹ 2,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "60"}
                  onChange={() => setDiscussionTime("60")}
                />
                <span>
                  60 mins <br /> <span className="text-[#1B6392]">₹ 5,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "full"}
                  onChange={() => setDiscussionTime("full")}
                />
                <span>
                  Full Day <br />{" "}
                  <span className="text-[#1B6392]">₹ 10,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "project"}
                  onChange={() => setDiscussionTime("project")}
                />
                <span>
                  Until Project Completion <br />{" "}
                  <span className="text-[#1B6392]">₹ 20,000</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Select Time Slot
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                className="border border-gray-400 rounded-md w-full p-2"
              />
              <input
                type="time"
                className="border border-gray-400 rounded-md w-full p-2"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded tracking-wide"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuidanceRegistrationForm;
