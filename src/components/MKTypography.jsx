// components/MKTypography.jsx
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const MKTypography = styled(Typography)(({ theme, ownerState }) => {
  const { palette, functions, typography } = theme;
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient } = ownerState;

  // Your styling logic here

  return {
    opacity: opacity || 1,
    textTransform: textTransform || 'none',
    verticalAlign: verticalAlign || 'unset',
    textDecoration: 'none',
    // Add more styling as needed
  };
});

export default MKTypography;