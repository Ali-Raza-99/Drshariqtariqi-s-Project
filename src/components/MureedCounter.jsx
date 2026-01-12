
import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SitePage from "./layout/SitePage";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";
import { uploadToFolderAndGetUrl } from "../firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { registerMureed } from "../firebase/firestore";
import LoginFirstDialog from "./auth/LoginFirstDialog";

function MureedCounter() {
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    contact: '',
    country: '',
    city: '',
    dob: null,
    address: '',
    picture: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, dob: date }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, picture: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Prepare data for Firestore (convert date to string if needed)
      const dataToSend = {
        ...form,
        dob: form.dob ? (typeof form.dob === 'string' ? form.dob : form.dob.format ? form.dob.format('YYYY-MM-DD') : form.dob.toString()) : '',
        picture: undefined, // Don't send file directly
      };
      await registerMureed({ data: dataToSend });
      // Optionally reset form or show success
      setForm({
        name: '',
        fatherName: '',
        contact: '',
        country: '',
        city: '',
        dob: null,
        address: '',
        picture: null,
      });
      setPreview(null);
      // Optionally show a success message
    } catch (err) {
      // Optionally show an error message
      console.error('Error uploading mureed:', err);
    }
    setSubmitting(false);
  };

  return (
    <SitePage>
      <Box sx={{ width: '100%', pt: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{ textAlign: 'center', color: '#fff', mb: 0, fontWeight: 900 }}
        >
          Mureed Registry
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            background: 'none',
            width: '100%',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              minWidth: { xs: '90vw', sm: 1000 },
              maxWidth: 1200,
              boxShadow: 3,
              border: 'none',
            }}
          >
            <Grid container spacing={2} direction="row">
              {/* First Row: Name, Father Name, Contact */}
              <Grid size={12} item xs={12}>
                <Grid container spacing={2} direction="row">
                  <Grid size={4} item xs={12} sm={4}>
                    <TextField
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={4} item xs={12} sm={4}>
                    <TextField
                      label="Father Name"
                      name="fatherName"
                      value={form.fatherName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={4} item xs={12} sm={4}>
                    <TextField
                      label="Contact"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Second Row: Country, City, DOB */}
              <Grid size={12} item xs={12}>
                <Grid container spacing={2} direction="row">
                  <Grid size={4} item xs={12} sm={4}>
                    <TextField
                      label="Country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={4} item xs={12} sm={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={4} item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={form.dob}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} name="dob" fullWidth required />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
              {/* Third Row: Address, Picture, Submit */}
              <Grid size={12} item xs={12}>
                <Grid container spacing={2} alignItems="center" direction="row">
                  <Grid size={4} item xs={12} sm={5}>
                    <TextField
                      label="Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={4} item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadOutlinedIcon />}
                      className="mureed-picture-btn"
                      sx={{
                        width: '100%',
                        height: 56,
                      }}
                    >
                      {form.picture ? 'Picture Selected' : 'Select Picture'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePictureChange}
                      />
                    </Button>
                  </Grid>
                  <Grid size={4} item xs={12} sm={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="mureed-submit-btn"
                      sx={{
                        height: 56,
                        fontWeight: 700,
                        boxShadow: 2,
                      }}
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </SitePage>
  );
}

export default MureedCounter;

