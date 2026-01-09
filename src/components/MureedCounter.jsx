// ...existing code...

function MureedCounter() {
  // ...component implementation...
}

export default MureedCounter;
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
import LoginFirstDialog from "./auth/LoginFirstDialog";

