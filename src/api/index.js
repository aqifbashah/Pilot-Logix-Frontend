import axios from "axios";

const token = localStorage.getItem("token");

const API = axios.create({
  baseURL: "https://pilot-logix.onrender.com",
});

export function loginAdmin(data) {
  return API.post("/admin/login", data);
}

export function loginDriver(data) {
  return API.post("/driver/login", data);
}

export function registerAdmin(data) {
  return API.post("/admin/register", data);
}

export function registerDriver(data) {
  return API.post("/driver/register", data);
}

// Assignments

export function getAllAssignments() {
  return API.get("/assignment/get-all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function editAssignment(values, assignment_id) {
  return API.post(`/assignment/edit/${assignment_id}`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteAssignment(assignment_id) {
  return API.delete(`/assignment/delete/${assignment_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createAssignment(values) {
  return API.post("/assignment/create", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Orders

export function getAllOrders() {
  return API.get("/order/get-all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadOrders(values) {
  return API.post("/order/upload", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function editOrder(values, order_id) {
  return API.post(`/order/edit/${order_id}`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteOrder(order_id) {
  return API.delete(`/order/delete/${order_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Drivers

export function getAllDrivers() {
  return API.get("/driver/get-all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Trucks

export function getAllTrucks() {
  return API.get("/truck/get-all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteTruck(truck_id) {
  return API.delete(`/truck/delete/${truck_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function editTruck(values, truck_id) {
  return API.post(`/truck/edit/${truck_id}`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadTrucks(values) {
  return API.post("/truck/register", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
