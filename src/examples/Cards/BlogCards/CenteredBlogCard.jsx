import { Card, CardContent, Avatar } from "@mui/material";
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";

function CenteredBlogCard({ image, title, description, action }) {
  return (
    <Card sx={{ maxWidth: 300, textAlign: "center", p: 2 }}>
      <CardContent>
        <MKBox mb={2}>
          <Avatar sx={{ width: 80, height: 80, mx: "auto", bgcolor: "primary.main" }}>
            {title?.charAt(0)}
          </Avatar>
        </MKBox>
        <MKTypography variant="h6" mb={1}>
          {title}
        </MKTypography>
        <MKTypography variant="body2" color="text" mb={2}>
          {description}
        </MKTypography>
        {action && (
          <MKTypography variant="caption" color="primary">
            {action.label}
          </MKTypography>
        )}
      </CardContent>
    </Card>
  );
}

export default CenteredBlogCard;