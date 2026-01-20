import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 2,
        background: "#111",
        color: "#aaa",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 1300,
      }}
    >
      <Container maxWidth="xl">
        <Typography textAlign="center" fontSize={14}>
          © {new Date().getFullYear()} Hakeem Shariq Tariq. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
