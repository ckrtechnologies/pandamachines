import React from "react";
import { LuPhone } from "react-icons/lu";
import "./TopNavbar.css";
import langImg from "../../Assets/img/common/languageWhite.png";

const TopNavbar = () => {
  return (
    <div className="hidden md:block w-full z-50 text-white shadow-md animated-gradient">
      <div className="flex items-center justify-between px-4 lg:px-6 py-1 text-[11px] sm:text-xs">

        {/* Left text */}
        <div className="hidden lg:block font-normal tracking-wide whitespace-nowrap">
          ❤️ Welcome to Panda Machines. We provide the Best Machinery Items.
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Phone */}
          <div className="flex items-center gap-2 tracking-wide whitespace-nowrap">
            <LuPhone className="h-3.5 w-3.5" />
            <span className="font-semibold">Support</span>
            <span>+91 8071793049</span>,
            <span>+91 8071793049</span>
          </div>

          {/* Language Icon */}
          <div className="cursor-pointer flex items-center">
            <img
              src={langImg}
              alt="Language"
              className="h-5 w-auto"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
// import React from "react";
// import { LuPhone } from "react-icons/lu";
// import "./TopNavbar.css";
// import langImg from "../../Assets/img/common/languageWhite.png";

// const TopNavbar = () => {
//   return (
//     <div className="hidden lg:block w-full z-50 text-white shadow-md animated-gradient">
//       <div className="flex flex-col xl:flex-row items-center justify-between px-4 xl:px-6 py-1.5 gap-2 xl:gap-0 text-xs">
//         {/* Left text */}
//         <div className="md:block hidden text-center xl:text-left font-normal tracking-wider px-2">
//           ❤️ Welcome to Panda Machines. We provide the Best Machinery Items.
//         </div>

//         {/* Social + phone + language */}
//         <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2 text-white">
//           {/* Phone */}
//           <div className="flex flex-wrap justify-center sm:justify-end gap-2 items-center text-xs sm:text-sm tracking-wider font-normal">
//             <LuPhone className="h-4 w-4" />
//             <span className="text-sm font-semibold">Support</span>
//             <span>+91 8071793049</span>,&nbsp;
//             <span>+91 8071793049</span>
//           </div>

//           {/* Language Icon */}
//           <div className="cursor-pointer">
//             <img
//               src={langImg}
//               alt="Language"
//               className="h-6 w-auto cursor-pointer"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNavbar;
