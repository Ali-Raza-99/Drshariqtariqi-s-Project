import React, { useMemo, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	IconButton,
	InputAdornment,
	Link,
	Paper,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import bgImage from "../../assets/6.png";
import { firebaseErrorMessage } from "../../utils/firebaseErrorMessage";

export default function Signup() {
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const navigate = useNavigate();
	const { signup } = useAuth();

	const gridItemSx = {
		width: "100%",
		maxWidth: { xs: "100%", sm: 223 },
		mx: "auto",
	};

	const initialFormData = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		dateOfBirth: null,
		gender: "Male",
		motherName: "",
		fatherName: "",
		address: "",
		country: "",
		contact: "",
		userType: "Patient",
		profilePicture: null,
	};

	const [formData, setFormData] = useState(initialFormData);
	const [profilePictureError, setProfilePictureError] = useState("");

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfilePictureChange = (event) => {
		const file = event.target.files?.[0] ?? null;
		// allow selecting same file again
		event.target.value = "";

		if (!file) {
			setProfilePictureError("");
			setFormData((prev) => ({ ...prev, profilePicture: null }));
			return;
		}
		if (!file.type?.startsWith("image/")) {
			setProfilePictureError("Please select an image file");
			setFormData((prev) => ({ ...prev, profilePicture: null }));
			return;
		}

		setProfilePictureError("");
		setFormData((prev) => ({ ...prev, profilePicture: file }));
	};

	const isNonEmpty = (v) => String(v ?? "").trim().length > 0;
	const isFormValid = useMemo(() => {
		return (
			isNonEmpty(formData.firstName) &&
			isNonEmpty(formData.lastName) &&
			isNonEmpty(formData.email) &&
			isNonEmpty(formData.password) &&
			Boolean(formData.dateOfBirth) &&
			isNonEmpty(formData.gender) &&
			isNonEmpty(formData.motherName) &&
			isNonEmpty(formData.fatherName) &&
			isNonEmpty(formData.address) &&
			isNonEmpty(formData.country) &&
			isNonEmpty(formData.contact) &&
			isNonEmpty(formData.userType)
		);
	}, [formData]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitAttempted(true);
		setProfilePictureError("");
		if (!isFormValid) {
			setSubmitError("Please fill in all required fields.");
			return;
		}
		setSubmitError("");
		setSubmitting(true);
		try {
			await signup(formData);
			setFormData(initialFormData);
			setProfilePictureError("");
			setSubmitAttempted(false);
			navigate("/login", { replace: true });
		} catch (err) {
			setSubmitError(firebaseErrorMessage(err, "Signup failed"));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box
				sx={{
					minHeight: "100vh",
					bgcolor: "#000",
					backgroundImage: `url(${bgImage})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
					display: "flex",
					alignItems: "center",
					justifyContent: { xs: "center", md: "flex-end" },
					px: { xs: 2, md: 6 },
					py: 4,
				}}
			>
				<Paper
					elevation={0}
					sx={{
						width: "100%",
						maxWidth: 720,
						p: { xs: 2, sm: 3, md: 4 },
						borderRadius: 3,
						bgcolor: "rgba(15, 15, 15, 0.32)",
						border: "1px solid rgba(255, 255, 255, 0.14)",
						boxShadow: "0 8px 30px rgba(0,0,0,.75)",
						backdropFilter: "blur(14px)",
						color: "#fff",
						"& .MuiTypography-root": {
							color: "inherit",
						},
						"& .MuiInputLabel-root": {
							color: "rgba(255, 255, 255, 0.72)",
						},
						"& .MuiInputLabel-root.Mui-focused": {
							color: "#fff",
						},
						"& .MuiOutlinedInput-root": {
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
						"& .MuiOutlinedInput-input": {
							color: "#fff",
						},
						"& input:-webkit-autofill": {
							WebkitTextFillColor: "#fff",
							caretColor: "#fff",
							WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
							transition: "background-color 9999s ease-in-out 0s",
						},
						"& input:-webkit-autofill:hover": {
							WebkitTextFillColor: "#fff",
							caretColor: "#fff",
							WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
						},
						"& input:-webkit-autofill:focus": {
							WebkitTextFillColor: "#fff",
							caretColor: "#fff",
							WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
						},
						"& input:-moz-autofill": {
							boxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
							WebkitTextFillColor: "#fff",
						},
						"& .MuiFormLabel-root": {
							color: "rgba(255, 255, 255, 0.72)",
						},
						"& .MuiRadio-root": {
							color: "rgba(255, 255, 255, 0.65)",
						},
						"& .MuiRadio-root.Mui-checked": {
							color: "#fff",
						},
					}}
				>
					<Typography
						variant="h5"
						fontWeight={700}
						sx={{ mb: 0.5, textAlign: "center", color: "#7c7cff" }}
					>
						Sign up
					</Typography>
					<Typography
						variant="body2"
						sx={{ mb: 3, color: "rgba(255, 255, 255, 0.65)", textAlign: "center" }}
					>
						Create your account to continue.
					</Typography>
					{submitError ? (
						<Typography sx={{ mb: 2, color: "error.main",color:'#d53c3c !important' }} textAlign="center">
							{submitError}
						</Typography>
					) : null}

					<Box component="form" onSubmit={handleSubmit} noValidate>
						<Grid
							container
							spacing={{ xs: 1.5, sm: 2 }}
							justifyContent="center"
							sx={{ maxWidth: 640, mx: "auto" }}
						>
							{/* First + Last name (same line) */}
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<TextField
									fullWidth
									label="First Name"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.firstName)}
									helperText={submitAttempted && !isNonEmpty(formData.firstName) ? "Required" : ""}
								/>
							</Grid>
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Last Name"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.lastName)}
									helperText={submitAttempted && !isNonEmpty(formData.lastName) ? "Required" : ""}
								/>
							</Grid>

							{/* Email (full line) */}
							<Grid sx={gridItemSx} item xs={12}>
								<TextField
									fullWidth
									label="Email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.email)}
									helperText={submitAttempted && !isNonEmpty(formData.email) ? "Required" : ""}
								/>
							</Grid>

							{/* Password + DOB (same line) */}
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.password)}
									helperText={submitAttempted && !isNonEmpty(formData.password) ? "Required" : ""}
									FormHelperTextProps={{ sx: { color: 'red' } }}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label={showPassword ? "Hide password" : "Show password"}
													onClick={() => setShowPassword((v) => !v)}
													edge="end"
												>
													{showPassword ? (
														<VisibilityOffOutlinedIcon />
													) : (
														<VisibilityOutlinedIcon />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<DatePicker
									label="Date of Birth"
									value={formData.dateOfBirth}
									onChange={(newValue) => {
										setFormData((prev) => ({
											...prev,
											dateOfBirth: newValue ? dayjs(newValue) : null,
										}));
								}}
									slotProps={{
										textField: {
											fullWidth: true,
											size: "small",
											required: true,
											error: submitAttempted && !formData.dateOfBirth,
											helperText: submitAttempted && !formData.dateOfBirth ? "Required" : "",
											FormHelperTextProps: { sx: { color: 'red' } },
									},
								}}
								/>
							</Grid>

							{/* Profile picture (Firebase Storage) */}
							<Grid sx={gridItemSx} item xs={12}>
								<Button
									component="label"
									variant="outlined"
									startIcon={
										<CloudUploadOutlinedIcon
											sx={{
												color: formData.profilePicture
													? "#fff"
													: "rgba(255, 255, 255, 0.72)",
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
										bgcolor: "rgba(17, 17, 17, 0.35)",
										borderColor: "rgba(255, 255, 255, 0.12)",
										color: formData.profilePicture ? "#fff" : "rgba(255, 255, 255, 0.72)",
										fontSize: 13,
										"& .MuiButton-startIcon": {
											mr: 1,
										},
										"&:hover": {
											bgcolor: "rgba(17, 17, 17, 0.35)",
											borderColor: "rgba(255, 255, 255, 0.18)",
										},
									}}
								>
									{formData.profilePicture ? formData.profilePicture.name : "Upload profile picture"}
									<input
										hidden
										type="file"
										accept="image/*"
										onChange={handleProfilePictureChange}
									/>
								</Button>
								{profilePictureError ? (
									<Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "error.main" }}>
										{profilePictureError}
									</Typography>
								) : null}
							</Grid>

							{/* Mother + Father name (same line) */}
							<Grid sx={gridItemSx} item xs={12}>
								<TextField
									fullWidth
									label="Mother Name"
									name="motherName"
									value={formData.motherName}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.motherName)}
									helperText={submitAttempted && !isNonEmpty(formData.motherName) ? "Required" : ""}
								/>
							</Grid>
							<Grid sx={gridItemSx} item xs={12}>
								<TextField
									fullWidth
									label="Father Name"
									name="fatherName"
									value={formData.fatherName}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.fatherName)}
									helperText={submitAttempted && !isNonEmpty(formData.fatherName) ? "Required" : ""}
								/>
							</Grid>

							{/* User type */}
							<Grid sx={gridItemSx} item xs={12}>
								<TextField
									fullWidth
									label="User Type"
									name="userType"
									value={
										formData.userType
											? `${formData.userType}`.charAt(0).toUpperCase() + `${formData.userType}`.slice(1)
											: ""
									}
									disabled
									size="small"
								/>
							</Grid>

							{/* Address */}
							<Grid sx={gridItemSx} item xs={12}>
								<TextField
									fullWidth
									label="Address"
									name="address"
									value={formData.address}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.address)}
									helperText={submitAttempted && !isNonEmpty(formData.address) ? "Required" : ""}
								/>
							</Grid>

							{/* Country + Contact */}
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Country"
									name="country"
									value={formData.country}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.country)}
									helperText={submitAttempted && !isNonEmpty(formData.country) ? "Required" : ""}
								/>
							</Grid>
							<Grid sx={gridItemSx} item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Contact"
									name="contact"
									value={formData.contact}
									onChange={handleChange}
									size="small"
									required
									error={submitAttempted && !isNonEmpty(formData.contact)}
									helperText={submitAttempted && !isNonEmpty(formData.contact) ? "Required" : ""}
								/>
							</Grid>

							{/* Gender (last) */}
							<Grid sx={gridItemSx} item xs={12}>
								<FormControl fullWidth>
									<FormLabel>Gender</FormLabel>
									<RadioGroup
										row
										name="gender"
										value={formData.gender}
										onChange={handleChange}
										sx={{ flexWrap: "wrap" }}
									>
										<FormControlLabel
											value="Male"
											control={<Radio />}
											label="Male"
											sx={{ whiteSpace: "nowrap" }}
										/>
										<FormControlLabel
											value="Female"
											control={<Radio />}
											label="Female"
											sx={{ whiteSpace: "nowrap" }}
										/>
									</RadioGroup>
								</FormControl>
								{submitAttempted && !isNonEmpty(formData.gender) ? (
									<Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "error.main" }}>
										Gender is required
									</Typography>
								) : null}
							</Grid>

							{/* Submit (big button at end) */}
							<Grid sx={gridItemSx} item xs={12}>
								<Button
									type="submit"
									variant="contained"
									fullWidth
									disabled={submitting || !isFormValid}
									startIcon={
										submitting ? <CircularProgress size={18} sx={{ color: "#111" }} /> : null
									}
									sx={{
										py: 1.75,
										borderRadius: 2,
										textTransform: "none",
										fontSize: 15,
										fontWeight: 700,
										bgcolor: "#fff",
										color: "#393737 !important",
										"&:hover": { bgcolor: "#7b7777 !important", color: "#fff !important" },
										"&.Mui-disabled": {
											bgcolor: "rgba(255, 255, 255, 0.35)",
											color: "rgba(0, 0, 0, 0.45)",
										},
									}}
								>
									{submitting ? "Signing up..." : "Sign Up"}
								</Button>
							</Grid>

							{/* Already have an account */}
							<Grid sx={gridItemSx} item xs={12}>
								<Typography
									variant="body2"
									sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.75)" }}
								>
									Already have an account?{" "}
									<Link
										component={RouterLink}
										to="/login"
										underline="hover"
										sx={{ color: "inherit", fontWeight: 700 }}
									>
										Login
									</Link>
								</Typography>
								<Typography
									variant="body2"
									sx={{ mt: 1, textAlign: "center", color: "rgba(255, 255, 255, 0.75)" }}
								>
									<Link
										component={RouterLink}
										to="/"
										underline="hover"
										sx={{ color: "inherit", fontWeight: 700 }}
									>
										Back to Home
									</Link>
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Box>
		</LocalizationProvider>
	);
}
