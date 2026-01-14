import React from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Badge,
  Avatar,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CartQuantityControl from "./CartQuantityControl";

export default function CartDialog({
  open,
  onClose,
  cartProducts,
  cartQty,
  incCart,
  decCart,
  totalItems,
  totalAmount,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "rgba(15, 15, 15, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: 3,
          boxShadow: "0 20px 70px rgba(0,0,0,0.65)",
          backdropFilter: "blur(14px)",
          color: "#fff",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 2.25,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            Your Cart
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13, mt: 0.25 }}>
            {totalItems > 0
              ? `${totalItems} item${totalItems === 1 ? "" : "s"} selected`
              : "No items selected yet"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.85)" }} aria-label="Close cart">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <Box sx={{ px: 2.25, py: 2 }}>
        <Stack spacing={1.5}>
          {cartProducts.map((p) => {
            const qty = cartQty[p.id] ?? 0;
            const lineTotal = qty * p.price;
            return (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.12)",
                  bgcolor: "rgba(255,255,255,0.04)",
                }}
              >
                <Box
                  component="img"
                  src={p.image}
                  alt={p.name}
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 2,
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={800} sx={{ lineHeight: 1.15 }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13, mt: 0.25 }}>
                    Rs. {p.price}
                  </Typography>
                </Box>
                <CartQuantityControl
                  quantity={qty}
                  onIncrease={() => incCart(p.id)}
                  onDecrease={() => decCart(p.id)}
                  maxQuantity={99}
                  productName={p.name}
                />
                <Box sx={{ width: 92, textAlign: "right" }}>
                  <Typography fontWeight={900} sx={{ lineHeight: 1.15 }}>
                    Rs. {lineTotal}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.65 }}>
                    Subtotal
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={900} sx={{ mb: 0.75 }}>
              Order Summary
            </Typography>
            {totalItems === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13 }}>
                Add items using + to see summary.
              </Typography>
            ) : (
              <Stack spacing={0.4}>
                {cartProducts
                  .filter((p) => (cartQty[p.id] ?? 0) > 0)
                  .map((p) => (
                    <Typography
                      key={`summary-${p.id}`}
                      variant="body2"
                      sx={{ opacity: 0.85, fontSize: 13 }}
                    >
                      {p.name} × {cartQty[p.id]} = Rs. {(cartQty[p.id] ?? 0) * p.price}
                    </Typography>
                  ))}
              </Stack>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1.1 }}>
              Rs. {totalAmount}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#fff",
                color: "#222",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                textTransform: "none",
                px: 3,
                py: 1.2,
                fontSize: "1rem",
                '&:hover': {
                  bgcolor: '#e0e0e0',
                  color: '#222',
                },
                '&:active': {
                  bgcolor: '#f5f5f5',
                },
              }}
              disabled={totalItems === 0}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
