import React, { useEffect, useMemo, useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink } from "react-router-dom";

import logoImg from "../../assets/logo.jpeg";
import { useAuth } from "../../context/AuthContext";
import {
	createProduct,
	deleteProduct,
	getUserProfile,
	listProducts,
	updateProduct,
} from "../../firebase/firestore";
import { uploadToCloudinaryUnsigned } from "../../utils/cloudinaryUpload";

const navItems = [
	"Home",
	"Courses",
	"Library",
	"Product",
	"Ijtemai Qurbani",
	"Mureed Counter",
	"Ilm‑ul‑Adadad Calculator",
	"Istikhara",
	"Appointment",
];

export default function Admin() {
	const { currentUser, authLoading, logout } = useAuth();
	const [profilePicUrl, setProfilePicUrl] = useState(null);
	const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
	const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

	const [products, setProducts] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const [editingId, setEditingId] = useState(null);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");

	const isEditing = Boolean(editingId);

	const resetForm = () => {
		setEditingId(null);
		setName("");
		setPrice("");
		setImageFile(null);
		setImageUrl("");
	};

	const refreshProducts = async () => {
		setLoadingProducts(true);
		try {
			const data = await listProducts();
			setProducts(Array.isArray(data) ? data : []);
		} finally {
			setLoadingProducts(false);
		}
	};

	useEffect(() => {
		refreshProducts();
	}, []);

	useEffect(() => {
		let cancelled = false;

		const loadProfile = async () => {
			if (!currentUser?.uid) {
				setProfilePicUrl(null);
				return;
			}

			try {
				const profile = await getUserProfile(currentUser.uid);
				if (cancelled) return;

				const fromFirestore =
					profile?.profilePicture ??
					profile?.photoURL ??
					profile?.profilePicUrl ??
					profile?.avatarUrl ??
					null;
				setProfilePicUrl(fromFirestore ?? currentUser.photoURL ?? null);
			} catch {
				if (cancelled) return;
				setProfilePicUrl(currentUser.photoURL ?? null);
			}
		};

		loadProfile();
		return () => {
			cancelled = true;
		};
	}, [currentUser?.uid, currentUser?.photoURL]);

	const openProfileMenu = (event) => setProfileMenuAnchorEl(event.currentTarget);
	const closeProfileMenu = () => setProfileMenuAnchorEl(null);
	const handleLogout = async () => {
		closeProfileMenu();
		await logout();
	};

	const canSubmit = useMemo(() => {
		const parsed = Number(price);
		if (!name.trim()) return false;
		if (!Number.isFinite(parsed) || parsed <= 0) return false;
		if (!imageFile && !imageUrl) return false;
		return true;
	}, [name, price, imageFile, imageUrl]);

	const onPickImage = (event) => {
		const file = event.target.files?.[0] ?? null;
		event.target.value = "";
		setImageFile(file);
		setError("");
	};

	const startEdit = (product) => {
		setEditingId(product.id);
		setName(String(product.name ?? ""));
		setPrice(String(product.price ?? ""));
		setImageUrl(String(product.imageUrl ?? ""));
		setImageFile(null);
		setError("");
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDelete = async (id) => {
		setError("");
		setSaving(true);
		try {
			await deleteProduct(id);
			await refreshProducts();
			if (editingId === id) resetForm();
		} catch (e) {
			setError(e?.message || "Failed to delete product");
		} finally {
			setSaving(false);
		}
	};

	const handleSave = async () => {
		setError("");
		setSaving(true);
		try {
			let finalImageUrl = imageUrl;
			if (imageFile) {
				finalImageUrl = await uploadToCloudinaryUnsigned(imageFile);
			}

			const payload = {
				name: name.trim(),
				price: Number(price),
				imageUrl: finalImageUrl,
			};

			if (isEditing) {
				await updateProduct({ id: editingId, data: payload });
			} else {
				await createProduct({ data: payload });
			}

			await refreshProducts();
			resetForm();
		} catch (e) {
			setError(e?.message || "Failed to save product");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<CssBaseline />

			<AppBar
				position="fixed"
				elevation={0}
				sx={{ background: "#000", backdropFilter: "blur(10px)" }}
			>
				<Container maxWidth="xl">
					<Grid
						container
						alignItems="center"
						sx={{ minHeight: { xs: 56, md: 72 } }}
					>
						<Grid item>
							<Box
								component={RouterLink}
								to="/"
								sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
							>
								<Box
									component="img"
									src={logoImg}
									alt="Logo"
									sx={{ height: { xs: 40, md: 48 }, width: "auto" }}
								/>
							</Box>
						</Grid>

						<Grid
							item
							sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center", gap: 1 }}
						>
							{navItems.map((item) => (
								<Button
									key={item}
									component={
										item === "Home" || item === "Product" ? RouterLink : "button"
									}
									to={item === "Home" ? "/" : item === "Product" ? "/products" : undefined}
									sx={{ color: "white", fontWeight: 600, textTransform: "none" }}
								>
									{item}
								</Button>
							))}
						</Grid>

						<Grid item sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
							<IconButton sx={{ color: "white" }}>
								<MenuIcon />
							</IconButton>
						</Grid>

						{!authLoading && currentUser && (
							<Grid item sx={{ ml: 1 }}>
								<IconButton onClick={openProfileMenu} sx={{ p: 0 }}>
									<Avatar
										src={profilePicUrl ?? undefined}
										alt={currentUser.displayName ?? "Profile"}
										sx={{ width: 40, height: 40 }}
									/>
								</IconButton>

								<Menu
									anchorEl={profileMenuAnchorEl}
									open={isProfileMenuOpen}
									onClose={closeProfileMenu}
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									transformOrigin={{ vertical: "top", horizontal: "right" }}
								>
									<MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
										<LogoutIcon fontSize="small" />
										Logout
									</MenuItem>
								</Menu>
							</Grid>
						)}
					</Grid>
				</Container>
			</AppBar>

			<Box
				sx={{
					minHeight: "100vh",
					pt: { xs: 8, md: 10 },
					pb: 8,
					bgcolor: "#000",
					color: "#fff",
				}}
			>
				<Container maxWidth="xl">
					<Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>
						Admin
					</Typography>
					<Typography sx={{ mt: 0.5, opacity: 0.8 }}>
						Manage products (add, edit, delete)
					</Typography>

					<Box
						sx={{
							mt: 3,
							border: "1px solid rgba(255,255,255,0.14)",
							borderRadius: 3,
							bgcolor: "rgba(255,255,255,0.06)",
							p: { xs: 2, md: 2.5 },
						}}
					>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label="Product name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									size="small"
									InputLabelProps={{ sx: { color: "rgba(255,255,255,0.75)" } }}
									sx={{
										"& .MuiOutlinedInput-root": { color: "#fff" },
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: "rgba(255,255,255,0.22)",
										},
										"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
											borderColor: "rgba(255,255,255,0.35)",
										},
									}}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									fullWidth
									label="Price"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									size="small"
									inputMode="decimal"
									InputLabelProps={{ sx: { color: "rgba(255,255,255,0.75)" } }}
									sx={{
										"& .MuiOutlinedInput-root": { color: "#fff" },
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: "rgba(255,255,255,0.22)",
										},
										"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
											borderColor: "rgba(255,255,255,0.35)",
										},
									}}
								/>
							</Grid>
							<Grid item xs={12} md={5}>
								<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
									<Button
										variant="outlined"
										component="label"
										sx={{
											color: "white",
											borderColor: "rgba(255,255,255,0.35)",
											textTransform: "none",
											borderRadius: 3,
										}}
									>
										{imageFile ? "Image selected" : "Choose image"}
										<input type="file" accept="image/*" hidden onChange={onPickImage} />
									</Button>

									<Typography sx={{ opacity: 0.75, fontSize: 13 }}>
										{imageUrl ? "Current image saved" : "Upload a new image"}
									</Typography>
								</Box>
							</Grid>

							<Grid item xs={12}>
								<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
									<Button
										variant="contained"
										disabled={!canSubmit || saving}
										onClick={handleSave}
										sx={{
											textTransform: "none",
											fontWeight: 800,
											borderRadius: 3,
											bgcolor: "#fff",
											color: "#111",
											"&:hover": { bgcolor: "grey.800", color: "#fff" },
										}}
									>
										{isEditing ? "Save changes" : "Add product"}
									</Button>
									{isEditing && (
										<Button
											variant="outlined"
											disabled={saving}
											onClick={resetForm}
											sx={{
												textTransform: "none",
												borderRadius: 3,
												color: "white",
												borderColor: "rgba(255,255,255,0.35)",
											}}
										>
											Cancel
										</Button>
									)}
								</Box>
								{error ? (
									<Typography sx={{ mt: 1, color: "#ff8a8a", fontSize: 13 }}>
										{error}
									</Typography>
								) : null}
							</Grid>
						</Grid>
					</Box>

					<Box sx={{ mt: 3 }}>
						<Typography variant="h6" fontWeight={800}>
							Products
						</Typography>

						{loadingProducts ? (
							<Typography sx={{ mt: 1, opacity: 0.8 }}>
								Loading...
							</Typography>
						) : products.length === 0 ? (
							<Typography sx={{ mt: 1, opacity: 0.8 }}>
								No products yet.
							</Typography>
						) : (
							<Grid container spacing={2} sx={{ mt: 1 }}>
								{products.map((p) => (
									<Grid item xs={12} md={6} lg={4} key={p.id}>
										<Box
											sx={{
												border: "1px solid rgba(255,255,255,0.14)",
												borderRadius: 3,
												bgcolor: "rgba(255,255,255,0.06)",
												p: 2,
											}}
										>
											<Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
												<Box
													component="img"
													src={p.imageUrl}
													alt={p.name}
													sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: 2 }}
												/>
												<Box sx={{ flexGrow: 1, minWidth: 0 }}>
													<Typography fontWeight={900} sx={{ textTransform: "uppercase" }}>
														{String(p.name ?? "")}
													</Typography>
													<Typography sx={{ opacity: 0.85 }}>
														PKR {Number(p.price ?? 0)}
													</Typography>
												</Box>
											</Box>

											<Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
												<Button
													variant="contained"
													disabled={saving}
													onClick={() => startEdit(p)}
													sx={{
														textTransform: "none",
														fontWeight: 800,
														borderRadius: 3,
														bgcolor: "#fff",
														color: "#111",
														"&:hover": { bgcolor: "grey.800", color: "#fff" },
													}}
												>
													Edit
												</Button>
												<Button
													variant="outlined"
													disabled={saving}
													onClick={() => handleDelete(p.id)}
													sx={{
														textTransform: "none",
														borderRadius: 3,
														color: "white",
														borderColor: "rgba(255,255,255,0.35)",
														"&:hover": { borderColor: "rgba(255,255,255,0.55)" },
													}}
												>
													Delete
												</Button>
											</Box>
										</Box>
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</Container>
			</Box>
		</>
	);
}
