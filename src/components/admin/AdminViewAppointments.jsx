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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getUserProfile } from "../../firebase/firestore";
import { db } from "../../firebase/firestore";
import SitePage from "../layout/SitePage";

export default function AdminViewAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "Appointment"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchAppointments();
  }, [deletingId]);

  const handleShowImage = (url) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "Appointment", id));
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      // Optionally handle error
    }
    setDeletingId(null);
  };

  // Fetch user details from users collection using userId
  const handleShowUser = async (appointment) => {
    setUserLoading(true);
    setUserDialogOpen(true);
    try {
      if (appointment.userId) {
        const userProfile = await getUserProfile(appointment.userId);
        setSelectedUser({ ...userProfile, ...appointment });
      } else {
        setSelectedUser(appointment);
      }
    } catch (e) {
      setSelectedUser(appointment);
    }
    setUserLoading(false);
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
        View Appointments
      </Typography>
      <Box
        className="admin-appointments-container"
        sx={{
          bgcolor: "transparent",
          minHeight: { xs: '60vh', sm: '66vh' },
          py: { xs: 1, sm: 2 },
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
          mb: { xs: '60px', sm: '79px' },
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', sm: 900 }, mx: "auto", px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8}}>
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          ) : appointments.length === 0 ? (
            <Typography sx={{ color: "#bbb", textAlign: "center", fontSize: 18 }}>
              No appointments found.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {appointments.map((a) => (
                  <Grid item xs={12} sm={12} md={6} key={a.id} sx={{ display: { xs: 'flex', sm: 'block' }, justifyContent: { xs: 'center', sm: 'initial' } }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      position: 'relative',
                      minHeight: 60,
                    }}
                  >
                    {/* User Photo */}
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', height: 54 }}>
                      <img
                        src={a.userPhotoURL || 'https://ui-avatars.com/api/?name=User'}
                        alt={a.name || 'User'}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer' }}
                        onClick={() => handleShowUser(a)}
                        title="View User Details"
                      />
                    </Box>
                    {/* Details and icons in a row */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, height: 54 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 90, mr: 1, height: '100%', alignItems: 'flex-start' }}>
                        <Typography fontWeight={800} sx={{ fontSize: 16, lineHeight: 1.1, wordBreak: 'break-word' }}>
                          {typeof a.name === 'string' && a.name.length > 0
                            ? a.name.charAt(0).toUpperCase() + a.name.slice(1)
                            : a.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 90, mr: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: 14 }}>
                          <span style={{ color: '#fff' }}>{a.contact}</span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#bbb', fontSize: 12, lineHeight: 1, mt: 0.2 }}>
                          {a.city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.2 }}>
                        <Tooltip title="Delete Appointment">
                          <IconButton
                            onClick={() => handleDelete(a.id)}
                            sx={{ color: '#fff', bgcolor: '#222', borderRadius: 2, border: '1px solid #fff' }}
                            disabled={deletingId === a.id}
                            size="small"
                          >
                            {deletingId === a.id ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        {a.paymentSlipUrl && (
                          <Tooltip title="View Payment Slip">
                            <IconButton
                              onClick={() => handleShowImage(a.paymentSlipUrl)}
                              sx={{ color: '#fff', bgcolor: '#222', borderRadius: 2, border: '1px solid #fff' }}
                              size="small"
                            >
                              <ImageIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        {/* Payment Slip Dialog */}
        <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#222", color: "#fff", borderBottom: "1px solid #444" }}>
            Payment Slip
            <IconButton
              onClick={() => setImageDialogOpen(false)}
              sx={{ float: "right", color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#111", p: 3, textAlign: "center" }}>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Payment Slip"
                style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, border: "1px solid #fff" }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* User Details Dialog */}
        <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: "#222", color: "#fff", borderBottom: "1px solid #444" }}>
            Appointment Details
            <IconButton
              onClick={() => setUserDialogOpen(false)}
              sx={{ float: "right", color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#111", p: 3 }}>
            {userLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <CircularProgress sx={{ color: '#fff' }} />
              </Box>
            ) : selectedUser && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {userLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                    <CircularProgress sx={{ color: '#fff' }} />
                  </Box>
                ) : selectedUser && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <img
                      src={selectedUser.userPhotoURL || 'https://ui-avatars.com/api/?name=User'}
                      alt={selectedUser.name || 'User'}
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', marginBottom: 8 }}
                    />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                      {(() => {
                        const n = selectedUser.name || selectedUser.displayName || 'N/A';
                        return typeof n === 'string' && n.length > 0
                          ? n.charAt(0).toUpperCase() + n.slice(1)
                          : n;
                      })()}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb' }}>
                      <b>Contact:</b> {selectedUser.contact || selectedUser.phoneNumber || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb' }}>
                      <b>Email:</b> {selectedUser.email || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb', textAlign: 'center', width: '100%' }}>
                      <b>Address:</b> {selectedUser.address || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb' }}>
                      <b>Gender:</b> {selectedUser.gender || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb' }}>
                      <b>Appointment Date:</b> {selectedUser.appointmentDate ? (selectedUser.appointmentDate.toDate ? selectedUser.appointmentDate.toDate().toLocaleDateString() : String(selectedUser.appointmentDate)) : 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bbb' }}>
                      <b>Booking On:</b> {selectedUser.createdAt
                        ? (selectedUser.createdAt.toDate
                            ? selectedUser.createdAt.toDate().toLocaleDateString()
                            : (typeof selectedUser.createdAt === 'string' && selectedUser.createdAt.length >= 10
                                ? selectedUser.createdAt.substring(0, 10)
                                : String(selectedUser.createdAt)))
                        : 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </SitePage>
  );
}
