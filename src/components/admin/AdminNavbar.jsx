import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";

const adminLinks = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Courses", to: "/admin/courses" },
  { label: "Appointments", to: "/admin/appointments" },
  { label: "Mureed Requests", to: "/admin/mureed-requests" },
];

export default function AdminNavbar() {
  const location = useLocation();
  return (
    <AppBar position="static" sx={{ bgcolor: "#111", boxShadow: "none", borderBottom: "1px solid #333" }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff", fontWeight: 900 }}>
          Admin Panel
        </Typography>
        {adminLinks.map((link) => (
          <Button
            key={link.to}
            component={Link}
            to={link.to}
            sx={{
              color: location.pathname === link.to ? "#fff" : "#bbb",
              fontWeight: location.pathname === link.to ? 700 : 500,
              mx: 1,
              borderBottom: location.pathname === link.to ? "2px solid #fff" : "none",
              borderRadius: 0,
              textTransform: "none",
              fontSize: 16,
              bgcolor: "transparent",
              '&:hover': { color: '#fff', bgcolor: '#222' },
            }}
          >
            {link.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
