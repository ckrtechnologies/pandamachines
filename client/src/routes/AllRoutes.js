import Login from "../screens/nonAuth/Login";
import Register from "../screens/nonAuth/Register";
import Dashboard from "../screens/auth/Dashboard";
import Home from "../screens/users/Home";
import About from "../screens/users/About";
import Contact from "../screens/users/Contact";
import ForgotPassword from "../screens/nonAuth/ForgotPassword";
import Booking from "../screens/auth/Booking";
import Profile from "../screens/auth/Profile";
import BecomeSeller from "../screens/users/BecomeSeller";
import AboutUs from "../screens/users/AboutUs";
import ContactUs from "../screens/users/ContactUs";

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
    path: "/about",
    component: <About />,
  },
  {
    path: "/contact",
    component: <Contact />,
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
];
