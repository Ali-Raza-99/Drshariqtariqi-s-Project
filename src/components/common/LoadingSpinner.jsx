import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { COLORS, SPINNER_SX } from "../../theme/constants";

/**
 * Standard Loading Component
 * Used across all pages for consistent loading state
 */
export default function LoadingSpinner({ 
  message = "Loading...", 
  fullHeight = true,
  minHeight = "60vh",
  size = 48 
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullHeight ? "100vh" : minHeight,
        width: "100%",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress 
          size={size}
          sx={{ 
            color: COLORS.primary,
          }} 
        />
        {message && (
          <Typography 
            sx={{ 
              color: COLORS.secondary,
              fontSize: 14,
              opacity: 0.8,
            }}
          >
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
