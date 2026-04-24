import Profile from "../screens/auth/Profile";
import ForgotPassword from "../screens/nonAuth/ForgotPassword";
import Login from "../screens/nonAuth/Login";
import Register from "../screens/nonAuth/Register";
import AboutUs from "../screens/users/AboutUs";
import BecomeSeller from "../screens/users/BecomeSeller";
import BlogDetails from "../screens/users/BlogDetails";
import Blogs from "../screens/users/Blogs";
import Cart from "../screens/users/Cart";
import Categories from "../screens/users/Categories";
import Checkout from "../screens/users/Checkout";
import ContactUs from "../screens/users/ContactUs";
import Home from "../screens/users/Home";
import ProductDetails from "../screens/users/ProductDetails";
import ProductsList from "../screens/users/ProductsList";
import UserOrders from "../screens/users/UserOrders";
import WishList from "../screens/users/WishList";
// import OrdersHistroy from "../screens/users/OrdersHistroy";
import AdminChatBotInquiry from "../components/AdminSideComponents/Admin-Inquiry/AdminChatBotInquiry";
import AdminInquiry from "../components/AdminSideComponents/Admin-Inquiry/AdminInquiry";
import AdminBlogDetails from "../components/AdminSideComponents/Blog/AdminBlogDetails";
import AdminCarousels from "../components/AdminSideComponents/Carousel/AdminCarousels";
import CategoryDetails from "../components/AdminSideComponents/Category/CategoryDetails";
import ChatBotChat from "../components/AdminSideComponents/Chat/ChatBotChat";
import ChatInquiries from "../components/AdminSideComponents/Chat/ChatInquiries";
import AdminGrievances from "../components/AdminSideComponents/Grievances/AdminGrievances";
import EditGuideBooking from "../components/AdminSideComponents/GuidanceBooking/EditGuideBooking";
import GuidanceDetails from "../components/AdminSideComponents/GuidanceBooking/GuidanceDetails";
import SupplierDetails from "../components/AdminSideComponents/GuidanceBooking/SupplierDetails";
import AdminOrderDetails from "../components/AdminSideComponents/Order/AdminOrderDetails";
import AddProducts from "../components/AdminSideComponents/Products/AddProducts";
import AdminProductDetails from "../components/AdminSideComponents/Products/AdminProductDetails";
import ApprovalProdectDetail from "../components/AdminSideComponents/Products/ApprovalProdectDetail";
import EditProduct from "../components/AdminSideComponents/Products/EditProduct";
import QuotationDetails from "../components/AdminSideComponents/Quotation/QuotationDetails";
import AdminSubCategoryDetails from "../components/AdminSideComponents/Sub-category/AdminSubCategoryDetails";
import AdminSubSubCategoriesDetails from "../components/AdminSideComponents/Sub-SubCategory/AdminSubSubCategoriesDetails";
import AdminSubSubCategory from "../components/AdminSideComponents/Sub-SubCategory/AdminSubSubCategory";
import EditSupplier from "../components/AdminSideComponents/Supplier/EditSupplier";
import PrivacyPolicy from "../components/Policies/PrivacyPolicy";
import ReturnCancellation from "../components/Policies/ReturnCancellation";
import ShippingPolicy from "../components/Policies/ShippingPolicy";
import TermsConditions from "../components/Policies/TermsConditions";
import SupplierCategoryDetails from "../components/Supplier/SupplierCategory/SupplierCategoryDetails";
import SupplierSubCategoryDetails from "../components/Supplier/SupplierSubCategory/SupplierSubCategoryDetails";
import SupplierSubSubCategoryDetails from "../components/Supplier/SupplierSubSubCategory/SupplierSubSubCategoryDetails";
import UpdateSupplier from "../components/Supplier/UpdateSupplier";
import AdminAddQuotation from "../screens/auth/Admins/AdminAddQuotation";
import AdminBlogs from "../screens/auth/Admins/AdminBlogs";
import AdminCategories from "../screens/auth/Admins/AdminCategories";
import AdminCustomers from "../screens/auth/Admins/AdminCustomers";
import AdminDashboard from "../screens/auth/Admins/AdminDashboard";
import AdminOffers from "../screens/auth/Admins/AdminOffers";
import AdminOrders from "../screens/auth/Admins/AdminOrders";
import AdminProducts from "../screens/auth/Admins/AdminProducts";
import AdminQuotation from "../screens/auth/Admins/AdminQuotation";
import AdminSellers from "../screens/auth/Admins/AdminSellers";
import AdminSubCategories from "../screens/auth/Admins/AdminSubCategories";
import AdminTechnician from "../screens/auth/Admins/AdminTechnician";
import AppBanners from "../screens/auth/Admins/AppBanners";
import GiudanceBooking from "../screens/auth/Admins/GiudanceBooking";
import ProductApprove from "../screens/auth/Admins/ProductApprove";
import StaffManagement from "../screens/auth/Admins/StaffManagement";
import SupplierCategories from "../screens/auth/Supplier/SupplierCategories";
import SupplierDashboard from "../screens/auth/Supplier/SupplierDashboard";
import SupplierProducts from "../screens/auth/Supplier/SupplierProducts";
import SupplierProfile from "../screens/auth/Supplier/SupplierProfile";
import SupplierSubCategories from "../screens/auth/Supplier/SupplierSubCategories";
import SupplierSubSubCategories from "../screens/auth/Supplier/SupplierSubSubCategories";
import MobileCategoryPage from "../screens/users/Category/MobileCategoryPage";
import ConsultGuidance from "../screens/users/ConsultGuidance";
import GuidanceBookingConfirm from "../screens/users/GuidanceBookingConfirm";
import Offers from "../screens/users/Offers";
import OrderDetails from "../screens/users/OrderDetails";
import SavedAddresses from "../screens/users/SavedAddresses";
import SellerRegister from "../screens/users/SellerRegister";
import TechnicalOperator from "../screens/users/TechnicalOperator";
import UserBulkOrder from "../screens/users/UserBulOrder";
import UserProfile from "../screens/users/UserProfile";
import UserProfileMenu from "../screens/users/UserProfileMenu";
import UserQuotation from "../screens/users/UserQuotation";
import UsersSearchResults from "../screens/users/UsersSearchResults";
import MobileSubCategoryPage from "../screens/users/Category/MobileSubCategoryPage";
import MobileProductsPage from "../screens/users/Category/MobileProductsPage";
import CategoriesLayout from "../layouts/CategoriesLayout";
import ProductBulkUpload from "../components/AdminSideComponents/Products/ProductBulkUpload";
export const authRoutes = [
  {
    path: "/dashboard",
    component: <AdminDashboard />,
  },
  {
    path: "/admin-categories",
    component: <AdminCategories />,
  },
  {
    path: "/admin-sub-categories",
    component: <AdminSubCategories />,
  },
  {
    path: "/admin-sub-sub-categories",
    component: <AdminSubSubCategory />,
  },
  {
    path: "/admin-products",
    component: <AdminProducts />,
  },
  {
    path: "/add-products",
    component: <AddProducts />,
  },
  {
    path: "/bulk-products",
    component: <ProductBulkUpload />,
  },
  {
    path: "/edit-products/:id",
    component: <EditProduct />,
  },
  {
    path: "/admin-orders",
    component: <AdminOrders />,
  },
  {
    path: "/admin-customers",
    component: <AdminCustomers />,
  },
  {
    path: "/admin-sellers",
    component: <AdminSellers />,
  },
  {
    path: "/admin-technician",
    component: <AdminTechnician />,
  },
  {
    path: "/profile",
    component: <Profile />,
  },
  {
    path: "/app-banners",
    component: <AppBanners />,
  },
  {
    path: "/admin-blogs",
    component: <AdminBlogs />,
  },
  {
    path: "/admin-crousels",
    component: <AdminCarousels />,
  },
  {
    path: "/admin-offers",
    component: <AdminOffers />,
  },
  {
    path: "/admin-quotations",
    component: <AdminQuotation />,
  },
  {
    path: "/admin-quotation-details/:id",
    component: <QuotationDetails />,
  },
  {
    path: "/admin-add-quotation",
    component: <AdminAddQuotation />,
    noSidebar: true,
  },
  {
    path: "/admin-edit-quotation/:id",
    component: <AdminAddQuotation />,
    noSidebar: true,
  },
  {
    path: "/admin-blog-details/:id",
    component: <AdminBlogDetails />,
  },
  {
    path: "/admin-guidance-booking",
    component: <GiudanceBooking />,
  },
  {
    path: "/product-details/:id",
    component: <AdminProductDetails />,
  },
  {
    path: "/approval-product-details/:id",
    component: <ApprovalProdectDetail />,
  },
  {
    path: "/admin-order-details/:id",
    component: <AdminOrderDetails />,
  },
  {
    path: "/admin-category-details/:id",
    component: <CategoryDetails />,
  },
  {
    path: "/admin-subcategory-details/:id",
    component: <AdminSubCategoryDetails />,
  },
  {
    path: "/admin-sub-subcategory-details/:id",
    component: <AdminSubSubCategoriesDetails />,
  },
  {
    path: "/edit-guide-booking/:id",
    component: <EditGuideBooking />,
  },
  {
    path: "/guidance-details/:id",
    component: <GuidanceDetails />,
  },
  {
    path: "/admin-edit-supplier/:id",
    component: <EditSupplier />,
  },
  {
    path: "/admin-supplier-details/:id",
    component: <SupplierDetails />,
  },
  {
    path: "/supplier-categories",
    component: <SupplierCategories />,
  },
  {
    path: "/supplier-sub-categories",
    component: <SupplierSubCategories />,
  },
  {
    path: "/supplier-category-details/:id",
    component: <SupplierCategoryDetails />,
  },
  {
    path: "/supplier-sub-category-details/:id",
    component: <SupplierSubCategoryDetails />,
  },
  {
    path: "/supplier-sub-sub-category-details/:id",
    component: <SupplierSubSubCategoryDetails />,
  },
  {
    path: "/supplier-tier3-categories",
    component: <SupplierSubSubCategories />,
  },
  {
    path: "/supplier-products",
    component: <SupplierProducts />,
  },
  {
    path: "/supplier-profile",
    component: <SupplierProfile />,
  },
  {
    path: "/supplier-dashboard",
    component: <SupplierDashboard />,
  },
  {
    path: "/edit-supplier/:id",
    component: <UpdateSupplier />,
  },
  {
    path: "/admin-inquiry",
    component: <AdminInquiry />,
  },
  {
    path: "/admin-grievances",
    component: <AdminGrievances />,
  },

  {
    path: "/all-chatbot-inquiries",
    component: <AdminChatBotInquiry />,
  },
  {
    path: "/product-approve",
    component: <ProductApprove />,
  },
  {
    path: "/admin-chatbot-chat",
    component: <ChatBotChat />,
  },
  {
    path: "/admin-staff-management",
    component: <StaffManagement />,
  },
  {
    path: "/admin-chatbot-inquiries",
    component: <ChatInquiries />,
  },
];

export const nonAuthRoutes = [
  {
    path: "/admin-login",
    component: <Login />,
  },
  {
    path: "/register",
    component: <Register />,
  },
  {
    path: "/forgot-password",
    component: <ForgotPassword />,
  },
];

export const userRoutes = [
  {
    path: "/",
    component: <Home />,
  },

  {
    path: "/become-seller",
    component: <BecomeSeller />,
  },
  {
    path: "/become-seller/register",
    component: <SellerRegister />,
  },
  {
    path: "/about-us",
    component: <AboutUs />,
  },
  {
    path: "/contact-us",
    component: <ContactUs />,
  },

  {
    path: "/categories",
    component: <CategoriesLayout />,
  },
  {
    path: "/subcategory/:subCategoryId",
    component: <MobileSubCategoryPage />,
  },
  {
    path: "/products",
    component: <MobileProductsPage />,
  },
  {
    path: "/my-carts",
    component: <Cart />,
  },
  {
    path: "/checkout",
    component: <Checkout />,
  },
  {
    path: "/blogs",
    component: <Blogs />,
  },
  {
    path: "/offers",
    component: <Offers />,
  },
  {
    path: "/join-technician",
    component: <TechnicalOperator />,
  },
  {
    path: "/wishlist",
    component: <WishList />,
  },
  {
    path: "/user-orders",
    component: <UserOrders />,
  },
  {
    path: "/bulk-orders",
    component: <UserBulkOrder />,
  },
  {
    path: "/order-details/:orderId",
    component: <OrderDetails />,
  },
  {
    path: "/user-profile",
    component: <UserProfileMenu />, // NEW PAGE
  },
  {
    path: "/user-quotation",
    component: <UserQuotation />,
  },
  {
    path: "/user-profile-details",
    component: <UserProfile />,
  },
  {
    path: "/products-list/:id",
    component: <ProductsList />,
  },
  {
    path: "/user-product-details/:id",
    component: <ProductDetails />,
  },
  {
    path: "/blog-details/:id",
    component: <BlogDetails />,
  },
  // {
  //   path: "/orders-history",
  // component: <OrdersHistroy />,
  // },
  {
    path: "/consult-guidance",
    component: <ConsultGuidance />,
  },

  {
    path: "/guidance-booking-confirm",
    component: <GuidanceBookingConfirm />,
  },
  {
    path: "/saved-addresses",
    component: <SavedAddresses />,
  },
  {
    path: "/products-search-results/:searchItems",
    component: <UsersSearchResults />,
  },
  // {
  //   path: "/supplier-register",
  //   component: <SupplierRegister />,
  // },

  {
    path: "/terms-conditions",
    component: <TermsConditions />,
  },
  {
    path: "/privacy-policy",
    component: <PrivacyPolicy />,
  },
  {
    path: "/return-cancellation",
    component: <ReturnCancellation />,
  },
  {
    path: "/shipping-policy",
    component: <ShippingPolicy />,
  },
];
