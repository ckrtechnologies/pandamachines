// import React, { useState, useEffect, useRef } from "react";
// import {
//   Package,
//   Image,
//   Video,
//   FileText,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   Grid3X3,
//   ChevronDown,
//   X,
// } from "lucide-react";
// import { MdSubject } from "react-icons/md";
// import { FiChevronDown } from "react-icons/fi";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Quotation = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobNumber: "",
//     email: "",
//     address: "",
//     subject: "",
//     category: "",
//     subCategory: "",
//     subSubCategory: "",
//     product: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [subSubCategories, setSubSubCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCancel = () => {
//     setFormData({
//       fullName: "",
//       mobNumber: "",
//       email: "",
//       address: "",
//       subject: "",
//       category: "",
//       subCategory: "",
//       subSubCategory: "",
//       product: "",
//     });
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (formData.category) {
//       const fetchSubCategories = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`
//           );
//           setSubCategories(response.data.subCategories || response.data);
//         } catch (error) {
//           console.error("Failed to fetch subcategories:", error);
//           setSubCategories([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSubCategories();
//     } else {
//       setSubCategories([]);
//     }
//   }, [formData.category]);

//   useEffect(() => {
//     if (formData.subCategory) {
//       const fetchSubSubCategories = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`
//           );
//           setSubSubCategories(response.data || []);
//         } catch (error) {
//           console.error("Failed to fetch sub-sub-categories:", error);
//           setSubSubCategories([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSubSubCategories();
//     } else {
//       setSubSubCategories([]);
//     }
//   }, [formData.subCategory]);

//   useEffect(() => {
//     if (formData.subSubCategory) {
//       const fetchProducts = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`
//           );
//           setProducts(response.data || []);
//         } catch (error) {
//           console.error("Failed to fetch products:", error);
//           setProducts([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProducts();
//     } else {
//       setProducts([]);
//     }
//   }, [formData.subSubCategory]);

//   const handleDropdownChange = (name, value) => {
//     if (name === "category") {
//       setFormData({
//         ...formData,
//         [name]: value,
//         subCategory: "",
//         subSubCategory: "",
//         product: "",
//       });
//     } else if (name === "subCategory") {
//       setFormData({
//         ...formData,
//         [name]: value,
//         subSubCategory: "",
//         product: "",
//       });
//     } else if (name === "subSubCategory") {
//       setFormData({
//         ...formData,
//         [name]: value,
//         product: "",
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async () => {
//     if (
//       !formData.fullName ||
//       !formData.mobNumber ||
//       !formData.email ||
//       !formData.address ||
//       !formData.subject ||
//       !formData.category ||
//       !formData.subCategory ||
//       !formData.subSubCategory ||
//       !formData.product
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     try {
//       setSubmitLoading(true);

//       const quotationData = {
//         fullName: formData.fullName,
//         mobNumber: formData.mobNumber,
//         email: formData.email,
//         address: formData.address,
//         subject: formData.subject,
//         category: formData.category,
//         subCategory: formData.subCategory,
//         subSubCategory: formData.subSubCategory,
//         product: formData.product,
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/quotation/create-quotation`,
//         quotationData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data) {
//         toast.success(
//           "Quotation request submitted successfully! We will contact you soon."
//         );
//         handleCancel();
//         onClose();
//       }
//     } catch (error) {
//       console.error("Failed to submit quotation:", error);
//       toast.error("Failed to submit quotation. Please try again.");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const features = [
//     {
//       icon: <Package className="w-6 h-6" />,
//       title: "Full Price Details of the Products.",
//       description: "",
//     },
//     {
//       icon: <Image className="w-6 h-6" />,
//       title: "Product Images and Information with Details.",
//       description: "",
//     },
//     {
//       icon: <Video className="w-6 h-6" />,
//       title: "Video Link of Each Product.",
//       description: "",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex relative max-h-[95vh] sm:max-h-[90vh] lg:max-h-[100vh]">
//         <button
//           className="absolute top-2 right-2 sm:right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-xl sm:text-2xl z-10"
//           onClick={onClose}
//         >
//           <X size={20} className="sm:w-6 sm:h-6" />
//         </button>

//         <div className="hidden lg:block bg-gray-50 p-8 w-96 flex-shrink-0 rounded-l-xl">
//           <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-tight">
//             What features you will get in this quotation ?
//           </h2>

//           <div className="space-y-7">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 tracking-normal"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
//                     <div className="text-primaryColor">{feature.icon}</div>
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-primaryColor font-semibold text-md leading-relaxed">
//                       {feature.title}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
//           <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor rounded-lg flex items-center justify-center flex-shrink-0">
//               <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
//                 Enter Your Details and Download Free{" "}
//                 <span className="text-orange-500">Quotation !</span>
//               </h2>
//               <p className="text-gray-600 text-xs sm:text-sm mt-1">
//                 Enter your details, our team will get back to you soon.
//               </p>
//             </div>
//           </div>

//           <div className="lg:hidden mb-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
//               What you'll get:
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 rounded-lg p-3 border border-gray-100"
//                 >
//                   <div className="flex items-center gap-3 sm:flex-col sm:text-center">
//                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
//                       <div className="text-primaryColor scale-75 sm:scale-100">
//                         {feature.icon}
//                       </div>
//                     </div>
//                     <h4 className="text-blue-600 font-medium text-sm sm:text-xs leading-tight">
//                       {feature.title}
//                     </h4>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full Name Here"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="mobNumber"
//                   placeholder="Mob Number"
//                   value={formData.mobNumber}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Email"
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="address"
//                   placeholder="Address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="w-full">
//               <div className="relative">
//                 <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="subject"
//                   placeholder="Add Subject here"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="relative">
//                 <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                 <CustomDropdown
//                   label="Select Category"
//                   options={categories.map((c) => ({
//                     value: c._id,
//                     label: c.name,
//                   }))}
//                   value={formData.category}
//                   onChange={(val) => handleDropdownChange("category", val)}
//                   loading={loading}
//                 />
//               </div>
//               <div className="relative">
//                 <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                 <CustomDropdown
//                   label="Select Sub Category"
//                   options={subCategories.map((s) => ({
//                     value: s._id || s.id,
//                     label: s.name,
//                   }))}
//                   value={formData.subCategory}
//                   onChange={(val) => handleDropdownChange("subCategory", val)}
//                   disabled={!formData.category}
//                   loading={loading}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="relative">
//                 <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                 <CustomDropdown
//                   label="Select Sub-Sub Category"
//                   options={subSubCategories.map((s) => ({
//                     value: s._id,
//                     label: s.name,
//                   }))}
//                   value={formData.subSubCategory}
//                   onChange={(val) =>
//                     handleDropdownChange("subSubCategory", val)
//                   }
//                   disabled={!formData.subCategory}
//                   loading={loading}
//                 />
//               </div>
//               <div className="relative">
//                 <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                 <CustomDropdown
//                   label="Select Product"
//                   options={products.map((p) => ({
//                     value: p._id,
//                     label: p.name,
//                   }))}
//                   value={formData.product}
//                   onChange={(val) => handleDropdownChange("product", val)}
//                   disabled={!formData.subSubCategory}
//                   loading={loading}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
//               <button
//                 onClick={handleCancel}
//                 className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
//               >
//                 Cancel
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitLoading}
//                 className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {submitLoading ? "Processing..." : "Download Quotation"}
//                 <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CustomDropdown = ({
//   label,
//   options,
//   value,
//   onChange,
//   disabled,
//   loading,
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const selectedOption = options.find((opt) => opt.value === value);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <div
//         className={`flex items-center justify-between border border-gray-300 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
//           disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white"
//         }`}
//         onClick={() => !disabled && !loading && setOpen(!open)}
//       >
//         <span
//           className={`${
//             selectedOption ? "text-gray-700" : "text-gray-400"
//           } truncate`}
//         >
//           {loading
//             ? "Loading..."
//             : selectedOption
//             ? selectedOption.label
//             : label}
//         </span>
//         <FiChevronDown
//           className={`text-gray-400 transition-transform flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {open && !disabled && !loading && (
//         <ul className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-36 overflow-y-auto">
//           {options.length > 0 ? (
//             options.map((opt) => (
//               <li
//                 key={opt.value}
//                 className="px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 text-sm sm:text-base"
//                 onClick={() => {
//                   onChange(opt.value);
//                   setOpen(false);
//                 }}
//               >
//                 {opt.label}
//               </li>
//             ))
//           ) : (
//             <li className="px-4 py-2 sm:py-3 text-gray-400 text-sm sm:text-base">
//               No options available
//             </li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Quotation;

import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Image,
  Video,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Grid3X3,
  ChevronDown,
  X,
} from "lucide-react";
import { MdSubject } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import QuotationPDF from "../../utils/QuotationPDF";

const Quotation = ({ onClose }) => {
  const [quotationMode, setQuotationMode] = useState("detailed");
  const [formData, setFormData] = useState({
    fullName: "",
    mobNumber: "",
    email: "",
    address: "",
    subject: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    product: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const quotationPDF = new QuotationPDF();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      mobNumber: "",
      email: "",
      address: "",
      subject: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      product: "",
    });
    setSearchQuery("");
    setSelectedProductName("");
    setShowSearchResults(false);
    setFilteredProducts([]);
  };

  const handleModeSwitch = (mode) => {
    setQuotationMode(mode);
    setFormData({
      ...formData,
      category: "",
      subCategory: "",
      subSubCategory: "",
      product: "",
    });
    setSearchQuery("");
    setSelectedProductName("");
    setShowSearchResults(false);
    setFilteredProducts([]);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
        );
        const data = await response.json();
        setCategories(data.reverse());
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    if (quotationMode === "detailed") {
      fetchCategories();
    }
  }, [quotationMode]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`
        );
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch all products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (quotationMode === "simple") {
      fetchAllProducts();
    }
  }, [quotationMode]);

  const handleProductSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);

    if (query.length === 0) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelect = (product) => {
    setFormData({ ...formData, product: product._id });
    setSelectedProductName(product.name);
    setSearchQuery(product.name);
    setShowSearchResults(false);
  };

  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.category && quotationMode === "detailed") {
      const fetchSubCategories = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`
          );
          const data = await response.json();
          setSubCategories(data.subCategories || data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
          setSubCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [formData.category, quotationMode]);

  useEffect(() => {
    if (formData.subCategory && quotationMode === "detailed") {
      const fetchSubSubCategories = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`
          );
          const data = await response.json();
          setSubSubCategories(data || []);
        } catch (error) {
          console.error("Failed to fetch sub-sub-categories:", error);
          setSubSubCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSubSubCategories();
    } else {
      setSubSubCategories([]);
    }
  }, [formData.subCategory, quotationMode]);

  useEffect(() => {
    if (formData.subSubCategory && quotationMode === "detailed") {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`
          );
          const data = await response.json();
          setProducts(data || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [formData.subSubCategory, quotationMode]);

  const handleDropdownChange = (name, value) => {
    if (name === "category") {
      setFormData({
        ...formData,
        [name]: value,
        subCategory: "",
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subCategory") {
      setFormData({
        ...formData,
        [name]: value,
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subSubCategory") {
      setFormData({
        ...formData,
        [name]: value,
        product: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.mobNumber ||
      !formData.email ||
      !formData.address ||
      !formData.subject ||
      !formData.product
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      quotationMode === "detailed" &&
      (!formData.category || !formData.subCategory || !formData.subSubCategory)
    ) {
      toast.error("Please fill in all category fields for detailed quotation");
      return;
    }

    try {
      setSubmitLoading(true);

      let quotationData, apiEndpoint;
      if (quotationMode === "detailed") {
        quotationData = {
          fullName: formData.fullName,
          mobNumber: formData.mobNumber,
          email: formData.email,
          address: formData.address,
          subject: formData.subject,
          category: formData.category,
          subCategory: formData.subCategory,
          subSubCategory: formData.subSubCategory,
          product: formData.product,
        };
        apiEndpoint = `${process.env.REACT_APP_API_URL}/quotation/create-quotation`;
      } else {
        quotationData = {
          fullName: formData.fullName,
          mobNumber: formData.mobNumber,
          email: formData.email,
          address: formData.address,
          subject: formData.subject,
          product: formData.product,
        };
        apiEndpoint = `${process.env.REACT_APP_API_URL}/quotation/create-quotation/by-product`;
      }

      console.log("Creating quotation with data:", quotationData);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationData),
      });

      const responseData = await response.json();
      console.log("Quotation creation response:", responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to create quotation");
      }

      toast.success("Quotation created successfully!");

      const quotationId = responseData?.data?._id;
      console.log("Fetching complete quotation data for ID:", quotationId);

      const quotationResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${quotationId}`
      );

      const completeQuotationData = await quotationResponse.json();
      console.log("Complete quotation data received:", completeQuotationData);

      if (!quotationResponse.ok || !completeQuotationData.success) {
        throw new Error("Failed to fetch complete quotation data");
      }

      console.log("=== DEBUGGING QUOTATION DATA ===");
      console.log(
        "Full response:",
        JSON.stringify(completeQuotationData, null, 2)
      );
      console.log("Data object:", completeQuotationData.data);
      console.log("Product object:", completeQuotationData.data?.product);
      console.log("Category object:", completeQuotationData.data?.category);
      console.log("=== END DEBUGGING ===");

      console.log("Starting PDF generation...");
      toast.loading("Generating PDF...");

      const dataToPass = completeQuotationData.data;
      console.log("data to pass---------->>>>>>>>>>>>>>", dataToPass);
      if (!dataToPass) {
        throw new Error("No data found in quotation response");
      }

      if (!dataToPass.product) {
        console.warn("Warning: No product data found in quotation");
      }

      await quotationPDF.generatePDFWithJSPDF(dataToPass);

      toast.dismiss();
      toast.success("PDF downloaded successfully!");

      handleCancel();
      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Full Price Details of the Products.",
      description: "",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Product Images and Information with Details.",
      description: "",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Link of Each Product.",
      description: "",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex relative max-h-[95vh] sm:max-h-[90vh] lg:max-h-[100vh]">
        <button
          className="absolute top-2 right-2 sm:right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-xl sm:text-2xl z-10"
          onClick={onClose}
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="hidden lg:block bg-gray-50 p-8 w-96 flex-shrink-0 rounded-l-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-tight">
            What features you will get in this quotation ?
          </h2>

          <div className="space-y-7">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 tracking-normal"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-primaryColor">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-primaryColor font-semibold text-md leading-relaxed">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
                Enter Your Details and Download Free{" "}
                <span className="text-orange-500">Quotation !</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Enter your details, our team will get back to you soon.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <h3 className="text-base font-semibold text-gray-700 mb-2 sm:mb-0">
                Quotation Type:
              </h3>
              <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleModeSwitch("detailed")}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    quotationMode === "detailed"
                      ? "bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Detailed Selection
                </button>
                <button
                  onClick={() => handleModeSwitch("simple")}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    quotationMode === "simple"
                      ? "bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Quick Product Selection
                </button>
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              What you'll get:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="text-primaryColor scale-75 sm:scale-100">
                        {feature.icon}
                      </div>
                    </div>
                    <h4 className="text-primaryColor font-medium text-sm sm:text-xs leading-tight">
                      {feature.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name Here"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  name="mobNumber"
                  placeholder="Mob Number"
                  value={formData.mobNumber}
                  onChange={handleInputChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-full">
              <div className="relative">
                <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Add Subject here"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            {quotationMode === "detailed" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
                    <CustomDropdown
                      label="Select Category"
                      options={categories.map((c) => ({
                        value: c._id,
                        label: c.name,
                      }))}
                      value={formData.category}
                      onChange={(val) => handleDropdownChange("category", val)}
                      loading={loading}
                    />
                  </div>
                  <div className="relative">
                    <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
                    <CustomDropdown
                      label="Select Sub Category"
                      options={subCategories.map((s) => ({
                        value: s._id || s.id,
                        label: s.name,
                      }))}
                      value={formData.subCategory}
                      onChange={(val) =>
                        handleDropdownChange("subCategory", val)
                      }
                      disabled={!formData.category}
                      loading={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
                    <CustomDropdown
                      label="Select Sub-Sub Category"
                      options={subSubCategories.map((s) => ({
                        value: s._id,
                        label: s.name,
                      }))}
                      value={formData.subSubCategory}
                      onChange={(val) =>
                        handleDropdownChange("subSubCategory", val)
                      }
                      disabled={!formData.subCategory}
                      loading={loading}
                    />
                  </div>
                  <div className="relative">
                    <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
                    <CustomDropdown
                      label="Select Product"
                      options={products?.map((p) => ({
                        value: p._id,
                        label: p.name,
                      }))}
                      value={formData?.product}
                      onChange={(val) => handleDropdownChange("product", val)}
                      disabled={!formData.subSubCategory}
                      loading={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {quotationMode === "simple" && (
              <div className="w-full" ref={searchRef}>
                <div className="relative">
                  <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  />

                  {showSearchResults && (
                    <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          Loading products...
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product._id}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="font-medium text-sm sm:text-base">
                              {product.name}
                            </div>
                            {product.description && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {product.description}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                          No products found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedProductName && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primaryColor">
                        Selected:{" "}
                        <span className="font-medium">
                          {selectedProductName}
                        </span>
                      </span>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, product: "" });
                          setSelectedProductName("");
                          setSearchQuery("");
                        }}
                        className="text-primaryColor hover:text-primaryColor text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Cancel
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Processing..." : "Download Quotation"}
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  disabled,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center justify-between border border-gray-300 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white"
        }`}
        onClick={() => !disabled && !loading && setOpen(!open)}
      >
        <span
          className={`${
            selectedOption ? "text-gray-700" : "text-gray-400"
          } truncate`}
        >
          {loading
            ? "Loading..."
            : selectedOption
            ? selectedOption.label
            : label}
        </span>
        <FiChevronDown
          className={`text-gray-400 transition-transform flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && !disabled && !loading && (
        <ul className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-36 overflow-y-auto">
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt.value}
                className="px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 text-sm sm:text-base"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 sm:py-3 text-gray-400 text-sm sm:text-base">
              No options available
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Quotation;
