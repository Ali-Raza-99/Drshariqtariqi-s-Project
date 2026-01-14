import React from "react";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

export default function CartNavbarIcon({ totalItems, onClick }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: "white",
        mr: 1,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        transition: "transform 180ms ease, background-color 220ms ease",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.10)",
          transform: "translateY(-1px)",
        },
        "&:active": { transform: "translateY(0px) scale(0.98)" },
      }}
      aria-label="Open cart"
    >
      <Badge
        badgeContent={totalItems}
        color="error"
        overlap="circular"
        sx={{
          "& .MuiBadge-badge": {
            border: "1px solid rgba(0,0,0,0.35)",
          },
        }}
      >
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
