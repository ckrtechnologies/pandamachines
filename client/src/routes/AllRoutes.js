import Login from "../screens/nonAuth/Login";
import Register from "../screens/nonAuth/Register";
import Home from "../screens/users/Home";
import ForgotPassword from "../screens/nonAuth/ForgotPassword";
import Profile from "../screens/auth/Profile";
import BecomeSeller from "../screens/users/BecomeSeller";
import AboutUs from "../screens/users/AboutUs";
import ContactUs from "../screens/users/ContactUs";
import Categories from "../screens/users/Categories";
import Cart from "../screens/users/Cart";
import Checkout from "../screens/users/Checkout";
import Blogs from "../screens/users/Blogs";
import WishList from "../screens/users/WishList";
import UserOrders from "../screens/users/UserOrders";
import ProductsList from "../screens/users/ProductsList";
import BlogDetails from "../screens/users/BlogDetails";
import ProductDetails from "../screens/users/ProductDetails";
// import OrdersHistroy from "../screens/users/OrdersHistroy";
import ConsultGuidance from "../screens/users/ConsultGuidance";
import TechnicalOperator from "../screens/users/TechnicalOperator";
import GuidanceBookingConfirm from "../screens/users/GuidanceBookingConfirm";
import AdminCategories from "../screens/auth/Admins/AdminCategories";
import AdminSubCategories from "../screens/auth/Admins/AdminSubCategories";
import AdminDashboard from "../screens/auth/Admins/AdminDashboard";
import AdminOrders from "../screens/auth/Admins/AdminOrders";
import AdminCustomers from "../screens/auth/Admins/AdminCustomers";
import AdminSellers from "../screens/auth/Admins/AdminSellers";
import AppBanners from "../screens/auth/Admins/AppBanners";
import AdminBlogs from "../screens/auth/Admins/AdminBlogs";
import GiudanceBooking from "../screens/auth/Admins/GiudanceBooking";
import AdminProducts from "../screens/auth/Admins/AdminProducts";
import AddProducts from "../components/AdminSideComponents/Products/AddProducts";
import AdminProductDetails from "../components/AdminSideComponents/Products/AdminProductDetails";
import EditProduct from "../components/AdminSideComponents/Products/EditProduct";
import SavedAddresses from "../screens/users/SavedAddresses";
import AdminOrderDetails from "../components/AdminSideComponents/Order/AdminOrderDetails";
import CategoryDetails from "../components/AdminSideComponents/Category/CategoryDetails";
import OrderDetails from "../screens/users/OrderDetails";
import UserProfile from "../screens/users/UserProfile";
import UsersSearchResults from "../screens/users/UsersSearchResults";
import AdminSubSubCategory from "../components/AdminSideComponents/Sub-SubCategory/AdminSubSubCategory";
import EditGuideBooking from "../components/AdminSideComponents/GuidanceBooking/EditGuideBooking";
import GuidanceDetails from "../components/AdminSideComponents/GuidanceBooking/GuidanceDetails";
import EditSupplier from "../components/AdminSideComponents/Supplier/EditSupplier";
import SupplierDetails from "../components/AdminSideComponents/GuidanceBooking/SupplierDetails";
import SupplierProfile from "../screens/auth/Supplier/SupplierProfile";
import UpdateSupplier from "../components/Supplier/UpdateSupplier";
import SupplierCategories from "../screens/auth/Supplier/SupplierCategories";
import SupplierSubSubCategories from "../screens/auth/Supplier/SupplierSubSubCategories";
import SupplierProducts from "../screens/auth/Supplier/SupplierProducts";
import SupplierSubCategories from "../screens/auth/Supplier/SupplierSubCategories";
import SupplierDashboard from "../screens/auth/Supplier/SupplierDashboard";
import SupplierCategoryDetails from "../components/Supplier/SupplierCategory/SupplierCategoryDetails";
import AdminSubCategoryDetails from "../components/AdminSideComponents/Sub-category/AdminSubCategoryDetails";
import AdminSubSubCategoriesDetails from "../components/AdminSideComponents/Sub-SubCategory/AdminSubSubCategoriesDetails";
import SupplierSubCategoryDetails from "../components/Supplier/SupplierSubCategory/SupplierSubCategoryDetails";
import SupplierSubSubCategoryDetails from "../components/Supplier/SupplierSubSubCategory/SupplierSubSubCategoryDetails";
import AdminBlogDetails from "../components/AdminSideComponents/Blog/AdminBlogDetails";
import Offers from "../screens/users/Offers";
import AdminOffers from "../screens/auth/Admins/AdminOffers";
import AdminQuotation from "../screens/auth/Admins/AdminQuotation";
import QuotationDetails from "../components/AdminSideComponents/Quotation/QuotationDetails";
import UserBulkOrder from "../screens/users/UserBulOrder";
import AdminInquiry from "../components/AdminSideComponents/Admin-Inquiry/AdminInquiry";
import AdminChatBotInquiry from "../components/AdminSideComponents/Admin-Inquiry/AdminChatBotInquiry";
import TermsConditions from "../components/Policies/TermsConditions";
import PrivacyPolicy from "../components/Policies/PrivacyPolicy";
import ReturnCancellation from "../components/Policies/ReturnCancellation";
import ShippingPolicy from "../components/Policies/ShippingPolicy";

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
    path: "/all-chatbot-inquiries",
    component: <AdminChatBotInquiry />,
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
    path: "/about-us",
    component: <AboutUs />,
  },
  {
    path: "/contact-us",
    component: <ContactUs />,
  },
  {
    path: "/categories",
    component: <Categories />,
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
    path: "/technical-operator",
    component: <TechnicalOperator />,
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
