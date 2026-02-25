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
  X,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import { MdSubject } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import QuotationPDF from "../../utils/QuotationPDF";
import MultiProductQuotationPDF from "../../utils/MultiProductQuotationPDF";
import CustomDropdown from "./CustomDropdown";

const Quotation = ({ onClose, isPage = false, editId = null }) => {
  const [quotationMode, setQuotationMode] = useState(
    isPage ? "simple" : "detailed",
  );

  const [formData, setFormData] = useState({
    fullName: "",
    mobNumber: "",
    email: "",
    city: "",
    state: "",
    subject: "",
    referral: "",
  });

  const [products, setProducts] = useState([
    {
      id: Date.now(),
      category: "",
      subCategory: "",
      subSubCategory: "",
      product: "",
      quantity: 1,
    },
  ]);

  const [simpleProduct, setSimpleProduct] = useState({
    product: "",
    quantity: 1,
  });

  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [subSubCategoriesMap, setSubSubCategoriesMap] = useState({});
  const [productsMap, setProductsMap] = useState({});

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductData, setSelectedProductData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditingPreview, setIsEditingPreview] = useState(false);

  const [pdfSections, setPdfSections] = useState({
    customerInfo: true,
    productInfo: true,
    pricing: true,
    brandInfo: true,
    categoryInfo: true,
    materialInfo: true,
    measurementInfo: true,
    warrantyInfo: true,
  });

  const searchRef = useRef(null);
  const quotationPDF = new QuotationPDF();
  const multiProductQuotationPDF = new MultiProductQuotationPDF();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      mobNumber: "",
      email: "",
      city: "",
      state: "",
      subject: "",
      referral: "",
    });
    setProducts([
      {
        id: Date?.now(),
        category: "",
        subCategory: "",
        subSubCategory: "",
        product: "",
        quantity: 1,
      },
    ]);
    setSimpleProduct({ product: "", quantity: 1 });
    setSearchQuery("");
    setSelectedProductName("");
    setSelectedProductData(null);
    setShowSearchResults(false);
    setFilteredProducts([]);
    toast.success("Form cleared successfully!");
  };

  const handleModeSwitch = (mode) => {
    setQuotationMode(mode);
    setProducts([
      {
        id: Date?.now(),
        category: "",
        subCategory: "",
        subSubCategory: "",
        product: "",
        quantity: 1,
      },
    ]);
    setSimpleProduct({ product: "", quantity: 1 });
    setSearchQuery("");
    setSelectedProductName("");
    setSelectedProductData(null);
    setShowSearchResults(false);
    setFilteredProducts([]);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        id: Date?.now(),
        category: "",
        subCategory: "",
        subSubCategory: "",
        product: "",
        quantity: 1,
      },
    ]);
  };

  const removeProductRow = (id) => {
    if (products?.length > 1) {
      setProducts(products?.filter((p) => p?.id !== id));
      toast.success("Product removed successfully!");
    }
  };

  const safeMap = (array, renderFunction) => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map(renderFunction);
  };

  const updateProduct = (id, field, value) => {
    setProducts(
      products?.map((p) => {
        if (p?.id === id) {
          const updated = { ...p, [field]: value };

          if (field === "category") {
            updated.subCategory = "";
            updated.subSubCategory = "";
            updated.product = "";
          } else if (field === "subCategory") {
            updated.subSubCategory = "";
            updated.product = "";
          } else if (field === "subSubCategory") {
            updated.product = "";
          }

          return updated;
        }
        return p;
      }),
    );
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`,
        );
        const data = await response?.json();
        setCategories(data?.reverse());
      } catch (error) {
        console?.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    if (quotationMode === "detailed") {
      fetchCategories();
    }
  }, [quotationMode]);

  // Fetch subcategories for each product
  useEffect(() => {
    products?.forEach((product) => {
      if (product?.category && !subCategoriesMap[product?.category]) {
        fetchSubCategories(product?.category);
      }
      if (product?.subCategory && !subSubCategoriesMap[product?.subCategory]) {
        fetchSubSubCategories(product?.subCategory);
      }
      if (product?.subSubCategory && !productsMap[product?.subSubCategory]) {
        fetchProducts(product?.subSubCategory);
      }
    });
  }, [products]);

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${categoryId}`,
      );
      const data = await response?.json();
      setSubCategoriesMap((prev) => ({
        ...prev,
        [categoryId]: data?.subCategories || data,
      }));
    } catch (error) {
      console?.error("Failed to fetch subcategories:", error);
    }
  };

  const fetchSubSubCategories = async (subCategoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subCategoryId}`,
      );
      const data = await response?.json();
      setSubSubCategoriesMap((prev) => ({
        ...prev,
        [subCategoryId]: data || [],
      }));
    } catch (error) {
      console?.error("Failed to fetch sub-sub-categories:", error);
    }
  };

  const fetchProducts = async (subSubCategoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${subSubCategoryId}`,
      );
      const data = await response?.json();
      setProductsMap((prev) => ({
        ...prev,
        [subSubCategoryId]: data || [],
      }));
    } catch (error) {
      console?.error("Failed to fetch products:", error);
    }
  };

  // Fetch existing quotation for edit mode
  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${editId}`,
        );
        const data = await response?.json();

        if (data.success) {
          const q = data.data;
          setFormData({
            fullName: q.fullName || "",
            mobNumber: q.mobNumber || "",
            email: q.email || "",
            city: q.city || "",
            state: q.state || "",
            subject: q.subject || "",
            referral: q.referral || "",
          });

          if (q.products && q.products.length > 0) {
            setQuotationMode("detailed");
            setProducts(
              q.products.map((p) => ({
                id: p._id || Date.now() + Math.random(),
                category: p.category?._id || p.category,
                subCategory: p.subCategory?._id || p.subCategory,
                subSubCategory: p.subSubCategory?._id || p.subSubCategory,
                product: p.product?._id || p.product,
                quantity: p.quantity || 1,
              })),
            );
          } else {
            setQuotationMode("simple");
            setSimpleProduct({
              product: q.product?._id || q.product,
              quantity: q.quantity || 1,
            });
            if (q.product) {
              setSelectedProductName(q.product.name || "");
              setSelectedProductData(q.product);
              setSearchQuery(q.product.name || "");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch quotation for edit:", error);
        toast.error("Failed to load quotation data");
      } finally {
        setLoading(false);
      }
    };

    if (editId) {
      fetchQuotationData();
    }
  }, [editId]);

  // Fetch all products for simple mode
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`,
        );
        const data = await response?.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console?.error("Failed to fetch all products:", error);
        toast.error("Failed to load products");
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
    setShowSearchResults(query?.length > 0);

    if (query?.length === 0) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts?.filter(
      (product) =>
        product?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
        (product?.description &&
          product?.description?.toLowerCase()?.includes(query?.toLowerCase())),
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelect = (product) => {
    setSimpleProduct({ ...simpleProduct, product: product?._id });
    setSelectedProductName(product?.name);
    setSelectedProductData(product);
    setSearchQuery(product?.name);
    setShowSearchResults(false);
    toast.success("Product selected successfully!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSearchResults(false);
      }
    };
    document?.addEventListener("mousedown", handleClickOutside);
    return () => document?.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSectionToggle = (section) => {
    setPdfSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async () => {
    if (!formData?.fullName || !formData?.mobNumber || !formData?.email) {
      toast.error("Please fill in all required customer fields");
      return;
    }

    let quotationData;
    let apiUrl;

    if (quotationMode === "detailed") {
      // Multi-product mode validation
      const invalidProducts = products?.filter(
        (p) =>
          !p?.category || !p?.subCategory || !p?.subSubCategory || !p?.product,
      );

      if (invalidProducts?.length > 0) {
        toast.error("Please complete all product selections");
        return;
      }

      // Multi-product API
      apiUrl = `${process.env.REACT_APP_API_URL}/quotation/create-quotation/multiple-products`;
      quotationData = {
        fullName: formData?.fullName,
        mobNumber: formData?.mobNumber,
        email: formData?.email,
        city: formData?.city, // Added
        state: formData?.state,
        subject: formData?.subject,
        referral: formData?.referral || undefined,
        products: products?.map((p) => ({
          category: p?.category,
          subCategory: p?.subCategory,
          subSubCategory: p?.subSubCategory,
          product: p?.product,
          quantity: p?.quantity || 1,
        })),
      };
    } else {
      // Simple mode validation
      if (!simpleProduct?.product) {
        toast.error("Please select a product");
        return;
      }

      if (!selectedProductData) {
        toast.error("Product data not found. Please select again.");
        return;
      }

      // Single product API
      apiUrl = `${process.env.REACT_APP_API_URL}/quotation/create-quotation`;
      quotationData = {
        fullName: formData?.fullName,
        mobNumber: formData?.mobNumber,
        email: formData?.email,
        city: formData?.city, // Added
        state: formData?.state,
        subject: formData?.subject,
        referral: formData?.referral || undefined,
        category:
          selectedProductData?.category?._id || selectedProductData?.category,
        subCategory:
          selectedProductData?.subCategory?._id ||
          selectedProductData?.subCategory,
        subSubCategory:
          selectedProductData?.subSubCategory?._id ||
          selectedProductData?.subSubCategory,
        product: simpleProduct?.product,
        quantity: simpleProduct?.quantity || 1,
      };
    }

    if (editId) {
      apiUrl = `${process.env.REACT_APP_API_URL}/quotation/update-quotation/${editId}`;
    }

    try {
      setSubmitLoading(true);

      const response = await fetch(apiUrl, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON?.stringify(quotationData),
      });

      const responseData = await response?.json();

      if (!response?.ok || !responseData?.success) {
        throw new Error(responseData?.message || "Failed to create quotation");
      }

      // Fetch complete quotation data
      const quotationId = responseData?.data?._id;
      const quotationResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${quotationId}`,
      );

      const completeQuotationData = await quotationResponse?.json();

      if (!quotationResponse?.ok || !completeQuotationData?.success) {
        throw new Error("Failed to fetch complete quotation data");
      }

      // Show preview
      setPreviewData(completeQuotationData?.data);
      setShowPreview(true);
      toast.success(
        editId
          ? "Quotation updated successfully!"
          : "Quotation created successfully!",
      );
    } catch (error) {
      console?.error("Error in handleSubmit:", error);
      toast.error(`Error: ${error?.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Generating PDF...");

      // Use appropriate PDF generator based on quotation mode
      if (quotationMode === "detailed") {
        await multiProductQuotationPDF.generatePDFWithJSPDF(
          previewData,
          pdfSections,
        );
      } else {
        await quotationPDF.generatePDFWithJSPDF(previewData, pdfSections);
      }

      toast.dismiss();
      toast.success("PDF downloaded successfully!");
      setShowPreview(false);
      handleCancel();
      onClose();
    } catch (error) {
      console?.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error(`Error: ${error?.message}`);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "INR 0.00";
    return `INR ${parseFloat(amount).toFixed(2)}`;
  };

  const calculatePricing = (product) => {
    const basePrice = parseFloat(product?.price || 0);
    const gstPercentage = parseFloat(product?.gstPercentage || 18);
    const extraTaxPercentage = parseFloat(product?.extraTaxPercentage || 0);
    const shippingCharge = parseFloat(product?.shippingCharge || 0);

    const gstAmount = (basePrice * gstPercentage) / 100;
    const extraTaxAmount = (basePrice * extraTaxPercentage) / 100;
    const priceWithTaxes = basePrice + gstAmount + extraTaxAmount;
    const totalAmount = priceWithTaxes + shippingCharge;

    return {
      basePrice,
      gstAmount,
      extraTaxAmount,
      shippingCharge,
      priceWithTaxes,
      totalAmount,
      gstPercentage,
      extraTaxPercentage,
    };
  };

  // Helper function to calculate grand total for multi-product preview
  const calculateGrandTotal = (quotationData) => {
    if (!quotationData?.products || quotationData.products.length === 0) {
      return 0;
    }

    return quotationData.products.reduce((total, productItem) => {
      const product = productItem.product;
      const quantity = productItem.quantity || 1;
      const pricing = calculatePricing(product);
      return total + pricing.totalAmount * quantity;
    }, 0);
  };

  // Helper function to get product data for preview
  const getProductDataForPreview = (quotationData) => {
    // Handle multiple products case
    if (quotationData?.products && quotationData.products.length > 0) {
      const firstProduct = quotationData.products[0];
      return {
        product: firstProduct.product,
        category: firstProduct.category,
        subCategory: firstProduct.subCategory,
        subSubCategory: firstProduct.subSubCategory,
      };
    }

    // Handle single product case
    return {
      product: quotationData?.product,
      category: quotationData?.category,
      subCategory: quotationData?.subCategory,
      subSubCategory: quotationData?.subSubCategory,
    };
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Full Price Details of the Products.",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Product Images and Information with Details.",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Link of Each Product.",
    },
  ];

  const handlePreviewProductSelect = (product, listIndex = 0) => {
    setPreviewData((prev) => {
      const newData = { ...prev };
      if (quotationMode === "detailed") {
        const newProducts = [...newData.products];
        newProducts[listIndex] = {
          ...newProducts[listIndex],
          category: product.category,
          subCategory: product.subCategory,
          subSubCategory: product.subSubCategory,
          product: product,
          quantity: newProducts[listIndex].quantity || 1,
        };
        newData.products = newProducts;
      } else {
        newData.product = product;
        newData.category = product.category;
        newData.subCategory = product.subCategory;
        newData.subSubCategory = product.subSubCategory;
      }
      return newData;
    });
    setPreviewSearchQuery("");
    setActiveSearchIndex(null);
  };

  const [previewSearchQuery, setPreviewSearchQuery] = useState("");
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);

  // Filter for preview search
  const previewFilteredProducts = previewSearchQuery
    ? allProducts.filter((p) =>
        p.name?.toLowerCase().includes(previewSearchQuery.toLowerCase()),
      )
    : [];

  const handlePreviewUpdate = (field, value) => {
    setPreviewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreview = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/quotation/update-quotation/${previewData._id}`;

      // Prepare payload similar to handleSubmit
      const quotationData = {
        fullName: previewData.fullName,
        mobNumber: previewData.mobNumber,
        email: previewData.email,
        city: previewData.city,
        state: previewData.state,
        subject: previewData.subject,
        products: previewData.products.map((p) => ({
          category: p.category?._id || p.category,
          subCategory: p.subCategory?._id || p.subCategory,
          subSubCategory: p.subSubCategory?._id || p.subSubCategory,
          product: p.product?._id || p.product,
          quantity: p.quantity || 1,
        })),
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update quotation");
      }

      toast.success("Changes saved successfully!");
      setIsEditingPreview(false);

      // Sync with formData
      setFormData({
        fullName: previewData.fullName,
        mobNumber: previewData.mobNumber,
        email: previewData.email,
        city: previewData.city,
        state: previewData.state,
        subject: previewData.subject,
        referral: formData.referral, // Keep existing if not in preview
      });
    } catch (error) {
      console.error("Error saving preview changes:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div
      className={
        isPage
          ? ""
          : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 z-[99]"
      }
    >
      <div
        className={
          isPage
            ? "bg-white rounded-xl shadow-md w-full flex relative overflow-hidden"
            : "bg-white rounded-xl shadow-2xl w-full max-w-6xl flex relative max-h-[95vh] overflow-hidden"
        }
      >
        {!isPage && (
          <button
            className="absolute top-2 right-2 sm:right-4 cursor-pointer text-gray-500 hover:text-gray-800 z-[99]"
            onClick={onClose}
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Left Sidebar - Features */}
        {!isPage && (
          <div className="hidden lg:block bg-gray-50 p-8 w-96 flex-shrink-0 rounded-l-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              What features you will get in this quotation?
            </h2>
            <div className="space-y-7">
              {features?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="text-primaryBtnColor">
                        {feature?.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-primaryBtnColor font-semibold text-md">
                        {feature?.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar ${isPage ? "" : ""}`}
        >
          {/* Preview Modal */}
          {showPreview && previewData && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#004680] to-[#00365f] p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      PDF Preview
                    </h2>
                    <p className="text-white/80 text-sm">
                      Review and customize your quotation{" "}
                      {previewData.quotationRef && (
                        <span className="font-semibold text-white ml-2">
                          Reference No. :- {previewData.quotationRef}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditingPreview ? (
                      <button
                        onClick={handleSavePreview}
                        className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span className="text-sm font-medium">Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditingPreview(true);
                          if (allProducts.length === 0) {
                            const fetchAll = async () => {
                              try {
                                const response = await fetch(
                                  `${process.env.REACT_APP_API_URL}/products/get-all-products`,
                                );
                                const data = await response.json();
                                setAllProducts(data);
                                setFilteredProducts(data);
                              } catch (error) {
                                console.error(
                                  "Failed to fetch products for edit:",
                                  error,
                                );
                              }
                            };
                            fetchAll();
                          }
                        }}
                        className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        setIsEditingPreview(false);
                      }}
                      className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Preview */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-blue-600 mb-4">
                        Document Preview
                      </h3>

                      {/* Customer Information */}
                      {pdfSections.customerInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                          <h4 className="font-semibold text-blue-600 mb-3">
                            Customer Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center">
                              <span className="font-semibold w-20">Name:</span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="text"
                                  value={previewData.fullName}
                                  onChange={(e) =>
                                    handlePreviewUpdate(
                                      "fullName",
                                      e.target.value,
                                    )
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.fullName
                              )}
                            </p>
                            <p className="flex items-center">
                              <span className="font-semibold w-20">Phone:</span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="text"
                                  value={previewData.mobNumber}
                                  onChange={(e) =>
                                    handlePreviewUpdate(
                                      "mobNumber",
                                      e.target.value,
                                    )
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.mobNumber
                              )}
                            </p>
                            <p className="flex items-center">
                              <span className="font-semibold w-20">Email:</span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="email"
                                  value={previewData.email}
                                  onChange={(e) =>
                                    handlePreviewUpdate("email", e.target.value)
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.email
                              )}
                            </p>
                            <p className="flex items-center">
                              <span className="font-semibold w-20">City:</span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="text"
                                  value={previewData.city}
                                  onChange={(e) =>
                                    handlePreviewUpdate("city", e.target.value)
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.city
                              )}
                            </p>
                            <p className="flex items-center">
                              <span className="font-semibold w-20">State:</span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="text"
                                  value={previewData.state}
                                  onChange={(e) =>
                                    handlePreviewUpdate("state", e.target.value)
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.state
                              )}
                            </p>
                            <p className="flex items-center">
                              <span className="font-semibold w-20">
                                Subject:
                              </span>{" "}
                              {isEditingPreview ? (
                                <input
                                  type="text"
                                  value={previewData.subject}
                                  onChange={(e) =>
                                    handlePreviewUpdate(
                                      "subject",
                                      e.target.value,
                                    )
                                  }
                                  className="border rounded px-2 py-1 flex-1 text-sm bg-white"
                                />
                              ) : (
                                previewData.subject
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Product Information */}
                      {pdfSections.productInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                          <h4 className="font-semibold text-blue-600 mb-3">
                            {quotationMode === "detailed"
                              ? "Products"
                              : "Product Information"}
                          </h4>
                          <div className="space-y-3 text-sm">
                            {quotationMode === "detailed"
                              ? // Multi-product display
                                previewData?.products?.map(
                                  (productItem, index) => (
                                    <div
                                      key={index}
                                      className="pb-3 border-b border-gray-300 last:border-b-0"
                                    >
                                      <p className="font-semibold text-blue-600 mb-1">
                                        Product {index + 1}
                                      </p>
                                      <div className="relative">
                                        <span className="font-semibold">
                                          Name:
                                        </span>{" "}
                                        {isEditingPreview ? (
                                          <div className="inline-block relative w-64">
                                            <input
                                              type="text"
                                              value={
                                                activeSearchIndex === index
                                                  ? previewSearchQuery
                                                  : productItem.product?.name ||
                                                    ""
                                              }
                                              onFocus={() => {
                                                setActiveSearchIndex(index);
                                                setPreviewSearchQuery(
                                                  productItem.product?.name ||
                                                    "",
                                                );
                                              }}
                                              onChange={(e) =>
                                                setPreviewSearchQuery(
                                                  e.target.value,
                                                )
                                              }
                                              className="border rounded px-2 py-1 w-full text-sm bg-white"
                                              placeholder="Search product..."
                                            />
                                            {activeSearchIndex === index &&
                                              previewSearchQuery && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                  {previewFilteredProducts.map(
                                                    (p) => (
                                                      <div
                                                        key={p._id}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        onMouseDown={() =>
                                                          handlePreviewProductSelect(
                                                            p,
                                                            index,
                                                          )
                                                        }
                                                      >
                                                        {p.name}
                                                      </div>
                                                    ),
                                                  )}
                                                  {previewFilteredProducts.length ===
                                                    0 && (
                                                    <div className="px-3 py-2 text-gray-400 text-sm">
                                                      No results
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                          </div>
                                        ) : (
                                          productItem.product?.name || "N/A"
                                        )}
                                      </div>
                                      <p>
                                        <span className="font-semibold">
                                          Quantity:
                                        </span>{" "}
                                        {productItem.quantity || 1}
                                      </p>
                                      {pdfSections.brandInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Brand:
                                          </span>{" "}
                                          {productItem.product?.brand || "N/A"}
                                        </p>
                                      )}
                                      {pdfSections.categoryInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Category:
                                          </span>{" "}
                                          {productItem.category?.name || "N/A"}
                                        </p>
                                      )}
                                    </div>
                                  ),
                                )
                              : // Single product display
                                (() => {
                                  const productData =
                                    getProductDataForPreview(previewData);
                                  return (
                                    <>
                                      <div className="relative mb-2">
                                        <span className="font-semibold">
                                          Product:
                                        </span>{" "}
                                        {isEditingPreview ? (
                                          <div className="inline-block relative w-64">
                                            <input
                                              type="text"
                                              value={
                                                activeSearchIndex === -1
                                                  ? previewSearchQuery
                                                  : productData.product?.name ||
                                                    ""
                                              }
                                              onFocus={() => {
                                                setActiveSearchIndex(-1);
                                                setPreviewSearchQuery(
                                                  productData.product?.name ||
                                                    "",
                                                );
                                              }}
                                              onChange={(e) =>
                                                setPreviewSearchQuery(
                                                  e.target.value,
                                                )
                                              }
                                              className="border rounded px-2 py-1 w-full text-sm bg-white"
                                              placeholder="Search product..."
                                            />
                                            {activeSearchIndex === -1 &&
                                              previewSearchQuery && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                  {previewFilteredProducts.map(
                                                    (p) => (
                                                      <div
                                                        key={p._id}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        onMouseDown={() =>
                                                          handlePreviewProductSelect(
                                                            p,
                                                            -1,
                                                          )
                                                        }
                                                      >
                                                        {p.name}
                                                      </div>
                                                    ),
                                                  )}
                                                  {previewFilteredProducts.length ===
                                                    0 && (
                                                    <div className="px-3 py-2 text-gray-400 text-sm">
                                                      No results
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                          </div>
                                        ) : (
                                          productData.product?.name || "N/A"
                                        )}
                                      </div>
                                      {pdfSections.brandInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Brand:
                                          </span>{" "}
                                          {productData.product?.brand || "N/A"}
                                        </p>
                                      )}
                                      {pdfSections.categoryInfo && (
                                        <>
                                          <p>
                                            <span className="font-semibold">
                                              Category:
                                            </span>{" "}
                                            {productData.category?.name ||
                                              "N/A"}
                                          </p>
                                          <p>
                                            <span className="font-semibold">
                                              Sub-Category:
                                            </span>{" "}
                                            {productData.subCategory?.name ||
                                              "N/A"}
                                          </p>
                                          <p>
                                            <span className="font-semibold">
                                              Tier-3-Category:
                                            </span>{" "}
                                            {productData.subSubCategory?.name ||
                                              "N/A"}
                                          </p>
                                        </>
                                      )}
                                      {pdfSections.materialInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Material:
                                          </span>{" "}
                                          {productData.product?.material ||
                                            "N/A"}
                                        </p>
                                      )}
                                      {pdfSections.measurementInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Measurement:
                                          </span>{" "}
                                          {productData.product?.measurement ||
                                            "N/A"}
                                        </p>
                                      )}
                                      {pdfSections.warrantyInfo && (
                                        <p>
                                          <span className="font-semibold">
                                            Warranty:
                                          </span>{" "}
                                          {productData.product?.warranty
                                            ?.warrantyDays || "N/A"}
                                        </p>
                                      )}
                                    </>
                                  );
                                })()}
                          </div>
                        </div>
                      )}

                      {/* Pricing Information */}
                      {pdfSections.pricing && (
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-200">
                          <h4 className="font-semibold text-blue-600 mb-3">
                            Pricing Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            {quotationMode === "detailed" ? (
                              // Multi-product pricing summary
                              <>
                                <p className="text-xs text-gray-600 mb-2">
                                  Individual product pricing will be shown in
                                  the PDF
                                </p>
                                <div className="flex justify-between pt-2 border-t-2 border-green-400">
                                  <span className="font-bold">
                                    Grand Total:
                                  </span>
                                  <span className="font-bold text-green-600">
                                    {formatCurrency(
                                      calculateGrandTotal(previewData),
                                    )}
                                  </span>
                                </div>
                              </>
                            ) : (
                              // Single product pricing
                              (() => {
                                const productData =
                                  getProductDataForPreview(previewData);
                                const pricing = calculatePricing(
                                  productData.product,
                                );
                                return (
                                  <>
                                    <div className="flex justify-between">
                                      <span>Base Price:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(pricing.basePrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>
                                        GST ({pricing.gstPercentage}%):
                                      </span>
                                      <span className="font-semibold">
                                        {formatCurrency(pricing.gstAmount)}
                                      </span>
                                    </div>
                                    {pricing.extraTaxPercentage > 0 && (
                                      <div className="flex justify-between">
                                        <span>
                                          Extra Tax (
                                          {pricing.extraTaxPercentage}%):
                                        </span>
                                        <span className="font-semibold">
                                          {formatCurrency(
                                            pricing.extraTaxAmount,
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Shipping:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(pricing.shippingCharge)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t-2 border-green-400">
                                      <span className="font-bold">
                                        Total Amount:
                                      </span>
                                      <span className="font-bold text-green-600">
                                        {formatCurrency(pricing.totalAmount)}
                                      </span>
                                    </div>
                                  </>
                                );
                              })()
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Options */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-blue-600 mb-4">
                        Customize PDF Content
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <label className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={pdfSections.customerInfo}
                            onChange={() => handleSectionToggle("customerInfo")}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                              Customer Information
                            </span>
                            <p className="text-xs text-gray-500">
                              Include customer name, contact details, city and
                              state
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={pdfSections.productInfo}
                            onChange={() => handleSectionToggle("productInfo")}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                              Product Information
                            </span>
                            <p className="text-xs text-gray-500">
                              Include product name and basic details
                            </p>
                          </div>
                        </label>

                        <div className="ml-8 space-y-2 border-l-2 border-gray-300 pl-4">
                          <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={pdfSections.brandInfo}
                              onChange={() => handleSectionToggle("brandInfo")}
                              disabled={!pdfSections.productInfo}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 disabled:opacity-50"
                            />
                            <span
                              className={
                                !pdfSections.productInfo
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Brand Information
                            </span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={pdfSections.categoryInfo}
                              onChange={() =>
                                handleSectionToggle("categoryInfo")
                              }
                              disabled={!pdfSections.productInfo}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 disabled:opacity-50"
                            />
                            <span
                              className={
                                !pdfSections.productInfo
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Category Details
                            </span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={pdfSections.materialInfo}
                              onChange={() =>
                                handleSectionToggle("materialInfo")
                              }
                              disabled={!pdfSections.productInfo}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 disabled:opacity-50"
                            />
                            <span
                              className={
                                !pdfSections.productInfo
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Material Information
                            </span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={pdfSections.measurementInfo}
                              onChange={() =>
                                handleSectionToggle("measurementInfo")
                              }
                              disabled={!pdfSections.productInfo}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 disabled:opacity-50"
                            />
                            <span
                              className={
                                !pdfSections.productInfo
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Measurement Details
                            </span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={pdfSections.warrantyInfo}
                              onChange={() =>
                                handleSectionToggle("warrantyInfo")
                              }
                              disabled={!pdfSections.productInfo}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 disabled:opacity-50"
                            />
                            <span
                              className={
                                !pdfSections.productInfo
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Warranty Information
                            </span>
                          </label>
                        </div>

                        <label className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={pdfSections.pricing}
                            onChange={() => handleSectionToggle("pricing")}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                              Pricing Details
                            </span>
                            <p className="text-xs text-gray-500">
                              Include pricing breakdown and total amount
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Tip:</span> Uncheck
                          any section you don't want to include in your PDF.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t bg-gray-50 p-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 bg-gradient-to-r from-[#004680] to-[#00365f] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#004680] to-[#00365f] rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                Enter Your Details and Download Free{" "}
                <span className="text-orange-500">Quotation!</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Enter your details, our team will get back to you soon?.
              </p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <h3 className="text-base font-semibold text-gray-700 mb-2 sm:mb-0">
                Quotation Type:
              </h3>
              <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1">
                {isPage ? (
                  <>
                    <button
                      onClick={() => handleModeSwitch("simple")}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        quotationMode === "simple"
                          ? "bg-gradient-to-r from-[#004680] to-[#00365f] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Single quotation
                    </button>
                    <button
                      onClick={() => handleModeSwitch("detailed")}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        quotationMode === "detailed"
                          ? "bg-gradient-to-r from-[#004680] to-[#00365f] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Multiple quotation
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleModeSwitch("detailed")}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        quotationMode === "detailed"
                          ? "bg-gradient-to-r from-[#004680] to-[#00365f] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Detailed Selection
                    </button>
                    <button
                      onClick={() => handleModeSwitch("simple")}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        quotationMode === "simple"
                          ? "bg-gradient-to-r from-[#004680] to-[#00365f] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Quick Product Selection
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-700">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData?.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  name="mobNumber"
                  placeholder="Mobile Number *"
                  value={formData?.mobNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData?.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData?.city}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData?.state}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData?.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="referral"
                  placeholder="Referral (Optional)"
                  value={formData?.referral}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Product Selection</h3>
              {quotationMode === "detailed" && (
                <button
                  onClick={addProductRow}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            {quotationMode === "detailed" ? (
              <div className="space-y-4">
                {products?.map((product, index) => (
                  <div
                    key={product?.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        Product {index + 1}
                      </h4>
                      {products?.length > 1 && (
                        <button
                          onClick={() => removeProductRow(product?.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CustomDropdown
                        label="Category"
                        icon={Grid3X3}
                        options={categories}
                        value={product?.category}
                        onChange={(val) =>
                          updateProduct(product?.id, "category", val)
                        }
                        placeholder="Select Category"
                      />
                      <CustomDropdown
                        label="Sub Category"
                        icon={Grid3X3}
                        options={subCategoriesMap[product?.category] || []}
                        value={product?.subCategory}
                        onChange={(val) =>
                          updateProduct(product?.id, "subCategory", val)
                        }
                        placeholder="Select Sub Category"
                        disabled={!product?.category}
                      />
                      <CustomDropdown
                        label="Tier-3 Category"
                        icon={Grid3X3}
                        options={
                          subSubCategoriesMap[product?.subCategory] || []
                        }
                        value={product?.subSubCategory}
                        onChange={(val) =>
                          updateProduct(product?.id, "subSubCategory", val)
                        }
                        placeholder="Select Tier-3 Category"
                        disabled={!product?.subCategory}
                      />
                      <CustomDropdown
                        label="Product"
                        icon={Package}
                        options={productsMap[product?.subSubCategory] || []}
                        value={product?.product}
                        onChange={(val) =>
                          updateProduct(product?.id, "product", val)
                        }
                        placeholder="Select Product"
                        disabled={!product?.subSubCategory}
                      />
                    </div>

                    {/* Quantity Input */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={product?.quantity}
                        onChange={(e) =>
                          updateProduct(
                            product?.id,
                            "quantity",
                            parseInt(e?.target?.value) || 1,
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                        style={{ height: "48px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative" ref={searchRef}>
                  <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e?.target?.value)}
                    onFocus={() =>
                      setShowSearchResults(searchQuery?.length > 0)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {showSearchResults && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          Loading products...
                        </div>
                      ) : filteredProducts?.length > 0 ? (
                        filteredProducts?.map((product) => (
                          <div
                            key={product?._id}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="font-medium text-sm">
                              {product?.name}
                            </div>
                            {product?.description && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {product?.description}
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
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        Selected:{" "}
                        <span className="font-medium">
                          {selectedProductName}
                        </span>
                      </span>
                      <button
                        onClick={() => {
                          setSimpleProduct({ product: "", quantity: 1 });
                          setSelectedProductName("");
                          setSearchQuery("");
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={simpleProduct?.quantity}
                    onChange={(e) =>
                      setSimpleProduct({
                        ...simpleProduct,
                        quantity: parseInt(e?.target?.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Cancel
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span>Preview Quotation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;

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
// import toast from "react-hot-toast";
// import QuotationPDF from "?.?./?.?./utils/QuotationPDF";

// const Quotation = ({ onClose }) => {
//   const [quotationMode, setQuotationMode] = useState("detailed");
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
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [selectedProductName, setSelectedProductName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const quotationPDF = new QuotationPDF();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e?.target?.name]: e?.target?.value,
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
//     setSearchQuery("");
//     setSelectedProductName("");
//     setShowSearchResults(false);
//     setFilteredProducts([]);
//   };

//   const handleModeSwitch = (mode) => {
//     setQuotationMode(mode);
//     setFormData({
//       ...formData,
//       category: "",
//       subCategory: "",
//       subSubCategory: "",
//       product: "",
//     });
//     setSearchQuery("");
//     setSelectedProductName("");
//     setShowSearchResults(false);
//     setFilteredProducts([]);
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
//         );
//         const data = await response?.json();
//         setCategories(data?.reverse());
//       } catch (error) {
//         console?.error("Failed to fetch categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quotationMode === "detailed") {
//       fetchCategories();
//     }
//   }, [quotationMode]);

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/products/get-all-products`
//         );
//         const data = await response?.json();
//         setAllProducts(data);
//         setFilteredProducts(data);
//       } catch (error) {
//         console?.error("Failed to fetch all products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quotationMode === "simple") {
//       fetchAllProducts();
//     }
//   }, [quotationMode]);

//   const handleProductSearch = (query) => {
//     setSearchQuery(query);
//     setShowSearchResults(query?.length > 0);

//     if (query?.length === 0) {
//       setFilteredProducts(allProducts);
//       return;
//     }

//     const filtered = allProducts?.filter(
//       (product) =>
//         product?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
//         (product?.description &&
//           product?.description?.toLowerCase()?.includes(query?.toLowerCase()))
//     );
//     setFilteredProducts(filtered);
//   };

//   const handleProductSelect = (product) => {
//     setFormData({ ...formData, product: product?._id });
//     setSelectedProductName(product?.name);
//     setSearchQuery(product?.name);
//     setShowSearchResults(false);
//   };

//   const searchRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
//         setShowSearchResults(false);
//       }
//     };
//     document?.addEventListener("mousedown", handleClickOutside);
//     return () => document?.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (formData?.category && quotationMode === "detailed") {
//       const fetchSubCategories = async () => {
//         try {
//           setLoading(true);
//           const response = await fetch(
//             `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData?.category}`
//           );
//           const data = await response?.json();
//           setSubCategories(data?.subCategories || data);
//         } catch (error) {
//           console?.error("Failed to fetch subcategories:", error);
//           setSubCategories([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSubCategories();
//     } else {
//       setSubCategories([]);
//     }
//   }, [formData?.category, quotationMode]);

//   useEffect(() => {
//     if (formData?.subCategory && quotationMode === "detailed") {
//       const fetchSubSubCategories = async () => {
//         try {
//           setLoading(true);
//           const response = await fetch(
//             `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData?.subCategory}`
//           );
//           const data = await response?.json();
//           setSubSubCategories(data || []);
//         } catch (error) {
//           console?.error("Failed to fetch sub-sub-categories:", error);
//           setSubSubCategories([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSubSubCategories();
//     } else {
//       setSubSubCategories([]);
//     }
//   }, [formData?.subCategory, quotationMode]);

//   useEffect(() => {
//     if (formData?.subSubCategory && quotationMode === "detailed") {
//       const fetchProducts = async () => {
//         try {
//           setLoading(true);
//           const response = await fetch(
//             `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData?.subSubCategory}`
//           );
//           const data = await response?.json();
//           setProducts(data || []);
//         } catch (error) {
//           console?.error("Failed to fetch products:", error);
//           setProducts([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProducts();
//     } else {
//       setProducts([]);
//     }
//   }, [formData?.subSubCategory, quotationMode]);

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
//       !formData?.fullName ||
//       !formData?.mobNumber ||
//       !formData?.email ||
//       !formData?.address ||
//       !formData?.subject ||
//       !formData?.product
//     ) {
//       toast?.error("Please fill in all fields");
//       return;
//     }

//     if (
//       quotationMode === "detailed" &&
//       (!formData?.category || !formData?.subCategory || !formData?.subSubCategory)
//     ) {
//       toast?.error("Please fill in all category fields for detailed quotation");
//       return;
//     }

//     try {
//       setSubmitLoading(true);

//       let quotationData, apiEndpoint;
//       if (quotationMode === "detailed") {
//         quotationData = {
//           fullName: formData?.fullName,
//           mobNumber: formData?.mobNumber,
//           email: formData?.email,
//           address: formData?.address,
//           subject: formData?.subject,
//           category: formData?.category,
//           subCategory: formData?.subCategory,
//           subSubCategory: formData?.subSubCategory,
//           product: formData?.product,
//         };
//         apiEndpoint = `${process.env.REACT_APP_API_URL}/quotation/create-quotation`;
//       } else {
//         quotationData = {
//           fullName: formData?.fullName,
//           mobNumber: formData?.mobNumber,
//           email: formData?.email,
//           address: formData?.address,
//           subject: formData?.subject,
//           product: formData?.product,
//         };
//         apiEndpoint = `${process.env.REACT_APP_API_URL}/quotation/create-quotation/by-product`;
//       }

//       console?.log("Creating quotation with data:", quotationData);
//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON?.stringify(quotationData),
//       });

//       const responseData = await response?.json();
//       console?.log("Quotation creation response:", responseData);

//       if (!response?.ok || !responseData?.success) {
//         throw new Error(responseData?.message || "Failed to create quotation");
//       }

//       toast?.success("Quotation created successfully!");

//       const quotationId = responseData??.data??._id;
//       console?.log("Fetching complete quotation data for ID:", quotationId);

//       const quotationResponse = await fetch(
//         `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${quotationId}`
//       );

//       const completeQuotationData = await quotationResponse?.json();
//       console?.log("Complete quotation data received:", completeQuotationData);

//       if (!quotationResponse?.ok || !completeQuotationData?.success) {
//         throw new Error("Failed to fetch complete quotation data");
//       }

//       console?.log("=== DEBUGGING QUOTATION DATA ===");
//       console?.log(
//         "Full response:",
//         JSON?.stringify(completeQuotationData, null, 2)
//       );
//       console?.log("Data object:", completeQuotationData?.data);
//       console?.log("Product object:", completeQuotationData?.data??.product);
//       console?.log("Category object:", completeQuotationData?.data??.category);
//       console?.log("=== END DEBUGGING ===");

//       console?.log("Starting PDF generation...");
//       toast?.loading("Generating PDF...");

//       const dataToPass = completeQuotationData?.data;
//       console?.log("data to pass---------->>>>>>>>>>>>>>", dataToPass);
//       if (!dataToPass) {
//         throw new Error("No data found in quotation response");
//       }

//       if (!dataToPass?.product) {
//         console?.warn("Warning: No product data found in quotation");
//       }

//       await quotationPDF?.generatePDFWithJSPDF(dataToPass);

//       toast?.dismiss();
//       toast?.success("PDF downloaded successfully!");

//       handleCancel();
//       onClose();
//     } catch (error) {
//       console?.error("Error in handleSubmit:", error);
//       toast?.dismiss();
//       toast?.error(`Error: ${error?.message}`);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const features = [
//     {
//       icon: <Package className="w-6 h-6" />,
//       title: "Full Price Details of the Products?.",
//       description: "",
//     },
//     {
//       icon: <Image className="w-6 h-6" />,
//       title: "Product Images and Information with Details?.",
//       description: "",
//     },
//     {
//       icon: <Video className="w-6 h-6" />,
//       title: "Video Link of Each Product?.",
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
//             {features?.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 tracking-normal"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
//                     <div className="text-primaryColor">{feature?.icon}</div>
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-primaryColor font-semibold text-md leading-relaxed">
//                       {feature?.title}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
//           <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-4">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor rounded-lg flex items-center justify-center flex-shrink-0">
//               <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
//                 Enter Your Details and Download Free{" "}
//                 <span className="text-orange-500">Quotation !</span>
//               </h2>
//               <p className="text-gray-600 text-xs sm:text-sm mt-1">
//                 Enter your details, our team will get back to you soon?.
//               </p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
//               <h3 className="text-base font-semibold text-gray-700 mb-2 sm:mb-0">
//                 Quotation Type:
//               </h3>
//               <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => handleModeSwitch("detailed")}
//                   className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                     quotationMode === "detailed"
//                       ? "bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white shadow-sm"
//                       : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   Detailed Selection
//                 </button>
//                 <button
//                   onClick={() => handleModeSwitch("simple")}
//                   className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                     quotationMode === "simple"
//                       ? "bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white shadow-sm"
//                       : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   Quick Product Selection
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="lg:hidden mb-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
//               What you'll get:
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               {features?.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 rounded-lg p-3 border border-gray-100"
//                 >
//                   <div className="flex items-center gap-3 sm:flex-col sm:text-center">
//                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
//                       <div className="text-primaryColor scale-75 sm:scale-100">
//                         {feature?.icon}
//                       </div>
//                     </div>
//                     <h4 className="text-primaryColor font-medium text-sm sm:text-xs leading-tight">
//                       {feature?.title}
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
//                   value={formData?.fullName}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="mobNumber"
//                   placeholder="Mob Number"
//                   value={formData?.mobNumber}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData?.email}
//                   onChange={handleInputChange}
//                   placeholder="Email"
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   name="address"
//                   placeholder="Address"
//                   value={formData?.address}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
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
//                   value={formData?.subject}
//                   onChange={handleInputChange}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {quotationMode === "detailed" && (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                     <CustomDropdown
//                       label="Select Category"
//                       options={categories?.map((c) => ({
//                         value: c?._id,
//                         label: c?.name,
//                       }))}
//                       value={formData?.category}
//                       onChange={(val) => handleDropdownChange("category", val)}
//                       loading={loading}
//                     />
//                   </div>
//                   <div className="relative">
//                     <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                     <CustomDropdown
//                       label="Select Sub Category"
//                       options={subCategories?.map((s) => ({
//                         value: s?._id || s?.id,
//                         label: s?.name,
//                       }))}
//                       value={formData?.subCategory}
//                       onChange={(val) =>
//                         handleDropdownChange("subCategory", val)
//                       }
//                       disabled={!formData?.category}
//                       loading={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                     <CustomDropdown
//                       label="Select Sub-Sub Category"
//                       options={subSubCategories?.map((s) => ({
//                         value: s?._id,
//                         label: s?.name,
//                       }))}
//                       value={formData?.subSubCategory}
//                       onChange={(val) =>
//                         handleDropdownChange("subSubCategory", val)
//                       }
//                       disabled={!formData?.subCategory}
//                       loading={loading}
//                     />
//                   </div>
//                   <div className="relative">
//                     <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                     <CustomDropdown
//                       label="Select Product"
//                       options={products??.map((p) => ({
//                         value: p?._id,
//                         label: p?.name,
//                       }))}
//                       value={formData??.product}
//                       onChange={(val) => handleDropdownChange("product", val)}
//                       disabled={!formData?.subSubCategory}
//                       loading={loading}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {quotationMode === "simple" && (
//               <div className="w-full" ref={searchRef}>
//                 <div className="relative">
//                   <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
//                   <input
//                     type="text"
//                     placeholder="Search for products..."
//                     value={searchQuery}
//                     onChange={(e) => handleProductSearch(e?.target?.value)}
//                     onFocus={() => setShowSearchResults(searchQuery?.length > 0)}
//                     className="w-full pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
//                   />

//                   {showSearchResults && (
//                     <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
//                       {loading ? (
//                         <div className="px-4 py-3 text-gray-500 text-sm">
//                           Loading products...
//                         </div>
//                       ) : filteredProducts?.length > 0 ? (
//                         filteredProducts?.map((product) => (
//                           <div
//                             key={product?._id}
//                             className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
//                             onClick={() => handleProductSelect(product)}
//                           >
//                             <div className="font-medium text-sm sm:text-base">
//                               {product?.name}
//                             </div>
//                             {product?.description && (
//                               <div className="text-xs text-gray-500 mt-1 truncate">
//                                 {product?.description}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="px-4 py-3 text-gray-400 text-sm">
//                           No products found matching "{searchQuery}"
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {selectedProductName && (
//                   <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-primaryColor">
//                         Selected:{" "}
//                         <span className="font-medium">
//                           {selectedProductName}
//                         </span>
//                       </span>
//                       <button
//                         onClick={() => {
//                           setFormData({ ...formData, product: "" });
//                           setSelectedProductName("");
//                           setSearchQuery("");
//                         }}
//                         className="text-primaryColor hover:text-primaryColor text-sm"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
//               <button
//                 onClick={handleCancel}
//                 className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2?.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
//               >
//                 Cancel
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitLoading}
//                 className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2?.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

//   const selectedOption = options?.find((opt) => opt?.value === value);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
//         setOpen(false);
//       }
//     };
//     document?.addEventListener("mousedown", handleClickOutside);
//     return () => document?.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <div
//         className={`flex items-center justify-between border border-gray-300 rounded-lg pl-9 sm:pl-10 pr-4 py-2?.5 sm:py-3 text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
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
//             ? selectedOption?.label
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
//           {options?.length > 0 ? (
//             options?.map((opt) => (
//               <li
//                 key={opt?.value}
//                 className="px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 text-sm sm:text-base"
//                 onClick={() => {
//                   onChange(opt?.value);
//                   setOpen(false);
//                 }}
//               >
//                 {opt?.label}
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
