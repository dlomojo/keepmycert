import { forwardRef } from "react";
import { Button } from "@mui/material";

const MKButton = forwardRef(({ 
  color = "primary", 
  variant = "contained", 
  size = "medium",
  circular = false,
  iconOnly = false,
  children,
  sx,
  ...rest 
}, ref) => {
  const buttonSx = {
    borderRadius: circular ? "50%" : "0.5rem",
    textTransform: "none",
    fontWeight: 600,
    minWidth: iconOnly ? "auto" : undefined,
    width: iconOnly ? "40px" : undefined,
    height: iconOnly ? "40px" : undefined,
    padding: iconOnly ? "8px" : undefined,
    ...sx,
  };

  return (
    <Button
      {...rest}
      ref={ref}
      color={color}
      variant={variant}
      size={size}
      sx={buttonSx}
    >
      {children}
    </Button>
  );
});

MKButton.displayName = "MKButton";

export default MKButton;