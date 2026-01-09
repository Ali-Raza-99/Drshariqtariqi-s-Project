import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CartQuantityControl({
  quantity = 0,
  onIncrease,
  onDecrease,
  maxQuantity = 99,
  productName = "item",
}) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <IconButton
        onClick={onDecrease}
        disabled={quantity <= 0}
        sx={{
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.24)",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          "&:disabled": { 
            opacity: 0.3,
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
        size="small"
        aria-label={`Decrease ${productName}`}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Box
        sx={{
          minWidth: 36,
          textAlign: "center",
          py: 0.6,
          borderRadius: 1.5,
          border: "1px solid rgba(255,255,255,0.18)",
          bgcolor: "rgba(0,0,0,0.25)",
        }}
      >
        <Typography fontWeight={900} fontSize={13}>
          {quantity}
        </Typography>
      </Box>

      <IconButton
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        sx={{
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.24)",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          "&:disabled": { 
            opacity: 0.3,
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
        size="small"
        aria-label={`Increase ${productName}`}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
