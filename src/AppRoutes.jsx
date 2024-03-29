import { isAuthenticated } from "./components/navigationUtils";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import DriverLogin from "./pages/driver/DriverLogin";
import DriverRegister from "./pages/driver/DriverRegister";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import { Navigate } from "react-router-dom";
import FourOhFour from "./pages/FourOhFour";

export const routes = [
  {
    path: "*",
    element: <FourOhFour />,
  },
  {
    path: "/",
    element: <Home />,
  },

  // login route
  {
    path: "/login/admin",
    element: <AdminLogin />,
  },
  {
    path: "/login/driver",
    element: <DriverLogin />,
  },

  // register route
  {
    path: "/register/admin",
    element: <AdminRegister />,
  },
  {
    path: "/register/driver",
    element: <DriverRegister />,
  },

  // ADMIN
  {
    path: "/admin/dashboard",
    element: isAuthenticated() ? <AdminDashboard /> : <Navigate to="/" />,
  },

  // DRIVER
  {
    path: "/driver/dashboard",
    element: <DriverDashboard />,
  },
];
