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
import { getUserProfile, getAllOrders, deleteOrder } from "../../firebase/firestore";
import SitePage from "../layout/SitePage";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [orderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [userCache, setUserCache] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);

        // Fetch user profiles for all orders
        const cache = {};
        for (const order of ordersData) {
          if (order.uid && !cache[order.uid]) {
            try {
              const userProfile = await getUserProfile(order.uid);
              cache[order.uid] = userProfile;
            } catch (err) {
              console.error(`Error fetching user profile for ${order.uid}:`, err);
              cache[order.uid] = { firstName: "Unknown", lastName: "User", email: "N/A" };
            }
          }
        }
        setUserCache(cache);
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

  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsDialogOpen(true);
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
                    onClick={() => handleOpenOrderDetails(order)}
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

                    <Box sx={{ textAlign: "right" }}>
                      <Typography fontWeight={800} sx={{ mb: 0.5 }}>
                        Rs. {order.totalAmount || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {order.totalItems || 0} items
                      </Typography>
                    </Box>
                  </Box>
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
                        src={selectedUser?.profilePicture || `https://ui-avatars.com/api/?name=${((selectedUser?.firstName || "") + " " + (selectedUser?.lastName || "")).trim() || "User"}&background=random&size=128`}
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
                      {((selectedUser?.firstName || "") + " " + (selectedUser?.lastName || "")).trim() || selectedUser?.email || "Unknown User"}
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

        {/* ORDER DETAILS DIALOG */}
        <Dialog open={orderDetailsDialogOpen} onClose={() => setOrderDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#222", color: "#fff", borderBottom: "1px solid #444" }}>
            Order Details
            <IconButton
              onClick={() => setOrderDetailsDialogOpen(false)}
              sx={{ float: "right", color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#111", p: 3 }}>
            {selectedOrder && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {/* User Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                  onClick={() => {
                    setOrderDetailsDialogOpen(false);
                    handleShowUser(selectedOrder);
                  }}
                >
                  <img
                    src={userCache[selectedOrder.uid]?.profilePicture || `https://ui-avatars.com/api/?name=${((userCache[selectedOrder.uid]?.firstName || "") + " " + (userCache[selectedOrder.uid]?.lastName || "")).trim() || "User"}&background=random`}
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
                    <Typography fontWeight={700}>{((userCache[selectedOrder.uid]?.firstName || "") + " " + (userCache[selectedOrder.uid]?.lastName || "")).trim() || "Unknown User"}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {userCache[selectedOrder.uid]?.email || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Order Summary */}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                <Box>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Order ID:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                        {selectedOrder.id?.substring(0, 12) || "N/A"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Date:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                        {formatDate(selectedOrder.checkoutDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Status:
                      </Typography>
                      <Chip
                        label={selectedOrder.status || "completed"}
                        color={selectedOrder.status === "completed" ? "success" : "warning"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* Order Items */}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                <Box>
                  <Typography fontWeight={700} sx={{ color: "#fff", mb: 1.5, fontSize: 14 }}>
                    Order Items ({selectedOrder.totalItems || 0})
                  </Typography>
                  <Stack spacing={1}>
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: "#fff" }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#bbb" }}>
                              Rs. {item.price} × {item.quantity}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700} sx={{ color: "#fff" }}>
                            Rs. {item.subtotal || 0}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        No items
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Total */}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: "#fff" }}>
                    Rs. {selectedOrder.totalAmount || 0}
                  </Typography>
                </Box>

                {/* Delete Button */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Delete Order">
                    <IconButton
                      onClick={() => {
                        handleDelete(selectedOrder.id);
                        setOrderDetailsDialogOpen(false);
                      }}
                      sx={{
                        color: "#fff",
                        bgcolor: "#222",
                        borderRadius: 2,
                        border: "1px solid #fff",
                        flex: 1,
                      }}
                      disabled={deletingId === selectedOrder.id}
                      size="small"
                    >
                      {deletingId === selectedOrder.id ? (
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </SitePage>
  );
}
