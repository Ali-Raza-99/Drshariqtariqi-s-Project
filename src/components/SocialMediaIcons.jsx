import React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareIcon from "@mui/icons-material/Share";

const SocialMediaIcons = () => (
  <Box
    sx={{
      position: "fixed",
      left: 16,
      bottom: 60,
      zIndex: 1000,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
    }}
  >
    <IconButton
      sx={{
        width: 50,
        height: 50,
        bgcolor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(10px)",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        color: "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.2)",
          transform: "scale(1.05)",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
        },
        "&:hover ~ .social-icons": {
          opacity: 1,
          transform: "translateX(0)",
          pointerEvents: "auto",
        },
      }}
    >
      <ShareIcon />
    </IconButton>
    <Box
      className="social-icons"
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        opacity: 0,
        transform: "translateX(-20px)",
        pointerEvents: "none",
        transition: "all 0.4s ease",
        "&:hover": {
          opacity: 1,
          transform: "translateX(0)",
          pointerEvents: "auto",
        },
      }}
    >
      {[
        { icon: <FacebookIcon />, url: "https://facebook.com", label: "Facebook" },
        { icon: <YouTubeIcon />, url: "https://youtube.com", label: "YouTube" },
        { icon: <InstagramIcon />, url: "https://instagram.com", label: "Instagram" },
        { icon: <TwitterIcon />, url: "https://twitter.com", label: "Twitter" },
        { icon: <WhatsAppIcon />, url: "https://whatsapp.com", label: "WhatsApp" },
      ].map((social) => (
        <IconButton
          key={social.label}
          component="a"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          sx={{
            width: 45,
            height: 45,
            bgcolor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-3px)",
              boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {social.icon}
        </IconButton>
      ))}
    </Box>
  </Box>
);

export default SocialMediaIcons;
