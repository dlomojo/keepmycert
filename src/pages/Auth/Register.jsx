import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  AlertTitle,
  Checkbox,
  FormControlLabel,
  Grid
} from "@mui/material";

// Icons
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";

// Hooks
import { useAuth } from "contexts/AuthContext";

// Form validation
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions")
}).required();

function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false
    }
  });

  // Handle registration
  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, data.name);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google registration error:", error);
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
        maxWidth="500px"
        sx={{ textAlign: "center" }}
      >
        <MKTypography
          variant="h3"
          fontWeight="bold"
          mb={1}
        >
          Create your account
        </MKTypography>
        <MKTypography
          variant="body2"
          color="text"
          mb={3}
        >
          Join thousands of IT professionals tracking their certifications
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
                onClick={handleGoogleRegister}
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
                Or register with email
              </MKTypography>
              <Divider sx={{ flexGrow: 1 }} />
            </MKBox>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <MKInput
                        {...field}
                        label="Full Name"
                        placeholder="John Doe"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <MKInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="••••••••"
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <MKInput
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        placeholder="••••••••"
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="agreeTerms"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={value}
                            onChange={onChange}
                            inputRef={ref}
                            color="primary"
                          />
                        }
                        label={
                          <MKTypography variant="body2">
                            I agree to the{" "}
                            <MKTypography
                              component={Link}
                              to="/terms"
                              variant="button"
                              color="info"
                              fontWeight="medium"
                            >
                              Terms and Conditions
                            </MKTypography>{" "}
                            and{" "}
                            <MKTypography
                              component={Link}
                              to="/privacy"
                              variant="button"
                              color="info"
                              fontWeight="medium"
                            >
                              Privacy Policy
                            </MKTypography>
                          </MKTypography>
                        }
                      />
                    )}
                  />
                  {errors.agreeTerms && (
                    <MKTypography variant="caption" color="error" textAlign="left" display="block">
                      {errors.agreeTerms.message}
                    </MKTypography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <MKButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                    startIcon={<PersonAddIcon />}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </MKButton>
                </Grid>
              </Grid>
            </form>

            <MKBox textAlign="center" mt={3}>
              <MKTypography
                variant="body2"
                color="text"
              >
                Already have an account?{" "}
                <MKTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                >
                  Sign in
                </MKTypography>
              </MKTypography>
            </MKBox>
          </CardContent>
        </Card>
      </MKBox>
    </MKBox>
  );
}

export default Register;