import { SectionHeader } from "../../components/Sections";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AssignmentsTab from "./tabs/AssignmentsTab";
import OrdersTab from "./tabs/OrdersTab";
import DriversTab from "./tabs/DriversTab";
import TrucksTab from "./tabs/TrucksTab";
import Decode from "jwt-decode";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 5 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function AdminDashboard() {
  const [value, setValue] = useState(0);
  const [decoded, setDecoded] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = Decode(token);
      setDecoded(decodedToken);
    }
  }, []);

  return (
    <main className="admin-dashboard" style={{ padding: "0 4rem" }}>
      <SectionHeader />
      <div className="admin-info">
        {decoded && (
          <>
            <h2>
              {decoded.first_name} {decoded.last_name}
            </h2>
            <h3>{decoded.position}</h3>
          </>
        )}
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Assignments" {...a11yProps(0)} />
          <Tab label="Orders" {...a11yProps(1)} />
          <Tab label="Drivers" {...a11yProps(2)} />
          <Tab label="Trucks" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AssignmentsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <OrdersTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DriversTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <TrucksTab />
      </CustomTabPanel>
    </main>
  );
}

export default AdminDashboard;
