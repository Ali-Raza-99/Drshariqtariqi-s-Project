import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, useMediaQuery } from "@mui/material";

const adminLinks = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Courses", to: "/admin/courses" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Appointments", to: "/admin/appointments" },
  { label: "Mureed Requests", to: "/admin/mureed-requests" },
];

export default function AdminNavbar() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AppBar position="static" sx={{ bgcolor: "#111", boxShadow: "none", borderBottom: "1px solid #333" }}>
      <Toolbar 
        sx={{ 
          minHeight: 64,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 0,
          "&::-webkit-scrollbar": {
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#555",
            borderRadius: "4px",
            "&:hover": {
              bgcolor: "#777",
            },
          },
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: "#fff", 
            fontWeight: 900,
            whiteSpace: "nowrap",
            mr: 2,
          }}
        >
          Admin Panel
        </Typography>
        
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {adminLinks.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              sx={{
                color: location.pathname === link.to ? "#fff" : "#bbb",
                fontWeight: location.pathname === link.to ? 700 : 500,
                px: 1.5,
                py: 1,
                borderBottom: location.pathname === link.to ? "2px solid #fff" : "none",
                borderRadius: 0,
                textTransform: "none",
                fontSize: isMobile ? 12 : 14,
                bgcolor: "transparent",
                whiteSpace: "nowrap",
                minWidth: "auto",
                transition: "all 0.2s ease",
                "&:hover": { 
                  color: "#fff", 
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
