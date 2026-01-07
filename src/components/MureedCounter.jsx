import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
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

import amliyatImg from "../assets/amliyat.jpg";

export default function MureedCounter() {
  const [pictureFile, setPictureFile] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const fieldSx = {
    "& .MuiInputBase-root": {
      height: 40,
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: "8px",
      color: "#fff",
      bgcolor: "rgba(17, 17, 17, 0.35)",
      borderRadius: 2,
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.18)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.14)",
      },
    },
    "& input": {
      height: "40px",
      padding: "0 14px",
      boxSizing: "border-box",
    },
    "& input[type='date']": {
      paddingRight: "14px",
    },
    "& .MuiSvgIcon-root": {
      color: "rgba(255,255,255,0.85)",
    },
    "& input:-webkit-autofill": {
      WebkitTextFillColor: "#fff",
      caretColor: "#fff",
      WebkitBoxShadow:
        "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
      transition: "background-color 9999s ease-in-out 0s",
    },
  };

  const labelProps = {
    sx: { color: "rgba(255,255,255,0.75)" },
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setPictureFile(file);
  };

  return (
    <SitePage>
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mt: { xs: 2, md: 3 } }}>
          <Box
            component="img"
            src={amliyatImg}
            alt="About"
            sx={{ width: "100%", borderRadius: 2 }}
          />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              mt: 3,
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 4,
              backgroundColor: "rgba(0,0,0,0.22)",
              backdropFilter: "blur(8px)",
              p: { xs: 2, md: 2.5 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                width: "100%",
                maxWidth: 980,
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="Name" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="Father Name" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="Contact Number" type="tel" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="Country" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="City" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              {/* ✅ ONLY DATE INPUT FIX */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(newValue) =>
                    setDateOfBirth(newValue ? dayjs(newValue) : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: false,
                      size: "small",
                      InputLabelProps: { ...labelProps, shrink: true },
                      sx: {
                        ...fieldSx,

                        /* 🔥 EXACT DEVTOOLS WIDTH FIX */
                        "& .MuiPickersSectionList-root": {
                          width: "167px",
                        },

                        "& .MuiOutlinedInput-root": {
                          height: 40,
                          bgcolor: "rgba(17, 17, 17, 0.35)",
                          borderRadius: 2,
                        },
                        "& .MuiOutlinedInput-input": {
                          height: "40px",
                          padding: "0 14px",
                          fontSize: 13,
                          boxSizing: "border-box",
                        },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth size="small" label="Address" InputLabelProps={labelProps} sx={fieldSx} />
              </Grid>

              {/* ⛔ UNTOUCHED UPLOAD BUTTON */}
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={
                    <CloudUploadOutlinedIcon
                      sx={{
                        color: pictureFile
                          ? "#fff"
                          : "rgba(255,255,255,0.72)",
                      }}
                    />
                  }
                  fullWidth
                  sx={{
                    height: 40,
                    borderRadius: 2,
                    textTransform: "none",
                    justifyContent: "flex-start",
                    px: 1.75,
                    pr: "108px",
                    bgcolor: "rgba(17, 17, 17, 0.35)",
                    borderColor: "rgba(255,255,255,0.22)",
                    color: pictureFile
                      ? "#fff"
                      : "rgba(255,255,255,0.72)",
                    fontSize: 13,
                    "&:hover": {
                      bgcolor: "rgba(17, 17, 17, 0.35)",
                      borderColor: "rgba(255,255,255,0.35)",
                    },
                  }}
                >
                  {pictureFile ? pictureFile.name : "Upload picture"}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                  />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: 900,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    color: "#000",
                    px: 11.1,
                    py: 1,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.88)",
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />
      </Box>
    </SitePage>
  );
}
