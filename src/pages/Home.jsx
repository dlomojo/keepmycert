// src/pages/Home.jsx
import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import MKAvatar from "components/MKAvatar";

// Material Kit 2 React examples
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";

// Images
import bgImage from "assets/images/bg-hero.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center"
        }}
      >
        <MKBox
          bgcolor="rgba(255,255,255,0.8)"
          borderRadius="lg"
          p={4}
          mx={2}
          mb={6}
          textAlign="center"
        >
          <MKTypography
            variant="h1"
            color="text"
            mb={1}
          >
            Never miss a certification renewal again
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            mb={3}
          >
            Track all your IT certifications in one place and get automated reminders when they're about to expire.
          </MKTypography>
          <MKBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <MKButton
              component={Link}
              to="/auth/register"
              variant="gradient"
              color="info"
              size="large"
            >
              Get Started
            </MKButton>
            <MKButton
              component={Link}
              to="/pricing"
              variant="outlined"
              color="info"
              size="large"
            >
              View Pricing
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>

      {/* Features Section */}
      <MKBox component="section" py={6}>
        <MKBox
          variant="gradient"
          bgColor="white"
          shadow="lg"
          borderRadius="lg"
          p={2}
          mx={{ xs: 2, lg: 3 }}
          mt={-16}
        >
          <MKBox container spacing={3} justifyContent="center" py={6}>
            <MKTypography variant="h3" mb={5} textAlign="center">
              Key Features
            </MKTypography>
            <MKBox
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={4}
              px={{ xs: 2, lg: 8 }}
            >
              <DefaultInfoCard
                icon="notifications_active"
                title="Smart Reminders"
                description="Get timely notifications before certifications expire, so you're never caught off guard."
              />
              <DefaultInfoCard
                icon="cloud_upload"
                title="Certificate Storage"
                description="Securely store your certification PDFs and access them anywhere, anytime."
              />
              <DefaultInfoCard
                icon="analytics"
                title="Expiry Dashboard"
                description="Get a clear view of upcoming renewals with our intuitive dashboard."
              />
              <DefaultInfoCard
                icon="auto_awesome"
                title="AI-Powered Insights"
                description="Receive intelligent recommendations for your certification journey."
              />
              <DefaultInfoCard
                icon="group"
                title="Team Management"
                description="Track and manage certifications for your entire team or organization."
              />
              <DefaultInfoCard
                icon="currency_exchange"
                title="Cost Tracking"
                description="Track certification costs and budget for upcoming renewals."
              />
            </MKBox>
          </MKBox>
        </MKBox>
      </MKBox>

      {/* Testimonials Section */}
      <MKBox component="section" py={6} bgcolor="light">
        <MKBox textAlign="center" mb={4}>
          <MKTypography variant="h3">Trusted by IT Professionals</MKTypography>
        </MKBox>
        <MKBox
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}
          px={{ xs: 2, lg: 8 }}
        >
          <CenteredBlogCard
            image={team1}
            title="Sarah Johnson"
            description="'KeepMyCert saved me from letting my AWS certifications expire. The reminders are perfectly timed!'"
            action={{ type: "internal", route: "#", label: "Network Engineer" }}
          />
          <CenteredBlogCard
            image={team2}
            title="Michael Chen"
            description="'Managing certs for my entire team used to be a nightmare. This platform made it simple and stress-free.'"
            action={{ type: "internal", route: "#", label: "IT Director" }}
          />
          <CenteredBlogCard
            image={team3}
            title="Jessica Williams"
            description="'The dashboard gives me a perfect overview of what's coming up. No more spreadsheets or calendar reminders!'"
            action={{ type: "internal", route: "#", label: "Security Specialist" }}
          />
        </MKBox>
      </MKBox>

      {/* CTA Section */}
      <MKBox component="section" py={12} textAlign="center">
        <MKTypography variant="h2" mb={3}>
          Ready to take control of your certifications?
        </MKTypography>
        <MKTypography variant="body1" color="text" mb={6} px={6} mx="auto" maxWidth="800px">
          Join thousands of IT professionals who trust KeepMyCert to manage their certification lifecycle.
          Start with our free plan today.
        </MKTypography>
        <MKButton
          component={Link}
          to="/auth/register"
          variant="gradient"
          color="info"
          size="large"
        >
          Get Started Now
        </MKButton>
      </MKBox>
    </>
  );
}

export default Home;