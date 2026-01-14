import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ThemedLoadingSpinner = ({ size = 48, sx = {} }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      width: "100%",
      height: "100%",
      position: "relative",
      ...sx,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress size={size} sx={{ color: "#fff" }} thickness={4} />
    </Box>
  </Box>
);

export default ThemedLoadingSpinner;
