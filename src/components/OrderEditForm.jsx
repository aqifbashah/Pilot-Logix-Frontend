/* eslint-disable react/prop-types */
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { editOrder } from "../api";
import { useEffect, useState } from "react";

function OrderEditForm({
  closeForm,
  selectedRow,
  refreshOrders,
  alertSuccess,
  alertFail,
}) {
  const [pickupLoc, setPickupLoc] = useState(selectedRow.pickup_loc);
  const [dropoffLoc, setDropoffLoc] = useState(selectedRow.dropoff_loc);
  const [tripRate, setTripRate] = useState(selectedRow.trip_rate);

  // Update state when selectedRow prop changes
  useEffect(() => {
    setPickupLoc(selectedRow.pickup_loc);
    setDropoffLoc(selectedRow.dropoff_loc);
    setTripRate(selectedRow.trip_rate);
  }, [selectedRow]);

  const handlePickupLocChange = (event) => {
    setPickupLoc(event.target.value);
  };

  const handleDropoffLocChange = (event) => {
    setDropoffLoc(event.target.value);
  };

  const handleTripRateChange = (event) => {
    setTripRate(event.target.value);
  };

  // Submit order edit
  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries());
    const order_id = selectedRow.id;

    try {
      await editOrder(values, order_id);
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
        <h2>Order Edit Form</h2>
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
          label="Pickup Location"
          name="new_pickup_loc"
          value={pickupLoc}
          onChange={handlePickupLocChange}
          size="small"
        />
        <TextField
          label="Dropoff Location"
          name="new_dropoff_loc"
          value={dropoffLoc}
          onChange={handleDropoffLocChange}
          size="small"
        />
        <TextField
          label="Trip Rates"
          name="new_trip_rate"
          value={tripRate}
          onChange={handleTripRateChange}
          size="small"
        />
        <Button variant="contained" type="submit" disableElevation>
          Save
        </Button>
      </div>
    </form>
  );
}

export default OrderEditForm;
