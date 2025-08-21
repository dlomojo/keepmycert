// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Material UI components
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  AlertTitle
} from "@mui/material";

// Icons
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  LoginOutlined as LoginIcon
} from "@mui/icons-material";

// Hooks
import { useAuth } from "contexts/AuthContext";

// Form validation
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required")
}).required();

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect URL from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Handle email/password login
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
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
          Welcome back
        </MKTypography>
        <MKTypography
          variant="body2"
          color="text"
          mb={3}
        >
          Sign in to your KeepMyCert account
        </MKTypography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 3 }}>
            <MKBox mb={3}>
              <MKButton
                variant="outlined"
                color="dark"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Continue with Google
              </MKButton>
            </MKBox>

            <MKBox
              display="flex"
              alignItems="center"
              mb={3}
            >
              <Divider sx={{ flexGrow: 1 }} />
              <MKTypography
                variant="caption"
                color="text"
                px={2}
              >
                Or sign in with email
              </MKTypography>
              <Divider sx={{ flexGrow: 1 }} />
            </MKBox>

            <form onSubmit={handleSubmit(onSubmit)}>
              <MKBox mb={2}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <MKInput
                      {...field}
                      type="email"
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </MKBox>

              <MKBox mb={3}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <MKInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
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
                  startIcon={<LoginIcon />}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </MKButton>
              </MKBox>
            </form>

            <MKBox textAlign="center">
              <MKTypography
                component={Link}
                to="/auth/forgot-password"
                variant="button"
                color="info"
                fontWeight="medium"
                mb={2}
                display="block"
              >
                Forgot password?
              </MKTypography>
              <MKTypography
                variant="body2"
                color="text"
              >
                Don't have an account?{" "}
                <MKTypography
                  component={Link}
                  to="/auth/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                >
                  Sign up
                </MKTypography>
              </MKTypography>
            </MKBox>
          </CardContent>
        </Card>
      </MKBox>
    </MKBox>
  );
}

export default Login;   