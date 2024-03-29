import { useEffect, useState } from "react";
import { getAllAssignments, getAllDrivers } from "../../../api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

function DriversTab() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  async function getDriversData(date) {
    try {
      setLoading(true);
      const driversResponse = await getAllDrivers();
      const assignmentsResponse = await getAllAssignments();

      const assignmentsMap = new Map();
      assignmentsResponse.data.forEach((assignment) => {
        const driverIds = [
          assignment.driver1_id,
          assignment.driver2_id,
          assignment.driver3_id,
        ];
        driverIds.forEach((driverId) => {
          if (!assignmentsMap.has(driverId)) {
            assignmentsMap.set(driverId, []);
          }
          assignmentsMap.get(driverId).push(assignment);
        });
      });

      const todayDate = date.format("YYYY-MM-DD");

      const driversWithStatus = driversResponse.data.map((driver) => {
        const assignments = assignmentsMap.get(driver.id) || [];
        const isAssigned = assignments.some((assignment) => {
          const assignmentDate = dayjs(assignment.assignment_date).format(
            "YYYY-MM-DD"
          );
          return todayDate === assignmentDate;
        });
        return {
          ...driver,
          status: isAssigned ? "assigned" : "available",
          assignments,
        };
      });

      setDrivers(driversWithStatus);
    } catch (error) {
      console.error("Error fetching drivers data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDriversData(selectedDate);
  }, [selectedDate]);

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

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: renderCreatedAt,
    },
    { field: "first_name", headerName: "First Name", width: 200 },
    { field: "last_name", headerName: "Last Name", width: 200 },
    { field: "ic_num", headerName: "IC Number", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: renderStatus,
    },
  ];

  function renderStatus(params) {
    return (
      <Chip
        label={params.value}
        color={params.value === "available" ? "success" : "warning"}
        size="small"
      />
    );
  }

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <div className="driver-tab">
      <div className="driver-header">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD-MM-YYYY"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="driver-content">
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10%",
            }}
          >
            <CircularProgress color="inherit" />
            <h2>Loading...</h2>
          </div>
        ) : (
          <DataGrid
            rows={drivers}
            columns={columns}
            sx={{ backgroundColor: "white" }}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
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
        )}
      </div>
    </div>
  );
}

export default DriversTab;
