// src/pages/Dashboard/Certifications/CertificationForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "@/components/MKBox";
import MKButton from "@/components/MKButton";
import MKTypography from "@/components/MKTypography";
import MKInput from "@/components/MKInput";

// Material UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Divider,
  Alert,
  AlertTitle,
  LinearProgress
} from "@mui/material";

// Hooks and services
import { useCertifications } from "@/hooks/useCertifications";
import { useVendors } from "@/hooks/useVendors";
import { useFileUpload } from "@/hooks/useFileUpload";

// Form validation
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema for form validation
const schema = yup.object({
  name: yup.string().required("Certificate name is required"),
  vendorId: yup.string().required("Vendor is required"),
  issueDate: yup.date().required("Issue date is required"),
  expiryDate: yup.date().nullable(),
  certNumber: yup.string(),
  notes: yup.string()
}).required();

function CertificationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Hooks
  const { 
    getCertification,
    addCertification, 
    updateCertification, 
    loading: certLoading,
    error: certError
  } = useCertifications();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { 
    uploadFile, 
    uploading, 
    uploadError
  } = useFileUpload();

  // Form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // React Hook Form
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      vendorId: "",
      issueDate: "",
      expiryDate: "",
      certNumber: "",
      notes: ""
    }
  });

  // Load certification data for edit mode
  useEffect(() => {
    const loadCertificationData = async () => {
      if (isEditMode && id) {
        try {
          const certData = await getCertification(id);
          if (certData) {
            reset({
              name: certData.name,
              vendorId: certData.vendorId,
              issueDate: certData.issueDate ? certData.issueDate.substring(0, 10) : "",
              expiryDate: certData.expiryDate ? certData.expiryDate.substring(0, 10) : "",
              certNumber: certData.certNumber || "",
              notes: certData.notes || ""
            });
            setFilePreview(certData.evidenceFileUrl || null);
          }
        } catch (error) {
          console.error("Error loading certification:", error);
        }
      }
    };

    loadCertificationData();
  }, [id, isEditMode, getCertification, reset]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      let fileUrl = filePreview;
      
      // Upload file if selected
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile, `certifications/${data.vendorId}`);
      }
      
      const certificationData = {
        ...data,
        evidenceFileUrl: fileUrl
      };
      
      if (isEditMode) {
        await updateCertification(id, certificationData);
      } else {
        await addCertification(certificationData);
      }
      
      // Redirect to certifications list
      navigate("/dashboard/certificates");
    } catch (error) {
      console.error("Error saving certification:", error);
    }
  };

  // Loading state
  if (isEditMode && certLoading) {
    return (
      <MKBox p={3}>
        <MKTypography variant="h6" mb={2}>Loading certification data...</MKTypography>
        <LinearProgress color="info" />
      </MKBox>
    );
  }

  return (
    <MKBox p={3}>
      <MKBox mb={3}>
        <MKTypography variant="h4">
          {isEditMode ? "Edit Certification" : "Add New Certification"}
        </MKTypography>
      </MKBox>

      {(certError || uploadError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {certError || uploadError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Certification Details" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.name}>
                      <MKInput
                        {...field}
                        label="Certification Name"
                        placeholder="e.g., AWS Solutions Architect Associate"
                        fullWidth
                        error={!!errors.name}
                      />
                      {errors.name && (
                        <FormHelperText>{errors.name.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="vendorId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.vendorId}>
                      <InputLabel id="vendor-select-label">Vendor</InputLabel>
                      <Select
                        {...field}
                        labelId="vendor-select-label"
                        label="Vendor"
                        disabled={vendorsLoading}
                      >
                        {vendors?.map((vendor) => (
                          <MenuItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.vendorId && (
                        <FormHelperText>{errors.vendorId.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="issueDate"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.issueDate}>
                      <TextField
                        {...field}
                        label="Issue Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.issueDate}
                      />
                      {errors.issueDate && (
                        <FormHelperText>{errors.issueDate.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.expiryDate}>
                      <TextField
                        {...field}
                        label="Expiry Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.expiryDate}
                      />
                      {errors.expiryDate && (
                        <FormHelperText>{errors.expiryDate.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="certNumber"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.certNumber}>
                      <MKInput
                        {...field}
                        label="Certificate Number/ID"
                        placeholder="e.g., AWS-123456"
                        fullWidth
                        error={!!errors.certNumber}
                      />
                      {errors.certNumber && (
                        <FormHelperText>{errors.certNumber.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <MKTypography variant="caption" fontWeight="bold" mb={1}>
                    Certificate Evidence (PDF/Image)
                  </MKTypography>
                  <input
                    accept="image/*,.pdf"
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginBottom: "8px" }}
                  />
                  {filePreview && (
                    <MKBox mt={2}>
                      {filePreview.includes("data:image") ? (
                        <img 
                          src={filePreview} 
                          alt="Certificate preview" 
                          style={{ 
                            maxWidth: "100%", 
                            maxHeight: "200px", 
                            objectFit: "contain",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px"
                          }} 
                        />
                      ) : (
                        <MKButton
                          variant="outlined"
                          color="info"
                          size="small"
                          component="a"
                          href={filePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </MKButton>
                      )}
                    </MKBox>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.notes}>
                      <TextField
                        {...field}
                        label="Notes"
                        multiline
                        rows={4}
                        placeholder="Add any additional information about this certification..."
                        error={!!errors.notes}
                      />
                      {errors.notes && (
                        <FormHelperText>{errors.notes.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
            <MKButton
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/dashboard/certificates")}
              sx={{ mr: 1 }}
            >
              Cancel
            </MKButton>
            <MKButton
              type="submit"
              variant="gradient"
              color="info"
              disabled={certLoading || uploading}
            >
              {certLoading || uploading 
                ? "Saving..." 
                : isEditMode ? "Update Certification" : "Add Certification"}
            </MKButton>
          </CardActions>
        </Card>
      </form>
    </MKBox>
  );
}

export default CertificationForm;