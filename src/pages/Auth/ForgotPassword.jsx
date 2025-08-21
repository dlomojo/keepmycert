import { useState } from "react";
import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Material UI components
import {
  Card,
  CardContent,
  Alert,
  AlertTitle
} from "@mui/material";

// Icons
import { 
  Email as EmailIcon, 
  ArrowBack as ArrowBackIcon 
} from "@mui/icons-material";

// Hooks
import { useAuth } from "contexts/AuthContext";

// Form validation
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required")
}).required();

function ForgotPassword() {
  const { resetPassword, loading, error } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  // React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  // Handle password reset
  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      setSuccessMessage("Password reset email sent! Check your inbox for further instructions.");
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  return (
    <MKBox
      minHeight="100vh"
      width="100%"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa"
      }}
    >
      <MKBox
        px={2}
        width="100%"
        maxWidth="450px"
        sx={{ textAlign: "center" }}
      >
        <MKTypography
          variant="h3"
          fontWeight="bold"
          mb={1}
        >
          Reset Your Password
        </MKTypography>
        <MKTypography
          variant="body2"
          color="text"
          mb={3}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </MKTypography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Success</AlertTitle>
            {successMessage}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <MKBox mb={3}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <MKInput
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="your@email.com"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </MKBox>

              <MKBox mb={3}>
                <MKButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  startIcon={<EmailIcon />}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </MKButton>
              </MKBox>
            </form>

            <MKBox textAlign="center">
              <MKButton
                component={Link}
                to="/auth/login"
                variant="text"
                color="secondary"
                startIcon={<ArrowBackIcon />}
              >
                Back to Login
              </MKButton>
            </MKBox>
          </CardContent>
        </Card>
      </MKBox>
    </MKBox>
  );
}

export default ForgotPassword;