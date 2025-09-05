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
import OrdersHistroy from "../screens/users/OrdersHistroy";
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
    path: "/wishlist",
    component: <WishList />,
  },
  {
    path: "/user-orders",
    component: <UserOrders />,
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
    path: "/blog-details",
    component: <BlogDetails />,
  },
  {
    path: "/orders-history",
    component: <OrdersHistroy />,
  },
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
];
