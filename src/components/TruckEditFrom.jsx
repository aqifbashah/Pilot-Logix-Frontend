/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { editTruck } from "../api";

function TruckEditForm({
  closeForm,
  selectedRow,
  alertSuccess,
  alertFail,
  refreshOrders,
}) {
  const [regNum, setRegNum] = useState(selectedRow.reg_num);
  const [capacity, setCapacity] = useState(selectedRow.capacity);

  // Update state when selectedRow prop changes
  useEffect(() => {
    setRegNum(selectedRow.reg_num);
    setCapacity(selectedRow.capacity);
  }, [selectedRow]);

  const handleRegNumChange = (event) => {
    setRegNum(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };

  // Submit truck edit
  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());
    const truck_id = selectedRow.id;

    try {
      await editTruck(values, truck_id);
      alertSuccess();
      refreshOrders();
      closeForm();
    } catch (error) {
      console.error("Error at saving edit", error);
      alertFail();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <h2>Truck Edit Form</h2>
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
          name="new_reg_num"
          value={regNum}
          onChange={handleRegNumChange}
          size="small"
        />
        <TextField
          label="Capacity"
          name="new_capacity"
          value={capacity}
          onChange={handleCapacityChange}
          size="small"
        />
        <Button variant="contained" type="submit" disableElevation>
          Save
        </Button>
      </div>
    </form>
  );
}

export default TruckEditForm;
