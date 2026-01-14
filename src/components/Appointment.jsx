// Remove blue autofill background for address field
import '../App.css';
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginFirstDialog from "./auth/LoginFirstDialog";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SocialMediaIcons from "./SocialMediaIcons";
import SitePage from "./layout/SitePage";
import { uploadToCloudinaryUnsigned } from "../utils/cloudinaryUpload";
import amliyatImg from "../assets/amliyat.jpg";

export default function Appointment() {
  // ...existing code...
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    gender: "",
    age: "",
    contact: "",
    address: "",
    city: "",
  });

  const [appointmentDate, setAppointmentDate] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePaymentSlipChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    setPaymentSlip(file);
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.fatherName &&
      formData.email &&
      formData.gender &&
      formData.age &&
      formData.contact &&
      formData.address &&
      formData.city &&
      appointmentDate !== null && appointmentDate !== '' &&
      paymentSlip !== null
    );
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    if (!currentUser) {
      setLoginDialogOpen(true);
      return;
    }
    if (!isFormValid()) {
      setError("Please fill all fields and upload payment slip");
      return;
    }
    setSubmitting(true);
    try {
      // Upload payment slip to Cloudinary
      let paymentSlipUrl = "";
      if (paymentSlip) {
        paymentSlipUrl = await uploadToCloudinaryUnsigned(paymentSlip);
      }
      // Prepare data
      const dataToSend = {
        ...formData,
        appointmentDate: appointmentDate ? (typeof appointmentDate === 'string' ? appointmentDate : appointmentDate.format ? appointmentDate.format('YYYY-MM-DD') : appointmentDate.toString()) : '',
        paymentSlipUrl,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userPhotoURL: currentUser.photoURL || '',
        createdAt: new Date().toISOString(),
      };
      // Save to Firestore
      await addDoc(collection(db, "Appointment"), dataToSend);
      setSuccessMsg("Your request has been submitted.");
      setFormData({
        name: "",
        fatherName: "",
        email: "",
        gender: "",
        age: "",
        contact: "",
        address: "",
        city: "",
      });
      setAppointmentDate(null);
      setPaymentSlip(null);
    } catch (err) {
      setError(err?.message || "Submission failed. Try again.");
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg("") , 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <SitePage>
      <Box
        sx={{
          minHeight: "100vh",
          // backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${amliyatImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h3"
            sx={{ textAlign: "center", color: "#fff", mb: 4, fontWeight: 900 }}
          >
            Appointment
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: { xs: 3, md: 4 },
              }}
            >
              <Grid container spacing={3}>

                {/* Alerts */}
                {successMsg && (
                  <Grid item xs={12}>
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
                  </Grid>
                )}
                {error && (
                  <Grid item xs={12}>
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
                      {error}
                    </Box>
                  </Grid>
                )}
  <LoginFirstDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />

                {/* BOX 1 */}
                <Grid size={12} item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2,border: "1px solid rgba(255,255,255,.15)" }}>
                    <Grid container spacing={2}>
                      <Grid size={4}> 
                        <TextField
                          fullWidth
                          label="Name *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </Grid>

                      <Grid size={4} item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Father Name *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          onChange={(e) => handleInputChange("fatherName", e.target.value)}
                        />
                      </Grid>

                      <Grid size={4} item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* BOX 2 */}
                <Grid size={12} item xs={12}>
                  <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,.15)", borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={4} item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={labelProps.sx}>Gender *</InputLabel>
                          <Select
                            label="Gender *"
                            sx={{ height: 40, borderRadius: 1, ...fieldSx }}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Appointment Date Field */}
                      <Grid size={4}  item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker 
                            label="Appointment Date *"
                            value={appointmentDate}
                            onChange={(newValue) => setAppointmentDate(newValue)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                sx: { ...fieldSx, '& .MuiOutlinedInput-root, & .MuiOutlinedInput-notchedOutline, & .dateFieldOfAppointment': { borderRadius: 2 } },
                                InputLabelProps: labelProps,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      {/* Age Date Field */}
                      <Grid size={4} item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Date of Birth (Age) *"
                            value={formData.age ? dayjs(formData.age) : null}
                            onChange={(newValue) => handleInputChange("age", newValue ? newValue.format('YYYY-MM-DD') : "")}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                sx: { ...fieldSx, '& .MuiOutlinedInput-root, & .MuiOutlinedInput-notchedOutline, & .dateFieldOfAppointment': { borderRadius: 16 } },
                                InputLabelProps: labelProps,
                                className: "ar"
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* BOX 3 */}
                <Grid size={12} item xs={12}>
                  <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,.15)", borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={4} item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Contact *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          onChange={(e) => handleInputChange("contact", e.target.value)}
                        />
                      </Grid>

                      <Grid size={4} item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="City *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </Grid>
                       <Grid size={4} item xs={12} md={6}>
                        <Button
                        sx={{ height: 40, borderRadius: 1 }}
                          fullWidth
                          component="label"
                          size="small"
                          variant="outlined"
                          startIcon={<CloudUploadOutlinedIcon />}
                        >
                            {paymentSlip ? "Selected" : "Upload Payment Slip *"}
                          <input hidden type="file" onChange={handlePaymentSlipChange} />
                        </Button>
                      </Grid>

                    </Grid>
                  </Box>
                </Grid>


                {/* BOX 5 */}
                <Grid size={12} item xs={12}>
                  <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,.15)", borderRadius: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Address *"
                          size="small"
                          sx={fieldSx}
                          InputLabelProps={labelProps}
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                  </Box>
                </Grid>

                {/* SUBMIT */}

                <Grid size={12} item xs={12} md={4}>
                  <Grid container spacing={2} direction="row">
                    <Grid size={6} item xs={12} md={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AccountBalanceIcon />}
                        onClick={() => setPaymentDialogOpen(true)}
                        sx={{ height: 56 }}
                      >
                        View Payment Details
                      </Button>
                    </Grid>
                    <Grid size={6} item xs={12} md={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || submitting}
                        sx={{ height: 56, fontWeight: 900,backgroundColor: "#7e7e7e",color: "#000", "&:hover": {backgroundColor: "#f5f5f5",color:"#4e4e4e !important"}, }}
                      >
                        {submitting ? <CircularProgress size={24} /> : "Submit"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Box>
          </LocalizationProvider>
        </Box>

        {/* PAYMENT DETAILS DIALOG */}
        {/* Payment Details Dialog */}
<Dialog
  open={paymentDialogOpen}
  onClose={() => setPaymentDialogOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: "rgba(17, 17, 17, 0.98)",
      backdropFilter: "blur(20px)",
      borderRadius: 3,
      border: "1px solid rgba(255,255,255,0.15)",
      color: "#fff",
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <AccountBalanceIcon sx={{ color: "#fff", fontSize: 28 }} />
      <Typography variant="h6" fontWeight={700}>
        Bank Account Details
      </Typography>
    </Box>

    <IconButton
      onClick={() => setPaymentDialogOpen(false)}
      sx={{ color: "rgba(255,255,255,0.7)" }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ py: 3 }}>
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 2,
        p: 3,
        mb: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.7)",
          mb: 2,
          fontSize: 14,
        }}
      >
        Please transfer Rs 3,000 to the following bank account:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Bank Name
          </Typography>
          <Typography fontWeight={600}>Meezan Bank</Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Account Title
          </Typography>
          <Typography fontWeight={600}>Dr. Shariq Tariqi</Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Account Number
          </Typography>
          <Typography fontWeight={700} fontSize={17} letterSpacing={1}>
            0123-4567-8901-2345
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            IBAN
          </Typography>
          <Typography fontWeight={600} fontSize={14}>
            PK12 MEZN 0001 2345 6789 0123
          </Typography>
        </Box>
      </Box>
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
      }}
    >
      After payment, please upload the payment slip before submitting your
      appointment.
    </Alert>
  </DialogContent>

  <DialogActions
    sx={{
      borderTop: "1px solid rgba(255,255,255,0.12)",
      p: 2,
    }}
  >
    <Button
      onClick={() => setPaymentDialogOpen(false)}
      variant="contained"
      sx={{
        bgcolor: "#8e8b8b",
      color: "#f4ecec !important",
        fontWeight: 700,
        textTransform: "none",
        "&:hover": {color:"#4e4e4e !important", bgcolor: "rgba(255,255,255,0.9)" },
      }}
    >
      Got it
    </Button>
  </DialogActions>
</Dialog>

      <SocialMediaIcons />
    </Box>
  </SitePage>
  );
}
