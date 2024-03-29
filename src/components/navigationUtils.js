export const isAuthenticated = () => {
  // Check if the authentication token exists in localStorage or sessionStorage
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token; // Returns true if token exists, false otherwise
};

export const navToHome = (navigate) => () => {
  navigate("/");
};

// ADMIN

export const navToAdminLogin = (navigate) => () => {
  navigate("/login/admin");
};

export const navToAdminRegister = (navigate) => () => {
  navigate("/register/admin");
};

export const navToAdminDashboard = (navigate) => () => {
  navigate("/admin/dashboard");
};

// DRIVER

export const navToDriverLogin = (navigate) => () => {
  navigate("/login/driver");
};

export const navToDriverRegister = (navigate) => () => {
  navigate("/register/driver");
};

export const navToDriverDashboard = (navigate) => () => {
  navigate("/driver/dashboard");
};
