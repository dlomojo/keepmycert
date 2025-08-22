import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "@/components/MKBox";
import MKTypography from "@/components/MKTypography";
import MKButton from "@/components/MKButton";

// Material UI components
import { Card, CardContent, Grid } from "@mui/material";

// Icons
import { Add as AddIcon, Lightbulb as LightbulbIcon } from "@mui/icons-material";

function DashboardWelcomeCard() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        overflow: "hidden",
        mb: 3
      }}
    >
      <Grid container>
        <Grid item xs={12} md={8}>
          <CardContent sx={{ py: 4, px: { xs: 3, md: 5 } }}>
            <MKTypography variant="h4" fontWeight="bold" mb={2}>
              Welcome to KeepMyCert! 👋
            </MKTypography>
            <MKTypography variant="body1" mb={3}>
              Start by adding your first certification to track expiry dates and receive automatic renewal reminders.
            </MKTypography>
            
            <MKButton
              component={Link}
              to="/dashboard/certificates/new"
              variant="gradient"
              color="info"
              startIcon={<AddIcon />}
              sx={{ mb: 3 }}
            >
              Add Your First Certification
            </MKButton>
            
            <MKBox>
              <MKTypography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" mb={1}>
                <LightbulbIcon fontSize="small" sx={{ mr: 1, color: "warning.main" }} />
                Pro Tips:
              </MKTypography>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>
                  <MKTypography variant="body2">
                    Add all your active certifications to see them in one place
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body2">
                    Upload certification evidence for easy access
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body2">
                    Set expiry dates to receive timely renewal reminders
                  </MKTypography>
                </li>
              </ul>
            </MKBox>
          </CardContent>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={4} 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            backgroundColor: 'primary.light',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MKBox
            component="img"
            src="/images/welcome-illustration.svg"
            alt="Welcome illustration"
            width="80%"
            maxWidth="240px"
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default DashboardWelcomeCard;