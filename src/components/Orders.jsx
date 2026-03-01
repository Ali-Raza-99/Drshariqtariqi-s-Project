import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function Orders() {
  const { currentUser } = useAuth();
  const { loadOrders, orders, ordersLoading } = useCart();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      loadOrders();
    }
  }, [currentUser?.uid, loadOrders]);

  const handleExpandClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "confirmed":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (!currentUser) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please login to view your orders
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        bgcolor: "#000",
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 4, textAlign: "center" }}
        >
          My Orders
        </Typography>

        {ordersLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={50} sx={{ color: "#fff" }} />
          </Box>
        ) : orders.length === 0 ? (
          <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography>
              You haven't placed any orders yet. Start shopping!
            </Typography>
          </Alert>
        ) : (
          <Stack spacing={2}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {/* ORDER HEADER */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      p: 1,
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                    onClick={() => handleExpandClick(order.id)}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                        Order #{order.id?.substring(0, 8) || "N/A"}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Date: {formatDate(order.checkoutDate || order.placedAt)}
                        </Typography>
                        <Chip
                          label={order.status || "completed"}
                          color={getStatusColor(order.status)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                        Rs. {order.totalAmount || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {order.totalItems || 0} items
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      {expandedOrderId === order.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </Box>
                  </Box>

                  {/* EXPANDED CONTENT */}
                  {expandedOrderId === order.id && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

                      {/* ORDER ITEMS */}
                      <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                        Items
                      </Typography>
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1.25,
                                borderRadius: 1,
                                bgcolor: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Box>
                                <Typography fontWeight={600}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                  Rs. {item.price} × {item.quantity}
                                </Typography>
                              </Box>
                              <Typography fontWeight={700}>
                                Rs. {item.subtotal || 0}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            No items in this order
                          </Typography>
                        )}
                      </Stack>

                      {/* ACTION BUTTONS */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(order)}
                          sx={{
                            color: "white",
                            borderColor: "rgba(255,255,255,0.3)",
                            "&:hover": {
                              borderColor: "white",
                              bgcolor: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          View Full Details
                        </Button>
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      {/* FULL DETAILS DIALOG */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(15,15,15,0.95)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 3,
            color: "#fff",
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
              Order #{selectedOrder.id?.substring(0, 8) || "N/A"} Details
            </DialogTitle>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <DialogContent sx={{ py: 3 }}>
              <Stack spacing={2.5}>
                {/* STATUS */}
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status || "pending"}
                    color={getStatusColor(selectedOrder.status)}
                    variant="outlined"
                  />
                </Box>

                {/* DATE */}
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
                    Order Date
                  </Typography>
                  <Typography fontWeight={600}>
                    {formatDate(selectedOrder.checkoutDate || selectedOrder.placedAt)}
                  </Typography>
                </Box>

                {/* ITEMS */}
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                    Items
                  </Typography>
                  <Stack spacing={1}>
                    {Array.isArray(selectedOrder.items) &&
                      selectedOrder.items.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(255,255,255,0.04)",
                          }}
                        >
                          <Box>
                            <Typography fontWeight={600} fontSize={14}>
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ opacity: 0.7 }}
                            >
                              Rs. {item.price} × {item.quantity}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700} fontSize={14}>
                            Rs. {item.subtotal || 0}
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </Box>

                {/* SUMMARY */}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Total Items:</Typography>
                    <Typography fontWeight={700}>
                      {selectedOrder.totalItems || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Total Amount:</Typography>
                    <Typography variant="h6" fontWeight={800}>
                      Rs. {selectedOrder.totalAmount || 0}
                    </Typography>
                  </Box>
                </Box>

                {/* DELIVERY ADDRESS */}
                {selectedOrder.deliveryAddress && (
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
                      Delivery Address
                    </Typography>
                    <Typography>
                      {selectedOrder.deliveryAddress}
                    </Typography>
                  </Box>
                )}

                {/* NOTES */}
                {selectedOrder.notes && (
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
                      Notes
                    </Typography>
                    <Typography>{selectedOrder.notes}</Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseDetails}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
