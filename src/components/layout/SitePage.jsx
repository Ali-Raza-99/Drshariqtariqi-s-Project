import React, { useEffect, useMemo, useState } from "react";
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	Button,
	Container,
	CssBaseline,
	Dialog,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Slide,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";

import logoImg from "../../assets/logo.jpeg";
import oilImg from "../../assets/oil.jpeg";
import bakhorImg from "../../assets/bakhor.jpeg";
import powderImg from "../../assets/powder.jpeg";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../firebase/firestore";

const CartTransition = React.forwardRef(function CartTransition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

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

const routeByItem = {
	Home: "/",
	Courses: "/courses",
	Library: "/library",
	Product: "/products",
	"Ijtemai Qurbani": "/ijtemai-qurbani",
	"Mureed Counter": "/mureed-counter",
	"Ilm‑ul‑Adadad Calculator": "/ilm-ul-adadad-calculator",
	Istikhara: "/istikhara",
	Appointment: "/appointment",
};

const isRouteActive = (pathname, route) => {
	if (!route) return false;
	if (route === "/") return pathname === "/";
	return pathname.startsWith(route);
};

export default function SitePage({ children, maxWidth = "md" }) {
	const { currentUser, authLoading, logout } = useAuth();
	const location = useLocation();

	const [profilePicUrl, setProfilePicUrl] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminChecked, setAdminChecked] = useState(false);
	const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
	const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

	const [cartOpen, setCartOpen] = useState(false);

	const cartProducts = useMemo(
		() => [
			{ id: "oil", name: "Oil", price: 1200, image: oilImg },
			{ id: "bakhor", name: "Bakhor", price: 1500, image: bakhorImg },
			{ id: "powder", name: "Powder", price: 900, image: powderImg },
		],
		[]
	);

	const [cartQty, setCartQty] = useState(() => ({ oil: 0, bakhor: 0, powder: 0 }));
	const totalItems = cartProducts.reduce((sum, p) => sum + (cartQty[p.id] ?? 0), 0);
	const totalAmount = cartProducts.reduce(
		(sum, p) => sum + (cartQty[p.id] ?? 0) * p.price,
		0
	);

	const incCart = (id) =>
		setCartQty((prev) => ({ ...prev, [id]: Math.min(99, (prev[id] ?? 0) + 1) }));
	const decCart = (id) =>
		setCartQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));

	useEffect(() => {
		let cancelled = false;

		const loadProfile = async () => {
			if (!currentUser?.uid) {
				setProfilePicUrl(null);
				setIsAdmin(false);
				setAdminChecked(true);
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
				setIsAdmin(profile?.role === "admin");
				setAdminChecked(true);
			} catch {
				if (cancelled) return;
				setProfilePicUrl(currentUser.photoURL ?? null);
				setIsAdmin(false);
				setAdminChecked(true);
			}
		};

		loadProfile();
		return () => {
			cancelled = true;
		};
	}, [currentUser?.uid, currentUser?.photoURL]);

	useEffect(() => {
		if (isAdmin) setCartOpen(false);
	}, [isAdmin]);

	const openProfileMenu = (event) => setProfileMenuAnchorEl(event.currentTarget);
	const closeProfileMenu = () => setProfileMenuAnchorEl(null);
	const handleLogout = async () => {
		closeProfileMenu();
		await logout();
	};

	return (
		<>
			<CssBaseline />

			<AppBar
				position="fixed"
				elevation={0}
				sx={{
					background: "rgba(0,0,0,0.65)",
					backdropFilter: "blur(10px)",
				}}
			>
				<Container maxWidth="xl">
					<Toolbar
						disableGutters
						sx={{
							minHeight: { xs: 56, md: 72 },
							display: "flex",
							alignItems: "center",
						}}
					>
						<Box
							component={RouterLink}
							to="/"
							sx={{
								display: "flex",
								alignItems: "center",
								textDecoration: "none",
							}}
						>
							<Box
								component="img"
								src={logoImg}
								alt="Logo"
								sx={{ height: { xs: 40, md: 48 }, width: "auto" }}
							/>
						</Box>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
								justifyContent: "center",
								alignItems: "center",
								gap: 1,
							}}
						>
							{navItems.map((item) => {
								const to = routeByItem[item];
								const isActive = isRouteActive(location.pathname, to);

								return (
									<Button
										key={item}
										component={RouterLink}
										to={to}
										sx={{
											color: "white",
											fontWeight: 600,
											textTransform: "none",
											borderRadius: 2,
											px: 1.25,
											...(isActive
												? {
													backgroundColor: "rgba(255,255,255,0.08)",
													borderBottom: "2px solid rgba(255,255,255,0.9)",
												}
												: null),
											"&:hover": {
												backgroundColor: "rgba(255,255,255,0.08)",
											},
										}}
									>
										{item}
									</Button>
								);
							})}
						</Box>

						<IconButton
							sx={{
								display: { xs: "flex", md: "none" },
								color: "white",
								ml: "auto",
							}}
						>
							<MenuIcon />
						</IconButton>

						{!authLoading && (
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								{!currentUser ? (
									<Button
										component={RouterLink}
										to="/login"
										variant="outlined"
										sx={{
											color: "white",
											borderColor: "rgba(255,255,255,0.6)",
											textTransform: "none",
											fontWeight: 600,
											borderRadius: 4,
											px: 2,
											py: 0.8,
											transition:
												"transform 180ms ease, background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
											boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
											"&:hover": {
												borderColor: "rgba(255,255,255,0.9)",
												backgroundColor: "rgba(255,255,255,0.08)",
												transform: "translateY(-1px)",
												boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
											},
											"&:active": {
												transform: "translateY(0px) scale(0.98)",
												boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
											},
											"&:focus-visible": {
												outline: "2px solid rgba(255,255,255,0.55)",
												outlineOffset: 2,
											},
										}}
									>
										Login
									</Button>
								) : (
									<>
										{adminChecked && !isAdmin && (
											<IconButton
												onClick={() => setCartOpen(true)}
												sx={{
													color: "white",
													mr: 1,
													borderRadius: 3,
													border: "1px solid rgba(255,255,255,0.18)",
													backgroundColor: "rgba(255,255,255,0.06)",
													backdropFilter: "blur(8px)",
													transition:
														"transform 180ms ease, background-color 220ms ease",
													"&:hover": {
														backgroundColor: "rgba(255,255,255,0.10)",
														transform: "translateY(-1px)",
													},
													"&:active": {
														transform: "translateY(0px) scale(0.98)",
													},
												}}
												aria-label="Open cart"
											>
												<Badge
													badgeContent={totalItems}
													color="error"
													overlap="circular"
													sx={{
														"& .MuiBadge-badge": {
															border: "1px solid rgba(0,0,0,0.35)",
														},
													}}
												>
													<ShoppingCartOutlinedIcon />
												</Badge>
											</IconButton>
										)}

										<IconButton
											onClick={openProfileMenu}
											sx={{ p: 0, ml: { xs: 1, md: 0 } }}
											aria-label="Open profile menu"
										>
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

										{adminChecked && !isAdmin && (
											<Dialog
												open={cartOpen}
												onClose={() => setCartOpen(false)}
												fullWidth
												maxWidth="sm"
												TransitionComponent={CartTransition}
												transitionDuration={{ enter: 260, exit: 220 }}
												PaperProps={{
													sx: {
														bgcolor: "rgba(15, 15, 15, 0.92)",
														border: "1px solid rgba(255, 255, 255, 0.14)",
														borderRadius: 3,
														boxShadow: "0 20px 70px rgba(0,0,0,0.65)",
														backdropFilter: "blur(14px)",
														color: "#fff",
														overflow: "hidden",
												},
												}}
											>
												<Box
													sx={{
														px: 2.25,
														py: 1.75,
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														gap: 1,
													}}
												>
													<Box>
														<Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
															Your Cart
														</Typography>
														<Typography
															variant="body2"
															sx={{ opacity: 0.7, fontSize: 13, mt: 0.25 }}
														>
															{totalItems > 0
																? `${totalItems} item${totalItems === 1 ? "" : "s"} selected`
																: "No items selected yet"}
														</Typography>
													</Box>

													<IconButton
														onClick={() => setCartOpen(false)}
														sx={{ color: "rgba(255,255,255,0.85)" }}
														aria-label="Close cart"
													>
														<CloseIcon />
													</IconButton>
												</Box>

												<Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

												<Box sx={{ px: 2.25, py: 2 }}>
													<Stack spacing={1.5}>
														{cartProducts.map((p) => {
															const qty = cartQty[p.id] ?? 0;
															const lineTotal = qty * p.price;
															return (
																<Box
																	key={p.id}
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 1.25,
																		p: 1.25,
																		borderRadius: 2,
																		border: "1px solid rgba(255,255,255,0.12)",
																		bgcolor: "rgba(255,255,255,0.04)",
																		}}
																>
																	<Box
																		component="img"
																		src={p.image}
																		alt={p.name}
																		sx={{
																			width: 54,
																			height: 54,
																			borderRadius: 2,
																			objectFit: "cover",
																			border: "1px solid rgba(255,255,255,0.10)",
																		}}
																	/>

																	<Box sx={{ flex: 1, minWidth: 0 }}>
																		<Typography fontWeight={800} sx={{ lineHeight: 1.15 }}>
																			{p.name}
																		</Typography>
																		<Typography
																			variant="body2"
																			sx={{ opacity: 0.7, fontSize: 13, mt: 0.25 }}
																		>
																			Rs. {p.price}
																		</Typography>
																	</Box>

																	<Stack direction="row" spacing={0.75} alignItems="center">
																		<IconButton
																			onClick={() => decCart(p.id)}
																			sx={{
																			color: "#fff",
																			border: "1px solid rgba(255,255,255,0.24)",
																			bgcolor: "transparent",
																			"&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
																		}}
																			size="small"
																			aria-label={`Decrease ${p.name}`}
																		>
																			<RemoveIcon fontSize="small" />
																		</IconButton>

																		<Box
																			sx={{
																			minWidth: 36,
																			textAlign: "center",
																			py: 0.6,
																			borderRadius: 1.5,
																			border: "1px solid rgba(255,255,255,0.18)",
																			bgcolor: "rgba(0,0,0,0.25)",
																		}}
																		>
																			<Typography fontWeight={900} fontSize={13}>
																				{qty}
																			</Typography>
																		</Box>

																		<IconButton
																			onClick={() => incCart(p.id)}
																			sx={{
																			color: "#fff",
																			border: "1px solid rgba(255,255,255,0.24)",
																			bgcolor: "transparent",
																			"&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
																		}}
																			size="small"
																			aria-label={`Increase ${p.name}`}
																		>
																			<AddIcon fontSize="small" />
																		</IconButton>
																	</Stack>

																	<Box sx={{ width: 92, textAlign: "right" }}>
																		<Typography fontWeight={900} sx={{ lineHeight: 1.15 }}>
																			Rs. {lineTotal}
																		</Typography>
																		<Typography variant="caption" sx={{ opacity: 0.65 }}>
																			Subtotal
																		</Typography>
																	</Box>
																</Box>
															);
														})}
													</Stack>

													<Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

													<Box
														sx={{
														display: "flex",
														alignItems: "flex-start",
														justifyContent: "space-between",
														gap: 2,
													}}
													>
														<Box sx={{ flex: 1 }}>
															<Typography fontWeight={900} sx={{ mb: 0.75 }}>
																Order Summary
															</Typography>
															{totalItems === 0 ? (
																<Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13 }}>
																	Add items using + to see summary.
																</Typography>
															) : (
																<Stack spacing={0.4}>
																	{cartProducts
																		.filter((p) => (cartQty[p.id] ?? 0) > 0)
																		.map((p) => (
																			<Typography
																				key={`summary-${p.id}`}
																				variant="body2"
																				sx={{ opacity: 0.85, fontSize: 13 }}
																			>
																				{p.name} × {cartQty[p.id]} = Rs. {(cartQty[p.id] ?? 0) * p.price}
																			</Typography>
																		))}
																</Stack>
															)}
														</Box>

														<Box sx={{ textAlign: "right" }}>
															<Typography variant="caption" sx={{ opacity: 0.7 }}>
																Total
															</Typography>
															<Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1.1 }}>
																Rs. {totalAmount}
															</Typography>
														</Box>
													</Box>
												</Box>
											</Dialog>
										)}
									</>
								)}
							</Box>
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Box sx={{ minHeight: "100vh", bgcolor: "#000", color: "#fff", pt: { xs: 10, md: 12 } }}>
				<Container maxWidth={maxWidth}>{children}</Container>

				<Box sx={{ py: 3, background: "#111", color: "#aaa", mt: { xs: 6, md: 10 } }}>
					<Container>
						<Typography textAlign="center" fontSize={14}>
							© {new Date().getFullYear()} Shazli Ruhani Darsgah. All rights reserved.
						</Typography>
					</Container>
				</Box>
			</Box>
		</>
	);
}
