import logo from "../../assets/logo.png";
import { useState } from "react";
import {
  navToAdminDashboard,
  navToAdminRegister,
  navToHome,
} from "../../components/navigationUtils";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../../components/PasswordInput";
import { loginAdmin } from "../../api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function AdminLogin() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    console.log("Form Data:", values);

    try {
      const response = await loginAdmin(values);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setTimeout(() => {
        handleClose();
        setShowAlert({
          severity: "success",
          message: "Logged in successfully.",
        });
        setTimeout(() => {
          navToAdminDashboard(navigate)();
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);
      setShowAlert({
        severity: "error",
        message: "Login failed. Please check your credentials and try again.",
      });
      handleClose();
    }
  }

  return (
    <main className="auth">
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        <h2>Logging in...</h2>
      </Backdrop>
      <div>
        <img src={logo} alt="Logo White" className="authLogo" />
      </div>
      <div className="form-container">
        <Button startIcon={<ArrowBackIcon />} onClick={navToHome(navigate)}>
          Back
        </Button>
        <form onSubmit={handleSubmit} className="authForm">
          <h3>Admin Login</h3>
          <div>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              size="small"
            />
            <PasswordInput name="password" label="Password" />
            <Button
              variant="contained"
              type="submit"
              disableElevation
              onClick={handleOpen}
            >
              Login
            </Button>
            <Button onClick={navToAdminRegister(navigate)}>
              Register New Admin
            </Button>
          </div>
        </form>
      </div>
      {showAlert && (
        <Alert severity={showAlert.severity} onClose={() => setShowAlert(null)}>
          {showAlert.message}
        </Alert>
      )}
    </main>
  );
}

export default AdminLogin;
