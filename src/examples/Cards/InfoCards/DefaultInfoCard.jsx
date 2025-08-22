import { Card, CardContent } from "@mui/material";
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";

function DefaultInfoCard({ icon, title, description }) {
  return (
    <Card sx={{ maxWidth: 300, textAlign: "center", p: 2 }}>
      <CardContent>
        <MKBox mb={2}>
          <MKTypography variant="h4" color="primary">
            {icon}
          </MKTypography>
        </MKBox>
        <MKTypography variant="h6" mb={1}>
          {title}
        </MKTypography>
        <MKTypography variant="body2" color="text">
          {description}
        </MKTypography>
      </CardContent>
    </Card>
  );
}

export default DefaultInfoCard;