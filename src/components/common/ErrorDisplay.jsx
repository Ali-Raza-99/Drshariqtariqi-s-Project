import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { COLORS } from "../../theme/constants";

/**
 * Standard Error Display Component
 * Used across all pages for consistent error state
 */
export default function ErrorDisplay({ 
  message = "Something went wrong", 
  onRetry = null,
  fullHeight = false,
  minHeight = "40vh",
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullHeight ? "100vh" : minHeight,
        width: "100%",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          fontSize: 48, 
          color: COLORS.error,
          opacity: 0.7,
        }} 
      />
      <Typography 
        sx={{ 
          color: COLORS.secondary,
          fontSize: 16,
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="contained"
          sx={{
            bgcolor: "#fff",
            color: "#000",
            fontWeight: 700,
            borderRadius: 2,
            mt: 2,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
