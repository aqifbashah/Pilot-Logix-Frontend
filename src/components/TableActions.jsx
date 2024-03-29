import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function EditActions() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <div>
      {success ? ( 
      <IconButton aria-label="edit" color="primary">
        <EditIcon />
      </IconButton>):() }

    </div>
  );
}

export default EditActions;
