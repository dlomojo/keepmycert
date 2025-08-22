import { forwardRef } from "react";
import { Avatar } from "@mui/material";

const MKAvatar = forwardRef(({ 
  bgColor = "transparent",
  size = "md",
  shadow = "none",
  sx,
  ...rest 
}, ref) => {
  const sizes = {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 56, height: 56 },
    xl: { width: 72, height: 72 },
    xxl: { width: 96, height: 96 },
  };

  const avatarSx = {
    backgroundColor: bgColor,
    ...sizes[size],
    boxShadow: shadow !== "none" ? `0 4px 6px rgba(0, 0, 0, 0.1)` : "none",
    ...sx,
  };

  return (
    <Avatar
      {...rest}
      ref={ref}
      sx={avatarSx}
    />
  );
});

MKAvatar.displayName = "MKAvatar";

export default MKAvatar;