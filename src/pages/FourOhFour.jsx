import Lottie from "lottie-react";
import ForOFor from "../assets/404.json";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { navToHome } from "../components/navigationUtils";

function FourOhFour() {
  const navigate = useNavigate();
  return (
    <div className="four-oh-four">
      <Lottie animationData={ForOFor} />
      <div>
        <h1>Whoops...Page not found</h1>
        <Button
          variant="contained"
          sx={{ borderRadius: 5 }}
          onClick={navToHome(navigate)}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default FourOhFour;
