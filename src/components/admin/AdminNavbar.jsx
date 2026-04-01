import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  useMediaQuery,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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
  const isMdUp = useMediaQuery("(min-width:960px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: "#111", 
          boxShadow: "none", 
          borderBottom: "1px solid #333",
          minHeight: { xs: 56, md: 64 },
        }}
      >
        <Toolbar 
          disableGutters
          sx={{ 
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1.5, md: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#fff", 
              fontWeight: 900,
              whiteSpace: "nowrap",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Admin Panel
          </Typography>
          
          {/* Desktop Navigation */}
          <Box 
            sx={{ 
              display: { xs: "none", md: "flex" },
              gap: 0,
              ml: "auto",
            }}
          >
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
                  fontSize: "0.95rem",
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

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "white",
              ml: "auto",
            }}
            aria-label="Open admin menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "rgba(17, 17, 17, 0.98)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box
          sx={{
            width: 280,
            bgcolor: "rgba(17, 17, 17, 0.98)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: "#fff" }}
              aria-label="Close menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <List sx={{ flex: 1, overflowY: "auto", px: 1 }}>
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <ListItemButton
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
                    borderRadius: "4px",
                    mb: 0.5,
                    pl: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
