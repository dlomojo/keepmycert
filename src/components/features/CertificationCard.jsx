// src/components/features/CertificationCard.jsx
import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";
import MKButton from "@/components/MKButton";

// Material UI components
import { Card, CardContent, CardActions, Chip, Divider, LinearProgress } from "@mui/material";

// Icons
import { MoreVert as MoreIcon, AccessTime as TimeIcon } from "@mui/icons-material";

// Utilities
import { formatDate, getDaysUntilExpiry } from "@/utils/dateUtils";

function CertificationCard({ certification }) {
  // Calculate days until expiry
  const daysUntil = getDaysUntilExpiry(certification.expiryDate);
  
  // Determine status chip color
  let chipColor = "success";
  let statusText = "Active";
  
  if (daysUntil < 0) {
    chipColor = "error";
    statusText = "Expired";
  } else if (daysUntil <= 30) {
    chipColor = "warning";
    statusText = `${daysUntil} days left`;
  } else if (daysUntil <= 90) {
    chipColor = "info";
    statusText = `${daysUntil} days left`;
  }
  
  // Calculate progress percentage (inverse of time passed)
  const issueDate = new Date(certification.issueDate);
  const expiryDate = new Date(certification.expiryDate);
  const today = new Date();
  
  const totalDays = Math.floor((expiryDate - issueDate) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));
  
  const progressPercentage = Math.max(0, Math.min(100, 100 - (daysElapsed / totalDays * 100)));
  
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <MKBox mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Chip 
            label={statusText} 
            color={chipColor} 
            size="small" 
            sx={{ borderRadius: 1 }}
          />
          <MKTypography 
            variant="caption"
            display="flex"
            alignItems="center"
            color="text"
          >
            <TimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
            {formatDate(certification.expiryDate)}
          </MKTypography>
        </MKBox>
        
        <MKTypography variant="h5" fontWeight="bold" mb={1} noWrap>
          {certification.name}
        </MKTypography>
        
        <MKTypography variant="body2" color="text" mb={2}>
          {certification.provider}
        </MKTypography>
        
        <MKBox mb={2}>
          <MKTypography variant="caption" fontWeight="bold">
            Validity Progress
          </MKTypography>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            color={chipColor}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </MKBox>
        
        {certification.certNumber && (
          <MKTypography variant="caption" display="block" color="text">
            Certificate ID: {certification.certNumber}
          </MKTypography>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: "space-between" }}>
        <MKButton
          component={Link}
          to={`/dashboard/certificates/${certification.id}`}
          variant="text"
          color="info"
          size="small"
        >
          View Details
        </MKButton>
        <MKButton
          variant="text"
          color="secondary"
          size="small"
          iconOnly
        >
          <MoreIcon />
        </MKButton>
      </CardActions>
    </Card>
  );
}

export default CertificationCard;