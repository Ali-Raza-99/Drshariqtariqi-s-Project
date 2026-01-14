
import React, { useState, useEffect } from "react";
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
import SocialMediaIcons from "./SocialMediaIcons";
import SitePage from "./layout/SitePage";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";
import { uploadToCloudinaryUnsigned } from "../utils/cloudinaryUpload";
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
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
    useEffect(() => {
      if (successMsg) {
        const timer = setTimeout(() => setSuccessMsg("") , 3500);
        return () => clearTimeout(timer);
      }
    }, [successMsg]);
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser } = useAuth();

  // Check if all fields are filled
  const isFormFilled = Object.entries(form).every(([key, value]) => {
    if (key === 'picture') return true; // picture is optional
    return value && String(value).trim() !== '';
  });

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
    if (!currentUser) {
      setLoginDialogOpen(true);
      return;
    }
    if (!isFormFilled) return;
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      let uploadedPhotoURL = '';
      if (form.picture) {
        uploadedPhotoURL = await uploadToCloudinaryUnsigned(form.picture);
      }
      const dataToSend = {
        ...form,
        dob: form.dob ? (typeof form.dob === 'string' ? form.dob : form.dob.format ? form.dob.format('YYYY-MM-DD') : form.dob.toString()) : '',
        pictureUrl: uploadedPhotoURL,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userPhotoURL: currentUser.photoURL || uploadedPhotoURL,
        createdAt: new Date().toISOString(),
      };
      delete dataToSend.picture;
      await registerMureed({ data: dataToSend });
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
      setSuccessMsg("Your request has been submitted.");
    } catch (err) {
      setErrorMsg(err?.message || 'Error uploading mureed.');
      console.error('Error uploading mureed:', err);
    }
    setSubmitting(false);
  };

  return (
    <SitePage>
      <LoginFirstDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
      <Box sx={{ width: '100%', pt: { xs: 4, md: 6 } }}>
         <Typography
           variant="h3"
           sx={{ textAlign: 'center', color: '#fff', mb: 1, fontWeight: 900 }}
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
            {successMsg && (
                 <Box
                   mb={2}
                   sx={{
                     background: 'rgba(60,60,60,0.45)',
                     color: '#43a047',
                     p: 2,
                     borderRadius: 2,
                     textAlign: 'center',
                     fontWeight: 600,
                     border: '1px solid rgba(67,160,71,0.25)',
                     boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)',
                     backdropFilter: 'blur(2px)',
                   }}
                 >
                   {successMsg}
                 </Box>
               )}
               {errorMsg && (
                 <Box
                   mb={2}
                   sx={{
                     background: 'rgba(60,60,60,0.45)',
                     color: '#e53935',
                     p: 2,
                     borderRadius: 2,
                     textAlign: 'center',
                     fontWeight: 600,
                     border: '1px solid rgba(229,57,53,0.25)',
                     boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)',
                     backdropFilter: 'blur(2px)',
                   }}
                 >
                   {errorMsg}
                 </Box>
               )}
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
                      disabled={submitting || !isFormFilled || !currentUser}
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

  <SocialMediaIcons />
export default MureedCounter;

