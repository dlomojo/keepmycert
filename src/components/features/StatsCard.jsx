// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material UI components
import { Card, CardContent } from "@mui/material";

/**
 * Dashboard statistic card component
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {number} props.count - Statistic count
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {'primary'|'secondary'|'info'|'success'|'warning'|'error'} props.color - Color theme
 * @param {string} props.subtitle - Optional subtitle text
 * @returns {JSX.Element}
 */
function StatsCard({ title, count, icon, color = "primary", subtitle }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ height: "100%", p: 3 }}>
        <MKBox
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <MKBox display="flex" alignItems="center" mb={2}>
            <MKBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="56px"
              height="56px"
              borderRadius="lg"
              sx={{ 
                backgroundColor: `${color}.light`,
                color: `${color}.main`
              }}
              mr={2}
            >
              {icon}
            </MKBox>
            <MKBox>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                {title}
              </MKTypography>
            </MKBox>
          </MKBox>
          
          <MKBox>
            <MKTypography variant="h3" fontWeight="bold">
              {count}
            </MKTypography>
            {subtitle && (
              <MKTypography variant="caption" fontWeight="regular" color="text">
                {subtitle}
              </MKTypography>
            )}
          </MKBox>
        </MKBox>
      </CardContent>
    </Card>
  );
}

export default StatsCard;