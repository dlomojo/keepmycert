import { AppBar, Toolbar } from "@mui/material";
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";
import MKButton from "@/components/MKButton";

function DefaultNavbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MKTypography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          KeepMyCert
        </MKTypography>
        <MKBox display="flex" gap={2}>
          <MKButton variant="text" color="primary">
            Features
          </MKButton>
          <MKButton variant="text" color="primary">
            Pricing
          </MKButton>
          <MKButton variant="contained" color="primary">
            Sign In
          </MKButton>
        </MKBox>
      </Toolbar>
    </AppBar>
  );
}

export default DefaultNavbar;