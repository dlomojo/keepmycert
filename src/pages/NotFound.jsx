import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material UI components
import { Container } from "@mui/material";

// Icons
import { Home as HomeIcon } from "@mui/icons-material";

function NotFound() {
  return (
    <MKBox
      minHeight="100vh"
      width="100%"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "linear-gradient(to right bottom, #f5f7fa, #c3cfe2)",
        py: 15
      }}
    >
      <Container>
        <MKBox
          textAlign="center"
          py={10}
          px={3}
          bgcolor="rgba(255,255,255,0.8)"
          borderRadius="xl"
          boxShadow="lg"
          maxWidth="600px"
          mx="auto"
        >
          <MKTypography variant="h1" fontWeight="bold" color="error" mb={2}>
            404
          </MKTypography>
          <MKTypography variant="h2" fontWeight="bold" mb={2}>
            Page Not Found
          </MKTypography>
          <MKTypography variant="body1" color="text" mb={5}>
            The page you're looking for doesn't exist or has been moved.
          </MKTypography>
          <MKBox display="flex" justifyContent="center" gap={2}>
            <MKButton
              component={Link}
              to="/"
              variant="gradient"
              color="info"
              startIcon={<HomeIcon />}
            >
              Back to Home
            </MKButton>
            <MKButton
              component="a"
              href="mailto:support@keepmycert.com"
              variant="outlined"
              color="info"
            >
              Contact Support
            </MKButton>
          </MKBox>
          <MKBox mt={8}>
            <MKTypography variant="caption" color="text">
              If you believe this is an error, please contact our support team.
            </MKTypography>
          </MKBox>
        </MKBox>
      </Container>
    </MKBox>
  );
}

export default NotFound;