import { forwardRef } from "react";
import { TextField } from "@mui/material";

const MKInput = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  <TextField
    {...rest}
    ref={ref}
    variant="outlined"
    error={error}
    disabled={disabled}
    sx={{
      "& .MuiOutlinedInput-root": {
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : "transparent",
        fontSize: "0.875rem",
        borderRadius: "0.5rem",
        "& fieldset": {
          borderColor: error ? "error.main" : success ? "success.main" : "rgba(0, 0, 0, 0.23)",
        },
        "&:hover fieldset": {
          borderColor: error ? "error.main" : success ? "success.main" : "rgba(0, 0, 0, 0.87)",
        },
        "&.Mui-focused fieldset": {
          borderColor: error ? "error.main" : success ? "success.main" : "primary.main",
        },
      },
      "& .MuiInputLabel-root": {
        fontSize: "0.875rem",
        color: error ? "error.main" : success ? "success.main" : "text.secondary",
        "&.Mui-focused": {
          color: error ? "error.main" : success ? "success.main" : "primary.main",
        },
      },
    }}
  />
));

MKInput.displayName = "MKInput";

export default MKInput;