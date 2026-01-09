import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 2, background: "#111", color: "#aaa" }}>
      <Container maxWidth="xl">
        <Typography textAlign="center" fontSize={14}>
          © {new Date().getFullYear()} Hakeem Shariq Tariq. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
