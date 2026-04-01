import React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";

// TikTok Icon Component
const TikTokIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.34 0 .67.05 1 .15V9.02a7.02 7.02 0 0 0-.62-.08A4.72 4.72 0 0 0 5.78 13.14a4.71 4.71 0 0 0 4.71 4.72 4.7 4.7 0 0 0 4.71-4.72V10.81a7.08 7.08 0 0 0 4.09 1.31v-3.73a4.83 4.83 0 0 1-.59-.03Z" />
  </svg>
);

const SocialMediaIcons = () => {
  // Handle WhatsApp click - opens chat with phone number
  const handleWhatsApp = () => {
    const phoneNumber = "923182392985"; // +92 country code for Pakistan
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  // Handle Email click - opens default mail client
  const handleEmail = () => {
    window.location.href = "mailto:hakeemshariqtariqtariqijahangir@gmail.com";
  };

  const socialLinks = [
    { 
      icon: <YouTubeIcon />, 
      url: "https://youtube.com/@SahibzadaShariqTariqi", 
      label: "YouTube",
      external: true 
    },
    { 
      icon: <InstagramIcon />, 
      url: "https://instagram.com/SahibzadaShariqTariqi", 
      label: "Instagram",
      external: true 
    },
    { 
      icon: <TikTokIcon />, 
      url: "https://tiktok.com/@SahibzadaShariqTariqi", 
      label: "TikTok",
      external: true 
    },
    { 
      icon: <WhatsAppIcon />, 
      label: "WhatsApp",
      onClick: handleWhatsApp 
    },
    { 
      icon: <EmailIcon />, 
      label: "Email",
      onClick: handleEmail 
    },
  ];

  return (
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
      {socialLinks.map((social) => (
        <IconButton
          key={social.label}
          {...(social.external ? {
            component: "a",
            href: social.url,
            target: "_blank",
            rel: "noopener noreferrer",
          } : {
            onClick: social.onClick,
          })}
          aria-label={social.label}
          title={social.label}
          sx={{
            width: 45,
            height: 45,
            bgcolor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            transition: "all 0.3s ease",
            cursor: "pointer",
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
};

export default SocialMediaIcons;
