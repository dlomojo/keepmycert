// components/MKBox.jsx
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const MKBox = styled(Box)(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows } = theme;
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;

  // Your styling logic here

  return {
    // Basic styling properties
    opacity: opacity || 1,
    borderRadius: borderRadius || 0,
    // Add more styling as needed
  };
});

export default MKBox;