/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { uploadTrucks } from "../api";

function TruckCreateForm({
  closeForm,
  alertSuccess,
  alertFail,
  refreshOrders,
}) {
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());

    console.log(values);
    try {
      await uploadTrucks(values);
      console.log("Successfully created an order");
      refreshOrders();
      alertSuccess();
    } catch (error) {
      console.error("Error creating a truck", error);
      alertFail();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <h2>Create Truck</h2>
        <IconButton
          aria-label="delete"
          size="large"
          disableElevation
          onClick={closeForm}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div>
        <TextField
          label="Reg Number"
          name="truck_reg_num"
          size="small"
          fullWidth
        />
        <TextField label="Capacity" name="capacity" size="small" fullWidth />
        <FormControl size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="status"
            value={status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value={"available"}>Available</MenuItem>
            <MenuItem value={"in_use"}>In Use</MenuItem>
            <MenuItem value={"maintenance"}>Maintenance</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" type="submit" disableElevation>
          Create
        </Button>
      </div>
    </form>
  );
}

export default TruckCreateForm;
