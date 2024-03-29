import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { deleteTruck, getAllTrucks } from "../../../api";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Backdrop from "@mui/material/Backdrop";
import TruckEditForm from "../../../components/TruckEditFrom";
import ConfirmDelete from "../../../components/ConfirmDelete";
import Lottie from "lottie-react";
import Success from "../../../assets/success.json";
import Fail from "../../../assets/fail.json";
import TruckCreateForm from "../../../components/TruckCreateForm";

function TrucksTab() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    getTrucksData();
  }, []);

  async function getTrucksData() {
    try {
      setLoading(true);
      const response = await getAllTrucks();
      setTrucks(response.data);
    } catch (error) {
      console.error("Error fetching drivers data:", error);
    } finally {
      setLoading(false);
    }
  }

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

  // Render Status column as Chip component
  function renderStatus(params) {
    return (
      <Chip
        label={params.value}
        color={
          params.value === "in_use"
            ? "warning"
            : params.value === "available"
            ? "success"
            : "error"
        }
        size="small"
      />
    );
  }

  // Success alert function
  function handleAlertSuccess() {
    setAlertText("Upload Success!");
    setAlertType(Success);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3500);
  }

  // Fail alert function
  function handleAlertFail() {
    setAlertText("Upload Fail!");
    setAlertType(Fail);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3500);
  }

  // Open Edit Form
  function handleOpenEdit(row) {
    setOpenEdit(true);
    setSelectedRow(row);
  }

  // Close Edit Form
  function handleCloseEdit() {
    setOpenEdit(false);
  }

  // Open Confirm Delete
  function handleOpenConfirmDelete(row) {
    setOpenConfirmDelete(true);
    setSelectedRow(row);
  }

  // Close Confirm Delete
  function handleCloseConfirmDelete() {
    setOpenConfirmDelete(false);
  }

  // Confirm Delete
  async function handleConfirmDelete() {
    try {
      await deleteTruck(selectedRow.id);
      setDeleteSuccess(true);
      setTimeout(() => {
        handleCloseConfirmDelete();
        setTimeout(() => {
          getTrucksData();
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Delete Error:", error);
      handleCloseConfirmDelete();
    }
  }

  // Open Create Order Form
  function handleOpenCreate() {
    setOpenCreate(true);
  }

  // Close Create Order Form
  function handleCloseCreate() {
    setOpenCreate(false);
  }

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: renderCreatedAt,
    },
    { field: "reg_num", headerName: "Reg Number", width: 120 },
    { field: "capacity", headerName: "Capacity (L)", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: renderStatus,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleOpenConfirmDelete(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="tab">
      <div className="header">
        <Button
          variant="contained"
          disableElevation
          onClick={handleOpenCreate}
          startIcon={<AddIcon />}
        >
          ADD TRUCK
        </Button>
      </div>
      <div className="content">
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
          <>
            {/* Backdrop for create form */}
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={openCreate}
            >
              <TruckCreateForm
                closeForm={handleCloseCreate}
                refreshOrders={getTrucksData}
                alertSuccess={handleAlertSuccess}
                alertFail={handleAlertFail}
              />
            </Backdrop>
            {/* Backdrop for edit form */}
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={openEdit}
            >
              {selectedRow && (
                <TruckEditForm
                  closeForm={handleCloseEdit}
                  selectedRow={selectedRow}
                  refreshOrders={getTrucksData}
                  alertSuccess={handleAlertSuccess}
                  alertFail={handleAlertFail}
                />
              )}
            </Backdrop>
            {/* Backdrop for confirm delete */}
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              open={openConfirmDelete}
            >
              <ConfirmDelete
                closeConfirmDelete={handleCloseConfirmDelete}
                deleteSuccess={deleteSuccess}
                confirmDelete={handleConfirmDelete}
                stuff="truck"
              />
            </Backdrop>
            {/* Backdrop for alert animation */}
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              open={openAlert}
            >
              <Lottie animationData={alertType} />
              <h2>{alertText}</h2>
            </Backdrop>
            <DataGrid
              rows={trucks}
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
          </>
        )}
      </div>
    </div>
  );
}

export default TrucksTab;
