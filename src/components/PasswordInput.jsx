/* eslint-disable react/prop-types */
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleBlur = () => {
    if (props.validatePassword) {
      props.validatePassword();
    }
  };

  const handleChange = (event) => {
    props.onChange(event); // Pass the event up to parent component for updating the state
    if (props.validatePassword) {
      props.validatePassword(); // Perform validation on the fly
    }
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      error={props.error}
      color={props.color}
    >
      <InputLabel htmlFor="outlined-adornment-password">
        {props.label}
      </InputLabel>
      <OutlinedInput
        name={props.name}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label}
        value={props.value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormControl>
  );
}
