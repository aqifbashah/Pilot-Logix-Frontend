import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllAssignments } from "../../../api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import AssignmentCard from "../../../components/AssignmentCards";
import Backdrop from "@mui/material/Backdrop";
import AssignmentCreateForm from "../../../components/AssignmentCreateForm";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

function AssignmentsTab() {
  const [value, setValue] = useState(dayjs());
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [openCreateAssignment, setOpenCreateAssignment] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getAssignmentsData() {
    try {
      setLoading(true);
      const response = await getAllAssignments();
      setAssignments(response.data);
      setFilteredAssignments(
        viewAll ? response.data : filterAssignmentsByDate(response.data, value)
      );
    } catch (error) {
      console.error("Error fetching assignments data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAssignmentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to filter assignments based on the selected date
  const filterAssignmentsByDate = (assignments, date) => {
    return assignments.filter((assignment) =>
      dayjs(assignment.assignment_date).isSame(date, "day")
    );
  };

  // Set to Filtered by Date or View All
  useEffect(() => {
    if (!viewAll) {
      const filtered = filterAssignmentsByDate(assignments, value);
      setFilteredAssignments(filtered);
    }
  }, [value, assignments, viewAll]);

  // Set the assignment by the date selected
  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (!viewAll) {
      const filtered = filterAssignmentsByDate(assignments, newValue);
      setFilteredAssignments(filtered);
    }
    setViewAll(false);
  };

  const handleOpenCreateAssignment = () => {
    setOpenCreateAssignment(true);
  };

  const handleCloseCreateAssignment = () => {
    setOpenCreateAssignment(false);
  };

  const handleRefreshAssignments = async () => {
    await getAssignmentsData();
  };

  // change time format
  function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  }

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 170,
      renderCell: renderCreatedAt,
    },
    {
      field: "assignment_date",
      headerName: "Assignment Date",
      width: 150,
      renderCell: renderDate,
    },
    {
      field: "admin_name",
      headerName: "Assigned by",
      width: 200,
      valueGetter: (params) => {
        return params.row.admin_first_name + " " + params.row.admin_last_name;
      },
    },
    {
      field: "driver1_name",
      headerName: "Driver 1",
      width: 200,
      valueGetter: (params) => {
        return params.row.d1_first_name + " " + params.row.d1_last_name;
      },
    },
    {
      field: "driver2_name",
      headerName: "Driver 2",
      width: 200,
      valueGetter: (params) => {
        return params.row.d2_first_name + " " + params.row.d2_last_name;
      },
    },
    {
      field: "driver3_name",
      headerName: "Driver 3",
      width: 200,
      valueGetter: (params) => {
        return params.row.d3_first_name + " " + params.row.d3_last_name;
      },
    },
    {
      field: "order_status",
      headerName: "Order Status",
      width: 120,
      renderCell: renderStatus,
    },
    { field: "order_id", headerName: "Order ID", width: 100 },
    { field: "pickup_loc", headerName: "Pickup Location", width: 200 },
    { field: "dropoff_loc", headerName: "Dropoff Location", width: 200 },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 100,
      renderCell: (params) => formatTime(params.value),
    },
    {
      field: "end_time",
      headerName: "End Time",
      width: 100,
      renderCell: (params) => formatTime(params.value),
    },
    { field: "truck_reg_num", headerName: "Truck Reg Number", width: 150 },
    { field: "capacity", headerName: "Truck Capacity (L)", width: 200 },
  ];

  // Render formated date for Created At column
  function renderCreatedAt(params) {
    const timestamp = new Date(params.value);
    const options = {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return timestamp.toLocaleString("en-US", options);
  }

  // Render formated date for assignment date column
  function renderDate(params) {
    const timestamp = new Date(params.value);
    const options = {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return timestamp.toLocaleString("en-US", options);
  }

  // Render Status column as Chip component
  function renderStatus(params) {
    return (
      <Chip
        label={params.value}
        color={
          params.value === "pending"
            ? "default"
            : params.value === "in_progress"
            ? "warning"
            : "success"
        }
        size="small"
      />
    );
  }

  return (
    <div className="assignment-tab">
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
        open={openCreateAssignment}
      >
        <AssignmentCreateForm
          closeForm={handleCloseCreateAssignment}
          assignments={assignments}
          refreshAssignment={handleRefreshAssignments}
        />
      </Backdrop>
      <div className="assignment-header">
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Date"
                value={value}
                onChange={handleDateChange}
                format="DD-MM-YYYY"
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button
            variant="text"
            size="small"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Filter by Date" : "View All"}
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            size="large"
            disableElevation
            style={{ margin: 20 }}
            onClick={handleOpenCreateAssignment}
          >
            Create Assignment
          </Button>
        </div>
      </div>
      <div className="cards-container">
        {loading ? ( // Display CircularProgress if loading is true
          <>
            <CircularProgress color="inherit" />
            <h2>Loading...</h2>
          </>
        ) : (
          // Render Assignment Cards when not loading
          <>
            {viewAll ? (
              <DataGrid
                rows={assignments}
                columns={columns}
                sx={{ width: "100%", backgroundColor: "white" }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "assignment_date", sort: "desc" }],
                  },
                }}
                localeText={{
                  toolbarDensity: "Size",
                  toolbarDensityLabel: "Size",
                  toolbarDensityCompact: "Small",
                  toolbarDensityStandard: "Medium",
                  toolbarDensityComfortable: "Large",
                }}
                slots={{
                  toolbar: GridToolbar,
                }}
                checkboxSelection
                disableRowSelectionOnClick
              />
            ) : (
              filteredAssignments.map((assignments) => (
                <AssignmentCard
                  key={assignments.id}
                  assignments={assignments}
                  refreshAssignment={handleRefreshAssignments}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AssignmentsTab;
