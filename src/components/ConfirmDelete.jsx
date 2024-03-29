/* eslint-disable react/prop-types */
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Button from "@mui/material/Button";

function ConfirmDelete({
  deleteSuccess,
  closeConfirmDelete,
  confirmDelete,
  stuff,
}) {
  return (
    <div className="confirm-delete">
      {deleteSuccess ? ( // If deletion was successful, display success message
        <>
          <div>
            <ErrorOutlineOutlinedIcon style={{ fontSize: "3rem" }} />
            <h3>Delete Successful</h3>
          </div>
        </>
      ) : (
        // If confirmation is required, display confirmation message and buttons
        <>
          <div>
            <ErrorOutlineOutlinedIcon style={{ fontSize: "3rem" }} />
            <h3>Confirm delete this {stuff}?</h3>
          </div>
          <div>
            <Button
              variant="outlined"
              color="error"
              onClick={closeConfirmDelete}
              disableElevation
            >
              No
            </Button>
            <Button
              variant="contained"
              color="error"
              disableElevation
              onClick={confirmDelete}
            >
              Yes
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ConfirmDelete;
