// src/components/common/PageHeader.jsx
import { useNavigate } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";
import MKButton from "@/components/MKButton";

// Icons
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

function PageHeader({ 
  title, 
  subtitle, 
  actions, 
  showBackButton = false, 
  backPath = -1, 
  backText = "Back" 
}) {
  const navigate = useNavigate();
  
  return (
    <MKBox mb={3}>
      <MKBox 
        display="flex" 
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={2}
      >
        <MKBox>
          {showBackButton && (
            <MKButton
              variant="text"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(backPath)}
              sx={{ mb: 1 }}
            >
              {backText}
            </MKButton>
          )}
          <MKTypography variant="h4" fontWeight="bold">
            {title}
          </MKTypography>
          {subtitle && (
            <MKTypography variant="body2" color="text">
              {subtitle}
            </MKTypography>
          )}
        </MKBox>
        
        {actions && (
          <MKBox 
            display="flex" 
            gap={2}
            flexWrap="wrap"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            width={{ xs: "100%", md: "auto" }}
          >
            {actions}
          </MKBox>
        )}
      </MKBox>
    </MKBox>
  );
}

export default PageHeader;