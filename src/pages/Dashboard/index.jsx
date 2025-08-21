// src/pages/Dashboard/index.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKAvatar from "components/MKAvatar";

// Material UI components
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Chip,
  LinearProgress,
  Alert
} from "@mui/material";

// Icons
import {
  Add as AddIcon,
  DateRange as DateRangeIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";

// Hooks and services
import { useCertifications } from "hooks/useCertifications";

// Components
import CertificationCard from "components/features/CertificationCard";
import DashboardWelcomeCard from "components/features/DashboardWelcomeCard";
import StatsCard from "components/features/StatsCard";

function Dashboard() {
  const { certifications, loading, error } = useCertifications();
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    expiringSoon: 0,
    expired: 0,
    active: 0
  });

  useEffect(() => {
    if (certifications) {
      // Calculate stats
      const total = certifications.length;
      const expired = certifications.filter(cert => 
        new Date(cert.expiryDate) < new Date()
      ).length;
      const expiringSoon = certifications.filter(cert => {
        const expiryDate = new Date(cert.expiryDate);
        const today = new Date();
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 90;
      }).length;
      const active = total - expired;

      setStats({
        total,
        expiringSoon,
        expired,
        active
      });

      // Set upcoming renewals
      const upcoming = certifications
        .filter(cert => new Date(cert.expiryDate) > new Date())
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 5);
      setUpcomingRenewals(upcoming);
    }
  }, [certifications]);

  if (loading) {
    return (
      <MKBox p={3}>
        <MKTypography variant="h6" mb={2}>Loading your dashboard...</MKTypography>
        <LinearProgress color="info" />
      </MKBox>
    );
  }

  if (error) {
    return (
      <MKBox p={3}>
        <Alert severity="error">
          Error loading your certifications. Please try again later.
        </Alert>
      </MKBox>
    );
  }

  return (
    <MKBox p={3}>
      <MKBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <MKTypography variant="h4">Dashboard</MKTypography>
        <MKButton
          component={Link}
          to="/dashboard/certificates/new"
          variant="gradient"
          color="info"
          startIcon={<AddIcon />}
        >
          Add Certificate
        </MKButton>
      </MKBox>

      {/* Welcome card or stats for returning users */}
      {certifications.length === 0 ? (
        <DashboardWelcomeCard />
      ) : (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Certifications"
              count={stats.total}
              icon={<DateRangeIcon fontSize="large" />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active"
              count={stats.active}
              icon={<CheckIcon fontSize="large" />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Expiring Soon"
              count={stats.expiringSoon}
              icon={<WarningIcon fontSize="large" />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Expired"
              count={stats.expired}
              icon={<TimeIcon fontSize="large" />}
              color="error"
            />
          </Grid>
        </Grid>
      )}

      {/* Upcoming renewals */}
      {upcomingRenewals.length > 0 && (
        <MKBox mb={3}>
          <MKTypography variant="h5" mb={2}>
            Upcoming Renewals
          </MKTypography>
          <Grid container spacing={3}>
            {upcomingRenewals.map((cert) => (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <CertificationCard certification={cert} />
              </Grid>
            ))}
          </Grid>
        </MKBox>
      )}

      {/* Recent activity or additional content */}
      <MKBox>
        <MKTypography variant="h5" mb={2}>
          Recent Activity
        </MKTypography>
        <Card>
          <CardContent>
            <MKTypography variant="body2">
              {certifications.length === 0 
                ? "You haven't added any certifications yet. Get started by adding your first certification."
                : "Your certification tracking is up to date. Next renewal coming up in 45 days."}
            </MKTypography>
          </CardContent>
        </Card>
      </MKBox>
    </MKBox>
  );
}

export default Dashboard;