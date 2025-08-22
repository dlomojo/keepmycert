import { Box } from "@mui/material";
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";

function DefaultFooter() {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, backgroundColor: "#f5f5f5" }}>
      <MKBox textAlign="center">
        <MKTypography variant="body2" color="text">
          © 2024 KeepMyCert. All rights reserved.
        </MKTypography>
      </MKBox>
    </Box>
  );
}

export default DefaultFooter;