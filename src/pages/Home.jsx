import {
  navToAdminLogin,
  navToDriverLogin,
} from "../components/navigationUtils";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import adminIcon from "../assets/admin.png";
import driverIcon from "../assets/driver.png";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div>
        <img src={logo} alt="Logo White" className="authLogo" />
      </div>
      <div>
        <div className="admin-container">
          <div
            className="admin-button"
            onClick={navToAdminLogin(navigate)}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "rgb(202, 242, 255)";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "lightblue";
            }}
          >
            <img src={adminIcon} alt="admin icon" />
          </div>
          <h1>ADMIN</h1>
        </div>
        <div className="driver-container">
          <div
            className="driver-button"
            onClick={navToDriverLogin(navigate)}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "rgb(255, 253, 157)";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "rgb(238, 236, 144)";
            }}
          >
            <img src={driverIcon} alt="driver icon" />
          </div>
          <h1>DRIVER</h1>
        </div>
      </div>
    </main>
  );
}

export default Home;
