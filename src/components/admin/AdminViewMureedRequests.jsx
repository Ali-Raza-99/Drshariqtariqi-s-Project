
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Avatar } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { listMureeds } from "../../firebase/firestore";
import { deleteMureed } from "../../firebase/firestore";
import SitePage from "../layout/SitePage";


export default function AdminViewMureedRequests() {
  const [mureeds, setMureeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteMureed(id);
      setMureeds((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      // Optionally handle error
    }
    setDeletingId(null);
  };

  useEffect(() => {
    const fetchMureeds = async () => {
      setLoading(true);
      try {
        const data = await listMureeds();
        setMureeds(
          data.map((d) => ({
            id: d.id,
            name: d.name || '',
            fatherName: d.fatherName || '',
            pictureUrl: d.pictureUrl || '',
            contact: d.contact || '',
          }))
        );
      } catch (err) {
        setMureeds([]);
      }
      setLoading(false);
    };
    fetchMureeds();
  }, []);

  return (
    <SitePage maxWidth="lg">
      <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: 900, textAlign: "center", mt: { xs: 2, sm: 3 } }}>
        View Mureed Requests
      </Typography>
      <Box
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
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          ) : mureeds.length === 0 ? (
            <Typography sx={{ color: "#bbb", textAlign: "center", fontSize: 18 }}>
              No mureed requests found.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {mureeds.map((m) => (
                <Grid item xs={12} sm={12} md={6} key={m.id} sx={{ display: { xs: 'flex', sm: 'block' }, justifyContent: { xs: 'center', sm: 'initial' } }}>
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
                        src={m.pictureUrl || 'https://ui-avatars.com/api/?name=User'}
                        alt={m.name || 'User'}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer' }}
                        title="View Mureed Details"
                      />
                    </Box>
                    {/* Details in a row */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, height: 54 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 90, mr: 1, height: '100%', alignItems: 'flex-start' }}>
                        <Typography fontWeight={800} sx={{ fontSize: 16, lineHeight: 1.1, wordBreak: 'break-word' }}>
                          {typeof m.name === 'string' && m.name.length > 0 ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#bbb', fontSize: 12, lineHeight: 1, mt: 0.2 }}>
                          Father: {m.fatherName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 90, mr: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: 14 }}>
                          <span style={{ color: '#fff' }}>{m.contact}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.2 }}>
                        <Tooltip title="Delete Mureed Request">
                          <IconButton
                            onClick={() => handleDelete(m.id)}
                            sx={{ color: '#fff', bgcolor: '#222', borderRadius: 2, border: '1px solid #fff' }}
                            disabled={deletingId === m.id}
                            size="small"
                          >
                            {deletingId === m.id ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </SitePage>
  );
}
