import Login from "../screens/nonAuth/Login";
import Register from "../screens/nonAuth/Register";
import Dashboard from "../screens/auth/Dashboard";
import Home from "../screens/users/Home";
import ForgotPassword from "../screens/nonAuth/ForgotPassword";
import Booking from "../screens/auth/Booking";
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

export const authRoutes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
  },
  {
    path: "/bookings",
    component: <Booking />,
  },
  {
    path: "/profile",
    component: <Profile />,
  },
];

export const nonAuthRoutes = [
  {
    path: "/login",
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
    path: "/products-list",
    component: <ProductsList />,
  },
  {
    path: "/product-details",
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
];
