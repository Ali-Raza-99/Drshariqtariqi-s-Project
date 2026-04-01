import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { uploadToCloudinaryUnsigned } from "../../utils/cloudinaryUpload";
import LoginFirstDialog from "../auth/LoginFirstDialog";

export default function CheckoutDialog({ open, onClose }) {
  const { currentUser } = useAuth();
  const { cartItems, totalAmount, checkout } = useCart();
  const navigate = useNavigate();

  // State for login dialog
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Styling constants
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 34,
      bgcolor: "rgba(17,17,17,0.35)",
      borderRadius: 1,
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.22)",
        borderRadius: 1,
      },
      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.35)",
        borderRadius: 1,
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(255,255,255,0.5)",
        borderRadius: 1,
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
      padding: "10px 14px",
      fontSize: 14,
    },
    "& .MuiSvgIcon-root": {
      color: "rgba(255,255,255,0.85)",
    },
  };

  const labelProps = {
    sx: { color: "rgba(255,255,255,0.75)" },
  };

  // Check if guest user opens checkout dialog
  useEffect(() => {
    if (open && !currentUser) {
      // Close checkout dialog
      onClose();
      // Show login dialog
      setLoginDialogOpen(true);
    }
  }, [open, currentUser, onClose]);

  // Load user email if available
  useEffect(() => {
    if (currentUser?.email) {
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email,
      }));
    }
  }, [currentUser?.email]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePaymentSlipChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPaymentSlip(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.city &&
      paymentSlip &&
      cartItems.filter((item) => (item.quantity ?? 0) > 0).length > 0
    );
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    // Validate form
    if (!formData.name) {
      setError("Please enter your name");
      return;
    }
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }
    if (!formData.phone) {
      setError("Please enter your phone number");
      return;
    }
    if (!formData.address) {
      setError("Please enter your address");
      return;
    }
    if (!formData.city) {
      setError("Please enter your city");
      return;
    }
    if (!paymentSlip) {
      setError("Please upload a payment slip");
      return;
    }

    const activeItems = cartItems.filter((item) => (item.quantity ?? 0) > 0);
    if (activeItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      // Upload payment slip to Cloudinary
      const paymentSlipUrl = await uploadToCloudinaryUnsigned(paymentSlip);

      // Create order with additional data
      const orderRef = await checkout({
        deliveryAddress: formData.address,
        city: formData.city,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        paymentSlipUrl,
        orderDate: new Date().toISOString(),
      });

      setSuccessMsg("Order placed successfully! We will contact you soon.");
      setSubmitting(false);

      // Reset form
      setTimeout(() => {
        setFormData({
          name: "",
          email: currentUser?.email || "",
          phone: "",
          address: "",
          city: "",
        });
        setPaymentSlip(null);
        setPaymentSlipPreview(null);
        setError("");
        setSuccessMsg("");
        onClose();
      }, 2000);
    } catch (err) {
      setError(err?.message || "Submission failed. Try again.");
      setSubmitting(false);
    }
  };

  // Active cart items with quantity > 0
  const activeItems = cartItems.filter((item) => (item.quantity ?? 0) > 0);
  const orderTotal = activeItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 0), 0);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={{ xs: "xs", sm: "sm" }}
        fullWidth
        PaperProps={{
        sx: {
          bgcolor: "rgba(17, 17, 17, 0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: { xs: 2, sm: 3 },
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          maxHeight: { xs: "95vh", sm: "90vh" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          m: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Checkout
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ color: "rgba(255,255,255,0.7)" }}
          disabled={submitting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, overflow: "auto", flex: 1 }}>
        {/* Success Message */}
        {successMsg && (
          <Box
            sx={{
              background: "rgba(60,60,60,0.45)",
              color: "#43a047",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              fontWeight: 600,
              border: "1px solid rgba(67,160,71,0.25)",
              boxShadow: "0 2px 8px 0 rgba(60,60,60,0.10)",
              backdropFilter: "blur(2px)",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
            {successMsg}
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box
            sx={{
              background: "rgba(60,60,60,0.45)",
              color: "#e53935",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              fontWeight: 600,
              border: "1px solid rgba(229,57,53,0.25)",
              boxShadow: "0 2px 8px 0 rgba(60,60,60,0.10)",
              backdropFilter: "blur(2px)",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 20 }} />
            {error}
          </Box>
        )}

        {/* ORDER SUMMARY SECTION */}
        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 1.5, fontSize: 14 }}>
            Order Summary
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Stack spacing={1}>
              {activeItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography fontWeight={600}>Rs. {item.price * item.quantity}</Typography>
                </Box>
              ))}
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={700}>Total Amount:</Typography>
                <Typography fontWeight={700} sx={{ fontSize: 16 }}>
                  Rs. {orderTotal}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* CUSTOMER INFORMATION SECTION */}
        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 1.5, fontSize: 14 }}>
            Delivery Information
          </Typography>
          <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,.15)", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={12} item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  size="small"
                  sx={fieldSx}
                  InputLabelProps={labelProps}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  size="small"
                  sx={fieldSx}
                  InputLabelProps={labelProps}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  size="small"
                  sx={fieldSx}
                  InputLabelProps={labelProps}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </Grid>
              <Grid size={12} item xs={12}>
                <TextField
                  fullWidth
                  label="City *"
                  size="small"
                  sx={fieldSx}
                  InputLabelProps={labelProps}
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </Grid>
              <Grid size={12} item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address *"
                  multiline
                  rows={3}
                  size="small"
                  sx={fieldSx}
                  InputLabelProps={labelProps}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* PAYMENT SECTION */}
        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 1.5, fontSize: 14 }}>
            Payment Details
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccountBalanceIcon sx={{ color: "#fff", fontSize: 24 }} />
              <Typography fontWeight={600}>Transfer Amount: Rs. {orderTotal}</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  Bank Name
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: 14 }}>
                  HBL
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  Account Title
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: 14 }}>
                  Muhammad Shariq
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  Branch Name
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: 14 }}>
                  Bara Market Branch
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  IBAN
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: 14, letterSpacing: 0.5 }}>
                  PK25 HABB 00244070000008303
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Payment Slip Upload */}
          <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,.15)", borderRadius: 2 }}>
            <Typography fontWeight={600} sx={{ mb: 1, fontSize: 13 }}>
              Upload Payment Slip *
            </Typography>
            <Button
              sx={{
                height: 40,
                borderRadius: 1,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.7)",
                mb: 1.5,
                "& .MuiSvgIcon-root": { color: "#fff" },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,1)",
                },
              }}
              fullWidth
              component="label"
              size="small"
              variant="outlined"
              startIcon={<CloudUploadOutlinedIcon />}
            >
              <span style={{ color: "#fff" }}>
                {paymentSlip ? "✓ Selected: " + paymentSlip.name : "Upload Payment Slip"}
              </span>
              <input
                hidden
                type="file"
                accept="image/*,application/pdf"
                onChange={handlePaymentSlipChange}
              />
            </Button>

            {paymentSlipPreview && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 1,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.1)",
                  bgcolor: "rgba(255,255,255,0.05)",
                }}
              >
                <Typography variant="caption" sx={{ fontSize: 12 }}>
                  Preview:
                </Typography>
                {paymentSlip.type.startsWith("image/") ? (
                  <Box
                    component="img"
                    src={paymentSlipPreview}
                    sx={{
                      width: "100%",
                      maxHeight: 150,
                      borderRadius: 1,
                      mt: 1,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", mt: 1 }}>
                    PDF file selected: {paymentSlip.name}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <Alert
            severity="info"
            sx={{
              bgcolor: "rgba(33, 150, 243, 0.1)",
              border: "1px solid rgba(33, 150, 243, 0.3)",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#42A5F5",
              },
              mt: 2,
              fontSize: 12,
            }}
          >
            After completing the payment transfer, please upload the payment slip and submit your order.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          p: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            color: "#fff",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.7)",
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !isFormValid()}
          variant="contained"
          sx={{
            bgcolor: "#7e7e7e",
            color: "#000",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#f5f5f5",
              color: "#4e4e4e !important",
            },
            "&:disabled": {
              bgcolor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.5)",
            },
          }}
        >
          {submitting ? (
            <>
              <CircularProgress size={18} sx={{ color: "#000", mr: 1 }} />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </DialogActions>
      </Dialog>

      {/* LOGIN DIALOG FOR GUESTS */}
      <LoginFirstDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        title="Login to Checkout"
        description="Please login to your account to proceed with checkout and place your order."
      />
    </>
  );
};
