import logo from "../../assets/logo.png";
import {
  navToDriverDashboard,
  navToDriverRegister,
  navToHome,
} from "../../components/navigationUtils";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import { PasswordInput } from "../../components/PasswordInput";
import { loginDriver } from "../../api";

function DriverLogin() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    console.log("Form Data:", values);

    try {
      const response = await loginDriver(values);
      console.log("Login Response:", response.data);

      const token = response.data.token;
      localStorage.setItem("token", token);
      alert("Logged in successfully");
      navToDriverDashboard(navigate)();
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <main className="auth">
      <div>
        <img src={logo} alt="Logo White" className="authLogo" />
      </div>
      <div className="form-container">
        <Button
          startIcon={<ArrowBackIcon />}
          color="secondary"
          onClick={navToHome(navigate)}
        >
          Back
        </Button>
        <form onSubmit={handleSubmit} className="authForm">
          <h3>Driver Login</h3>
          <div>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              color="secondary"
              size="small"
            />
            <PasswordInput name="password" label="Password" color="secondary" />
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              disableElevation
            >
              Login
            </Button>
            <Button onClick={navToDriverRegister(navigate)} color="secondary">
              Register New Driver
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default DriverLogin;
