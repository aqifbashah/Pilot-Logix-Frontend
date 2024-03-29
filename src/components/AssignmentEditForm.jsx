/* eslint-disable react/prop-types */
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { editAssignment } from "../api";
import dayjs from "dayjs";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

function AssignmentEditForm({
  assignments,
  handleCancelEdit,
  setIsEditing,
  refreshAssignment,
}) {
  const [showAlert, setShowAlert] = useState(null);
  const [value, setValue] = useState(dayjs(assignments.assignment_date));
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  async function handleSaveEdit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    // Convert date to YYYY-MM-DD format
    const newValue = dayjs(values.new_assignment_date, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    values.new_assignment_date = newValue;

    console.log(values);
    try {
      await editAssignment(values, assignments.id);
      handleClose();
      setShowAlert({ severity: "success", message: "Saved successfully." });
      setTimeout(() => {
        setShowAlert(null);
        setIsEditing(false);
        refreshAssignment();
      }, 1000);
    } catch (error) {
      handleClose();
      setShowAlert({
        severity: "error",
        message: `Save failed. ${error}`,
      });
      setTimeout(() => {
        setShowAlert(null);
      }, 2000);
    }
  }

  return (
    <div className="assignment-edit-form">
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
        <h2>Saving...</h2>
      </Backdrop>
      <form onSubmit={handleSaveEdit}>
        <div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Date"
                  name="new_assignment_date"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  format="DD-MM-YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              label="Truck ID"
              name="new_truck_id"
              defaultValue={assignments.truck_id}
              size="small"
            />
          </div>
          <div>
            <TextField
              label="Driver 1 ID"
              name="new_driver1_id"
              defaultValue={assignments.driver1_id}
              size="small"
            />
            <TextField
              label="Driver 2 ID"
              name="new_driver2_id"
              defaultValue={assignments.driver2_id}
              size="small"
            />
            <TextField
              label="Driver 3 ID"
              name="new_driver3_id"
              defaultValue={assignments.driver3_id}
              size="small"
            />
          </div>
          <div>
            <TextField
              label="Order ID"
              name="new_order_id"
              defaultValue={assignments.order_id}
              size="small"
            />
          </div>
        </div>
        <div>
          <Button
            variant="outlined"
            onClick={handleCancelEdit}
            color="error"
            disableElevation
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={handleOpen}
            disableElevation
            size="small"
          >
            Save
          </Button>
        </div>
      </form>
      {showAlert && (
        <Alert severity={showAlert.severity} onClose={() => setShowAlert(null)}>
          {showAlert.message}
        </Alert>
      )}
    </div>
  );
}

export default AssignmentEditForm;
