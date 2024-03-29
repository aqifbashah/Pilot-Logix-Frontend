/* eslint-disable react/prop-types */
import { useState } from "react";
import { deleteAssignment } from "../api";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentEditForm from "./AssignmentEditForm";
import Backdrop from "@mui/material/Backdrop";
import ConfirmDelete from "./ConfirmDelete";

function getColorForStatus(status) {
  switch (status) {
    case "pending":
      return "default";
    case "in_progress":
      return "default";
    case "completed":
      return "success";
    default:
      return "default";
  }
}

function getTextForStatus(status) {
  switch (status) {
    case "pending":
      return "PENDING";
    case "in_progress":
      return "IN PROGRESS";
    case "completed":
      return "COMPLETED";
    default:
      return "default";
  }
}

// change time format
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}

function AssignmentCard({ assignments, refreshAssignment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  async function handleConfirmDelete() {
    try {
      await deleteAssignment(assignments.id);
      setDeleteSuccess(true);
      setTimeout(() => {
        handleCloseConfirmDelete();
        setTimeout(() => {
          refreshAssignment();
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Delete Error:", error);
      handleCloseConfirmDelete();
    }
  }

  return (
    <Card
      key={assignments.id}
      variant="outlined"
      className="assignment-card"
      sx={{ width: "100%", borderRadius: 4 }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        open={openConfirmDelete || deleteSuccess} // Show backdrop for confirmation or delete success
      >
        <ConfirmDelete
          deleteSuccess={deleteSuccess}
          closeConfirmDelete={handleCloseConfirmDelete}
          confirmDelete={handleConfirmDelete}
          stuff="assignment"
        />
      </Backdrop>
      <div className="card-header">
        <h3>Assignment {assignments.id}</h3>
        <Chip
          label={getTextForStatus(assignments.order_status)}
          color={getColorForStatus(assignments.order_status)}
          size="small"
          sx={{ width: 150 }}
        />
      </div>
      {isEditing ? (
        <AssignmentEditForm
          assignments={assignments}
          handleCancelEdit={handleCancelEdit}
          setIsEditing={setIsEditing}
          refreshAssignment={refreshAssignment}
        />
      ) : (
        <div>
          <div className="card-content">
            <div>
              <h4>
                Assignment Date:
                {dayjs(assignments.assignment_date).format("DD-MM-YYYY")}
              </h4>
              <h4>
                Driver 1: {assignments.d1_first_name} {assignments.d1_last_name}
              </h4>
              <h4>
                Driver 2:{" "}
                {assignments.d2_first_name
                  ? `${assignments.d2_first_name} ${assignments.d2_last_name}`
                  : "N/A"}
              </h4>
              <h4>
                Driver 3:{" "}
                {assignments.d3_first_name
                  ? `${assignments.d3_first_name} ${assignments.d3_last_name}`
                  : "N/A"}
              </h4>
            </div>
            <div>
              <h4>Truck Reg Number: {assignments.truck_reg_num}</h4>
              <h4>Order ID: {assignments.order_id}</h4>
              <h4>Pickup Location: {assignments.pickup_loc}</h4>
              <h4>Dropoff Location: {assignments.dropoff_loc}</h4>
            </div>
            <div>
              <h4>Start Time: {formatTime(assignments.start_time)}</h4>
              <h4>End Time: {formatTime(assignments.end_time)}</h4>
            </div>
          </div>
          <div className="card-footer">
            <div>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                disableElevation
                size="small"
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                disableElevation
                size="small"
                color="error"
                onClick={handleOpenConfirmDelete}
              >
                Delete
              </Button>
            </div>
            <div>
              <h4>
                Assigned by: {assignments.admin_first_name}{" "}
                {assignments.admin_last_name}
              </h4>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AssignmentCard;
