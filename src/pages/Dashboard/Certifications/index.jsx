// src/pages/Dashboard/Certifications/index.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

// Material UI components
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Grid,
  InputAdornment,
  LinearProgress,
  Alert
} from "@mui/material";

// Icons
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";

// Hooks and services
import { useCertifications } from "hooks/useCertifications";

// Utilities
import { formatDate, getDaysUntilExpiry } from "utils/dateUtils";

function Certifications() {
  const { certifications, loading, error, deleteCertification } = useCertifications();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await deleteCertification(id);
      } catch (error) {
        console.error("Error deleting certification:", error);
      }
    }
  };

  // Filter and sort certifications
  const filteredCertifications = certifications
    ? certifications.filter((cert) => {
        const matchesSearch = 
          cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.provider.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterStatus === "all") return matchesSearch;
        if (filterStatus === "active") return matchesSearch && new Date(cert.expiryDate) > new Date();
        if (filterStatus === "expiring") {
          const daysUntil = getDaysUntilExpiry(cert.expiryDate);
          return matchesSearch && daysUntil > 0 && daysUntil <= 90;
        }
        if (filterStatus === "expired") return matchesSearch && new Date(cert.expiryDate) < new Date();
        
        return matchesSearch;
      })
    : [];

  // Paginate certifications
  const paginatedCertifications = filteredCertifications
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Get status and color
  const getCertStatusInfo = (expiryDate) => {
    const daysUntil = getDaysUntilExpiry(expiryDate);
    
    if (daysUntil < 0) return { label: "Expired", color: "error" };
    if (daysUntil <= 30) return { label: "Expiring Soon", color: "warning" };
    if (daysUntil <= 90) return { label: "Upcoming", color: "info" };
    return { label: "Active", color: "success" };
  };

  if (loading) {
    return (
      <MKBox p={3}>
        <MKTypography variant="h6" mb={2}>Loading certifications...</MKTypography>
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
        <MKTypography variant="h4">My Certifications</MKTypography>
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

      {/* Search and Filters */}
      <Grid container spacing={2} mb={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <MKInput
            fullWidth
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} display="flex" gap={1} flexWrap="wrap">
          <Chip 
            label="All" 
            onClick={() => setFilterStatus("all")}
            color={filterStatus === "all" ? "primary" : "default"}
          />
          <Chip 
            label="Active" 
            onClick={() => setFilterStatus("active")}
            color={filterStatus === "active" ? "success" : "default"}
          />
          <Chip 
            label="Expiring Soon" 
            onClick={() => setFilterStatus("expiring")}
            color={filterStatus === "expiring" ? "warning" : "default"}
          />
          <Chip 
            label="Expired" 
            onClick={() => setFilterStatus("expired")}
            color={filterStatus === "expired" ? "error" : "default"}
          />
          <MKButton 
            variant="text" 
            color="info" 
            startIcon={<FilterIcon />}
            sx={{ marginLeft: "auto" }}
          >
            More Filters
          </MKButton>
        </Grid>
      </Grid>

      {/* Certifications Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCertifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <MKTypography variant="body2">
                      No certifications found. Add your first certification to get started.
                    </MKTypography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCertifications.map((cert) => {
                  const statusInfo = getCertStatusInfo(cert.expiryDate);
                  
                  return (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <MKTypography variant="button" fontWeight="medium">
                          {cert.name}
                        </MKTypography>
                        {cert.certNumber && (
                          <MKTypography variant="caption" display="block">
                            #{cert.certNumber}
                          </MKTypography>
                        )}
                      </TableCell>
                      <TableCell>{cert.provider}</TableCell>
                      <TableCell>{formatDate(cert.issueDate)}</TableCell>
                      <TableCell>{formatDate(cert.expiryDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={statusInfo.label} 
                          color={statusInfo.color} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          component={Link} 
                          to={`/dashboard/certificates/${cert.id}`}
                          color="info"
                          size="small"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          component={Link} 
                          to={`/dashboard/certificates/${cert.id}/edit`}
                          color="warning"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(cert.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCertifications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </MKBox>
  );
}

export default Certifications;