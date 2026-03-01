import React, { useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CartQuantityControl from "./CartQuantityControl";
import { useCart } from "../../context/CartContext";

export default function CartDialog({
  open,
  onClose,
}) {
  const {
    cartItems,
    totalItems,
    totalAmount,
    cartLoading,
    cartError,
    updateQuantity,
    removeItem,
    checkout,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      setCheckoutError(null);
      await updateQuantity(cartItemId, newQuantity);
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setCheckoutError(null);
      await removeItem(cartItemId);
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutError(null);
      setIsCheckingOut(true);
      
      // For now, just place the order. Later you can add delivery address, etc.
      await checkout({
        deliveryAddress: "", // Can be collected in a form
        notes: "",
      });

      // Close dialog after successful checkout
      onClose();
      alert("Order placed successfully!");
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };
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
          overflow: "auto",
          maxHeight: "90vh",
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
          position: "sticky",
          top: 0,
          bgcolor: "rgba(15, 15, 15, 0.95)",
          zIndex: 10,
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
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
      <Box sx={{ px: 2.25, py: 2, minHeight: cartLoading ? 300 : "auto" }}>
        {cartLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={40} sx={{ color: "#fff" }} />
          </Box>
        ) : cartError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {cartError}
          </Alert>
        ) : cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 14 }}>
              Your cart is empty. Start shopping!
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {cartItems.map((item) => {
                const lineTotal = (item.quantity ?? 0) * item.price;
                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1.25,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.12)",
                      bgcolor: (item.quantity ?? 0) === 0 
                        ? "rgba(255,100,100,0.08)" 
                        : "rgba(255,255,255,0.04)",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderColor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 2,
                        objectFit: "cover",
                        border: "1px solid rgba(255,255,255,0.10)",
                        opacity: (item.quantity ?? 0) === 0 ? 0.5 : 1,
                      }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3C/svg%3E";
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={800} sx={{ lineHeight: 1.15, fontSize: 14 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 12, mt: 0.25 }}>
                        Rs. {item.price}
                      </Typography>
                      {(item.quantity ?? 0) === 0 && (
                        <Typography variant="caption" sx={{ color: "rgba(255,100,100,0.9)", fontSize: 11, mt: 0.25 }}>
                          Out of stock
                        </Typography>
                      )}
                    </Box>
                    <CartQuantityControl
                      quantity={item.quantity ?? 0}
                      onIncrease={() => handleUpdateQuantity(item.id, (item.quantity ?? 0) + 1)}
                      onDecrease={() => handleUpdateQuantity(item.id, Math.max(0, (item.quantity ?? 0) - 1))}
                      maxQuantity={99}
                      productName={item.name}
                    />
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", flexDirection: "column" }}>
                      <Box sx={{ width: 70, textAlign: "right" }}>
                        <Typography fontWeight={900} sx={{ lineHeight: 1.15, fontSize: 12 }}>
                          Rs. {lineTotal}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.65, fontSize: 10 }}>
                          Subtotal
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                        sx={{ 
                          color: "rgba(255,100,100,0.8)", 
                          p: 0.3,
                          "&:hover": { color: "rgba(255,100,100,1)" }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={900} sx={{ mb: 1, fontSize: 14 }}>
                  Order Summary
                </Typography>
                <Stack spacing={0.4}>
                  {cartItems
                    .filter((item) => (item.quantity ?? 0) > 0)
                    .map((item) => (
                      <Typography
                        key={`summary-${item.id}`}
                        variant="body2"
                        sx={{ opacity: 0.85, fontSize: 12 }}
                      >
                        {item.name} × {item.quantity} = Rs. {(item.quantity ?? 0) * item.price}
                      </Typography>
                    ))}
                  {cartItems.filter((item) => (item.quantity ?? 0) === 0).length > 0 && (
                    <Typography variant="caption" sx={{ color: "rgba(255,100,100,0.9)", fontSize: 11, mt: 0.5 }}>
                      ({cartItems.filter((item) => (item.quantity ?? 0) === 0).length} item(s) out of stock)
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: 11 }}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1.1, mb: 1 }}>
                  Rs. {totalAmount}
                </Typography>
                {checkoutError && (
                  <Alert severity="error" sx={{ mb: 1, fontSize: 11 }}>
                    {checkoutError}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: "#fff",
                    color: "#222",
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    fontSize: "0.9rem",
                    width: "100%",
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                      color: '#222',
                    },
                    '&:active': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                  disabled={cartItems.filter(item => (item.quantity ?? 0) > 0).length === 0 || isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? (
                    <CircularProgress size={18} sx={{ color: "#222", mr: 1 }} />
                  ) : (
                    "Checkout"
                  )}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
}
