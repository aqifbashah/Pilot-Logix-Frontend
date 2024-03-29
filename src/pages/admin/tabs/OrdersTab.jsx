import { useState, useEffect } from "react";
import { deleteOrder, getAllOrders, uploadOrders } from "../../../api";
import { styled } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Papa from "papaparse";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import OrderEditForm from "../../../components/OrderEditForm";
import ConfirmDelete from "../../../components/ConfirmDelete";
import Lottie from "lottie-react";
import Success from "../../../assets/success.json";
import Fail from "../../../assets/fail.json";
import OrderCreateForm from "../../../components/OrderCreateForm";

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    getOrdersData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: renderCreatedAt,
    },
    { field: "pickup_loc", headerName: "Pickup Location", width: 250 },
    { field: "dropoff_loc", headerName: "Dropoff Location", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: renderStatus,
    },
    { field: "trip_rate", headerName: "Trip Rate", width: 120 },
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

  // change time format
  function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
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

  // Open Create Order Form
  function handleOpenCreate() {
    setOpenCreate(true);
  }

  // Close Create Order Form
  function handleCloseCreate() {
    setOpenCreate(false);
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
      await deleteOrder(selectedRow.id);
      setDeleteSuccess(true);
      setTimeout(() => {
        handleCloseConfirmDelete();
        setTimeout(() => {
          getOrdersData();
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Delete Error:", error);
      handleCloseConfirmDelete();
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

  // Styled component to visually hide the file input
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Get orders data from server
  async function getOrdersData() {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Upload csv orders using papaparse
  async function handleUploadOrders(event) {
    const file = event.target.files[0];
    setLoading(true);

    // Use papaparse to parse the uploaded CSV file
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const filteredData = result.data.filter(
          (item) => item.pickup_loc && item.dropoff_loc && item.trip_rate
        );

        const transformedData = filteredData.map((item) => ({
          pickup_loc: item.pickup_loc,
          dropoff_loc: item.dropoff_loc,
          trip_rate: parseInt(item.trip_rate),
        }));

        async function uploadValues() {
          const values = {
            orders: transformedData,
          };
          try {
            await uploadOrders(values);
            console.log("Successfully uploaded all orders");
            setTimeout(() => {
              getOrdersData();
              handleAlertSuccess();
              setLoading(false);
            }, 1000);
          } catch (error) {
            console.error("Error uploading orders", error);
            setTimeout(() => {
              getOrdersData();
              handleAlertFail();
              setLoading(false);
            }, 1000);
          }
        }

        uploadValues();
      },
      error: (error) => {
        console.error("Error parsing file:", error);
        handleAlertFail();
        setLoading(false);
      },
    });
  }

  return (
    <div className="tab">
      <div className="header">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          disableElevation
        >
          Upload Order file
          <VisuallyHiddenInput type="file" onChange={handleUploadOrders} />
        </Button>
        <Button
          variant="outlined"
          disableElevation
          onClick={handleOpenCreate}
          startIcon={<AddIcon />}
        >
          ADD ORDER
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
              <OrderCreateForm
                closeForm={handleCloseCreate}
                refreshOrders={getOrdersData}
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
                <OrderEditForm
                  selectedRow={selectedRow}
                  closeForm={handleCloseEdit}
                  refreshOrders={getOrdersData}
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
                stuff="order"
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
              rows={orders}
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

export default OrdersTab;
