/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createAssignment } from "../api";

function AssignmentCreateForm({ closeForm, refreshAssignment }) {
  const [value, setValue] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  async function handleCreateAssignment(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    // Convert date to YYYY-MM-DD format
    const newValue = dayjs(values.assignment_date, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    values.assignment_date = newValue;

    console.log("Form Data", values);
    try {
      await createAssignment(values);
      setTimeout(() => {
        handleClose();
        setShowAlert({
          severity: "success",
          message: "Successfully created assignment.",
        });
        setTimeout(() => {
          setShowAlert(null);
          closeForm();
          refreshAssignment();
        }, 1000);
      }, 1000);
    } catch (error) {
      console.log("Error creating assignment", error);
      setTimeout(() => {
        handleClose();
        setShowAlert({
          severity: "error",
          message: "Create assignment failed",
        });
        setTimeout(() => {
          setShowAlert(null);
        }, 1000);
      }, 1000);
    }
  }

  return (
    <div className="create-assignment-container">
      <div>
        <IconButton
          aria-label="delete"
          size="large"
          disableElevation
          onClick={closeForm}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>
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
        <h2>Creating...</h2>
      </Backdrop>
      <h2>Create Assignment</h2>
      <form onSubmit={handleCreateAssignment}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date"
              name="assignment_date"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="DD-MM-YYYY"
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField label="Driver 1 ID" name="driver1_id" size="small" />
        <TextField label="Driver 2 ID" name="driver2_id" size="small" />
        <TextField label="Driver 3 ID" name="driver3_id" size="small" />
        <TextField label="Order ID" name="order_id" size="small" />
        <TextField label="Truck ID" name="truck_id" size="small" />
        <Button
          variant="contained"
          type="submit"
          disableElevation
          onClick={handleOpen}
        >
          Create Assignment
        </Button>
        {showAlert && (
          <Alert
            severity={showAlert.severity}
            onClose={() => setShowAlert(null)}
          >
            {showAlert.message}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default AssignmentCreateForm;
