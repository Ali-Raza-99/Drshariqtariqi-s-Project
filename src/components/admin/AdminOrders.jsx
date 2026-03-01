import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Tooltip,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getUserProfile, getAllOrders, deleteOrder } from "../../firebase/firestore";
import SitePage from "../layout/SitePage";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleShowUser = async (order) => {
    setSelectedOrder(order);
    setUserLoading(true);
    setUserDialogOpen(true);
    try {
      if (order.uid) {
        const userProfile = await getUserProfile(order.uid);
        setSelectedUser({ ...userProfile, uid: order.uid });
      } else {
        setSelectedUser(null);
      }
    } catch (e) {
      console.error("Error fetching user profile:", e);
      setSelectedUser(null);
    }
    setUserLoading(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
    setDeletingId(null);
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

  const handleExpandClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <SitePage maxWidth="lg">
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          mt: { xs: 1, sm: 2, md: 2 },
          mb: { xs: 1, sm: 2 },
          fontWeight: 900,
          textAlign: "center",
          fontSize: { xs: 24, sm: 32, md: 36 },
        }}
      >
        Orders Management
      </Typography>
      <Box
        className="admin-orders-container"
        sx={{
          bgcolor: "transparent",
          minHeight: { xs: "60vh", sm: "60vh" },
          py: { xs: 1, sm: 2 },
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
          mb: { xs: "60px", sm: "79px" },
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", sm: 900 }, mx: "auto", px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          ) : orders.length === 0 ? (
            <Typography sx={{ color: "#bbb", textAlign: "center", fontSize: 18 }}>
              No orders found.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {orders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                    color: "#fff",
                    p: 2,
                    width: "100%",
                  }}
                >
                  {/* ORDER HEADER */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      borderRadius: 1,
                      p: 1,
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleExpandClick(order.id)}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700} sx={{ fontSize: 16, mb: 0.5 }}>
                        Order #{order.id?.substring(0, 8) || "N/A"}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Date: {formatDate(order.checkoutDate)}
                        </Typography>
                        <Chip
                          label={order.status || "completed"}
                          color={order.status === "completed" ? "success" : "warning"}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>

                    <Box sx={{ textAlign: "right", mr: 2 }}>
                      <Typography fontWeight={800} sx={{ mb: 0.5 }}>
                        Rs. {order.totalAmount || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {order.totalItems || 0} items
                      </Typography>
                    </Box>

                    <Box>
                      {expandedOrderId === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                  </Box>

                  {/* EXPANDED CONTENT */}
                  {expandedOrderId === order.id && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

                      {/* USER SECTION */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                        }}
                        onClick={() => handleShowUser(order)}
                      >
                        <img
                          src={`https://ui-avatars.com/api/?name=${order.uid || "User"}&background=random`}
                          alt="User"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.2)",
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography fontWeight={700}>User ID: {order.uid?.substring(0, 12) || "N/A"}...</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Click to view user profile
                          </Typography>
                        </Box>
                      </Box>

                      {/* ORDER ITEMS */}
                      <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                        Items ({order.totalItems || 0})
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
                                <Typography fontWeight={600}>{item.name}</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                  Rs. {item.price} × {item.quantity}
                                </Typography>
                              </Box>
                              <Typography fontWeight={700}>Rs. {item.subtotal || 0}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            No items in this order
                          </Typography>
                        )}
                      </Stack>

                      {/* SUMMARY */}
                      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography>Total Items:</Typography>
                        <Typography fontWeight={700}>{order.totalItems || 0}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography>Total Amount:</Typography>
                        <Typography variant="h6" fontWeight={800}>
                          Rs. {order.totalAmount || 0}
                        </Typography>
                      </Box>

                      {/* ACTION BUTTONS */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Delete Order">
                          <IconButton
                            onClick={() => handleDelete(order.id)}
                            sx={{
                              color: "#fff",
                              bgcolor: "#222",
                              borderRadius: 2,
                              border: "1px solid #fff",
                              flex: 1,
                            }}
                            disabled={deletingId === order.id}
                            size="small"
                          >
                            {deletingId === order.id ? (
                              <CircularProgress size={18} sx={{ color: "#fff" }} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* USER DETAILS DIALOG */}
        <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: "#222", color: "#fff", borderBottom: "1px solid #444" }}>
            User & Order Details
            <IconButton
              onClick={() => setUserDialogOpen(false)}
              sx={{ float: "right", color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#111", p: 3 }}>
            {userLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                <CircularProgress sx={{ color: "#fff" }} />
              </Box>
            ) : (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {/* User Avatar */}
                {selectedUser && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${selectedUser?.uid || "User"}&background=random&size=128`}
                        alt="User"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          border: "2px solid #fff",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, textAlign: "center" }}>
                      {selectedUser.displayName || selectedUser.email || "Unknown User"}
                    </Typography>
                  </>
                )}

                {/* User Info */}
                {selectedUser && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>User ID:</b> {selectedUser.uid || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Email:</b> {selectedUser.email || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Phone:</b> {selectedUser.phoneNumber || "N/A"}
                    </Typography>
                  </>
                )}

                {/* Order Info */}
                {selectedOrder && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                    <Typography fontWeight={700} sx={{ color: "#fff", fontSize: 14 }}>
                      Order Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Order ID:</b> {selectedOrder.id?.substring(0, 12) || "N/A"}...
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Date:</b>{" "}
                      {selectedOrder.checkoutDate
                        ? selectedOrder.checkoutDate.toDate
                          ? selectedOrder.checkoutDate.toDate().toLocaleDateString()
                          : new Date(selectedOrder.checkoutDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Total Items:</b> {selectedOrder.totalItems || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Total Amount:</b> Rs. {selectedOrder.totalAmount || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      <b>Status:</b> {selectedOrder.status || "N/A"}
                    </Typography>

                    {/* Order Items Summary */}
                    <Typography fontWeight={700} sx={{ color: "#fff", fontSize: 14, mt: 1 }}>
                      Items
                    </Typography>
                    <Stack spacing={0.5}>
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <Typography key={idx} variant="caption" sx={{ color: "#bbb" }}>
                            • {item.name} × {item.quantity} = Rs. {item.subtotal}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ color: "#bbb" }}>
                          No items
                        </Typography>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </SitePage>
  );
}
