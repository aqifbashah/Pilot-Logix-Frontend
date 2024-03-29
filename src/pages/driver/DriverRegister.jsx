import { navToDriverLogin, navToHome } from "../../components/navigationUtils";
import { useNavigate } from "react-router-dom";
import { registerDriver } from "../../api";
import { useState, useEffect } from "react";
import { PasswordInput } from "../../components/PasswordInput";
import logo from "../../assets/logo.png";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function DriverRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [icNum, setIcNum] = useState("");
  const [salary, setSalary] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [open, setOpen] = useState(false);

  // Backdrop loading to wait for server
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to check if all form fields are filled
  const isFormFilled = () => {
    return (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      icNum &&
      salary
    );
  };

  // Function to handle password match
  function validatePassword() {
    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    console.log("Form Data:", values);

    try {
      const response = await registerDriver(values);
      console.log("Register Response:", response.data);
      handleClose();
      setShowAlert({
        severity: "success",
        message: "Registered successfully.",
      });
      setTimeout(() => {
        navToDriverLogin(navigate)();
      }, 1000);
    } catch (error) {
      console.error("Registration Error:", error);
      setShowAlert({
        severity: "error",
        message: `Registration failed. ${error.response.data.message}`,
      });
      handleClose();
    }
  }

  // Update formFilled state when any input changes
  useEffect(() => {
    setFormFilled(isFormFilled());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName, email, password, confirmPassword, icNum, salary]);

  return (
    <main className="auth">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <img src={logo} alt="Logo White" className="authLogo" />
      </div>
      <div className="form-container">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={navToHome(navigate)}
          color="secondary"
        >
          Back
        </Button>
        <form onSubmit={handleSubmit} className="authForm">
          <h3>Driver Register</h3>
          <div>
            <TextField
              id="first_name"
              name="first_name"
              label="First Name"
              variant="outlined"
              size="small"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              color="secondary"
            />
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name"
              variant="outlined"
              size="small"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              color="secondary"
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              size="small"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              color="secondary"
            />
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={passwordError}
              required
              color="secondary"
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              validatePassword={validatePassword}
              error={passwordError}
              required
              color="secondary"
            />
            <TextField
              id="icNum"
              name="ic_num"
              label="Identification Card Number"
              variant="outlined"
              type="number"
              size="small"
              required
              value={icNum}
              onChange={(event) => setIcNum(event.target.value)}
              color="secondary"
            />
            <TextField
              id="salary"
              name="salary"
              label="Salary (RM)"
              variant="outlined"
              type="number"
              size="small"
              required
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              color="secondary"
            />
            <Button
              variant="contained"
              type="submit"
              disableElevation
              disabled={!formFilled}
              color="secondary"
              onClick={handleOpen}
            >
              Register
            </Button>{" "}
            {showAlert && (
              <Alert
                severity={showAlert.severity}
                onClose={() => setShowAlert(null)}
              >
                {showAlert.message}
              </Alert>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default DriverRegister;
