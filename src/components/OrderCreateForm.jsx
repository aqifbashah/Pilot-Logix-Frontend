/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { uploadOrders } from "../api";

function OrderCreateForm({
  closeForm,
  alertSuccess,
  alertFail,
  refreshOrders,
}) {
  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const formData = Object.fromEntries(data.entries());

    const values = {
      orders: [formData],
    };
    console.log(values);
    try {
      await uploadOrders(values);
      console.log("Successfully created an order");
      refreshOrders();
      alertSuccess();
    } catch (error) {
      console.error("Error creating an order", error);
      alertFail();
    }
  }
  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <h2>Create Order</h2>
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
        <TextField label="Pickup Location" name="pickup_loc" size="small" />
        <TextField label="Dropoff Location" name="dropoff_loc" size="small" />
        <TextField label="Trip Rates" name="trip_rate" size="small" />
        <Button variant="contained" type="submit" disableElevation>
          Create
        </Button>
      </div>
    </form>
  );
}

export default OrderCreateForm;
