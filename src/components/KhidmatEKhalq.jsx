import React, { useEffect, useMemo, useState, useCallback } from "react";
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
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	Slide,
	Stack,
	Toolbar,
	Typography,
	CircularProgress,
	Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SocialMediaIcons from "./SocialMediaIcons";
import Footer from "./layout/Footer";

import logoImg from "../assets/logo.jpeg";
import oilImg from "../assets/oil.jpeg";
import bakhorImg from "../assets/bakhor.jpeg";
import powderImg from "../assets/powder.jpeg";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getUserProfile } from "../firebase/firestore";
import { getNavTo, getNavItems, isNavItemActive, navItems } from "./layout/navConfig";
import slide5Img from "../assets/5.png";

// Default content structure
const DEFAULT_CONTENT = {
	title: "Khidmat e Khalq",
	description:
		"Khidmat e Khalq, which translates to 'Service to Humanity,' is a noble initiative dedicated to serving the community and helping those in need. This program embodies the spirit of compassion, generosity, and selfless service, following the teachings of Islam to care for and support our fellow human beings.",
	sections: [
		{
			id: "mission",
			heading: "Our Mission",
			content:
				"Through Khidmat e Khalq, we strive to provide essential support and assistance to underprivileged members of our community. Our mission is to spread kindness, offer relief to those facing hardships, and create a positive impact in society through various charitable activities and welfare programs.",
		},
		{
			id: "activities",
			heading: "What We Do",
			items: [
				"Provide food and essential supplies to families in need",
				"Organize community welfare programs and charitable events",
				"Offer support during religious occasions and community gatherings",
				"Facilitate educational and spiritual guidance initiatives",
			],
		},
		{
			id: "involvement",
			heading: "Get Involved",
			content:
				"We welcome everyone who wishes to contribute to this noble cause. Whether through donations, volunteering, or spreading awareness, every effort makes a difference in transforming lives and building a stronger, more compassionate community.",
		},
	],
};

const CartTransition = React.forwardRef(function CartTransition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function KhidmatEKhalq() {
	const { currentUser, authLoading, logout } = useAuth();
	const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
	const location = useLocation();

	// State management
	const [profilePicUrl, setProfilePicUrl] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminChecked, setAdminChecked] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
	const [cartOpen, setCartOpen] = useState(false);
	const [pageContent, setPageContent] = useState(DEFAULT_CONTENT);
	const [contentLoading, setContentLoading] = useState(false);
	const [contentError, setContentError] = useState(null);

	const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

	// Static products for this page
	const pageProducts = useMemo(
		() => [
			{ id: "oil", name: "Oil", price: 1200, image: oilImg },
			{ id: "bakhor", name: "Bakhor", price: 1500, image: bakhorImg },
			{ id: "powder", name: "Powder", price: 900, image: powderImg },
		],
		[]
	);

	// Load user profile
	useEffect(() => {
		let isMounted = true;

		const loadProfile = async () => {
			if (!currentUser?.uid) {
				setProfilePicUrl(null);
				setIsAdmin(false);
				setAdminChecked(true);
				return;
			}

			try {
				const profile = await getUserProfile(currentUser.uid);
				if (!isMounted) return;

				const profilePic =
					profile?.profilePicture ??
					profile?.photoURL ??
					profile?.profilePicUrl ??
					profile?.avatarUrl ??
					currentUser.photoURL ??
					null;

				setProfilePicUrl(profilePic);
				setIsAdmin(profile?.role === "admin");
				setAdminChecked(true);
			} catch (err) {
				if (!isMounted) return;
				console.error("Error loading profile:", err);
				setProfilePicUrl(currentUser.photoURL ?? null);
				setIsAdmin(false);
				setAdminChecked(true);
			}
		};

		loadProfile();
		return () => {
			isMounted = false;
		};
	}, [currentUser?.uid, currentUser?.photoURL]);

	// Load page content (can be from Firestore later)
	useEffect(() => {
		const loadContent = async () => {
			setContentLoading(true);
			setContentError(null);
			try {
				// TODO: Replace with Firestore fetch when content collection is created
				// const content = await getKhidmatContent();
				// setPageContent(content);
				setPageContent(DEFAULT_CONTENT);
				setContentLoading(false);
			} catch (err) {
				console.error("Error loading page content:", err);
				setContentError("Failed to load page content");
				setPageContent(DEFAULT_CONTENT);
				setContentLoading(false);
			}
		};

		loadContent();
	}, []);

	// Profile menu handlers
	const openProfileMenu = useCallback(
		(event) => setProfileMenuAnchorEl(event.currentTarget),
		[]
	);
	const closeProfileMenu = useCallback(() => setProfileMenuAnchorEl(null), []);

	const handleLogout = useCallback(async () => {
		closeProfileMenu();
		try {
			await logout();
		} catch (err) {
			console.error("Logout error:", err);
		}
	}, [logout, closeProfileMenu]);

	// Get cart items from global context that match this page's products
	const pageCartItems = useMemo(() => {
		return pageProducts.map((product) => {
			const cartItem = cartItems.find((item) => item.id === product.id);
			return {
				...product,
				quantity: cartItem?.quantity ?? 0,
			};
		});
	}, [pageProducts, cartItems]);

	const totalItems = pageCartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
	const totalAmount = pageCartItems.reduce(
		(sum, item) => sum + (item.quantity ?? 0) * item.price,
		0
	);

	const incCart = (id) => updateQuantity(id, (cartItems.find((i) => i.id === id)?.quantity ?? 0) + 1);
	const decCart = (id) => updateQuantity(id, Math.max(0, (cartItems.find((i) => i.id === id)?.quantity ?? 0) - 1));

	if (authLoading || !adminChecked) {
		return <CircularProgress />;
	}

	return (
		<>
			<CssBaseline />

			{/* NAVBAR */}
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
								const to = getNavTo(item);
								const isActive = isNavItemActive(item, location.pathname);

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
							onClick={() => setMobileMenuOpen(true)}
							sx={{
								display: { xs: "flex", md: "none" },
								color: "white",
								ml: "auto",
							}}
							aria-label="Open mobile menu"
						>
							<MenuIcon />
						</IconButton>

						{!authLoading && (
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								{!currentUser ? (
									<>
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
									</>
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
														{pageProducts.map((p) => {
															const qty = pageCartItems.find(item => item.id === p.id)?.quantity ?? 0;
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
																	{pageCartItems
																		.filter((p) => (p.quantity ?? 0) > 0)
																		.map((p) => (
																			<Typography
																				key={`summary-${p.id}`}
																				variant="body2"
																				sx={{ opacity: 0.85, fontSize: 13 }}
																			>
																				{p.name} × {p.quantity} = Rs. {(p.quantity ?? 0) * p.price}
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

			{/* MOBILE NAVIGATION DRAWER */}
			<Drawer
				anchor="left"
				open={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				sx={{
					"& .MuiDrawer-paper": {
						bgcolor: "rgba(17, 17, 17, 0.98)",
						backdropFilter: "blur(10px)",
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			>
				<Box
					sx={{
						width: 280,
						bgcolor: "rgba(17, 17, 17, 0.98)",
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<List sx={{ flex: 1, overflowY: "auto" }}>
					{getNavItems(isAdmin, currentUser !== null).map((item) => {
							const to = getNavTo(item);
							const isActive = isNavItemActive(item, location.pathname);
							return (
								<ListItemButton
									key={item}
									component={RouterLink}
									to={to}
									onClick={() => setMobileMenuOpen(false)}
									sx={{
										color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
										bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
										borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
										pl: 2,
										"&:hover": {
											bgcolor: "rgba(255,255,255,0.08)",
											color: "#fff",
										},
									}}
								>
									<ListItemText primary={item} />
								</ListItemButton>
							);
						})}
					</List>
					<Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
					<Box sx={{ p: 2 }}>
						{!currentUser ? (
							<Button
								component={RouterLink}
								to="/login"
								variant="contained"
								fullWidth
								onClick={() => setMobileMenuOpen(false)}
								sx={{
									bgcolor: "rgba(76, 175, 80, 0.85)",
									color: "#fff",
									fontWeight: 600,
									textTransform: "none",
									"&:hover": { bgcolor: "rgba(76, 175, 80, 1)" },
								}}
							>
								Login
							</Button>
						) : (
							<Button
								onClick={() => {
									handleLogout();
									setMobileMenuOpen(false);
								}}
								variant="outlined"
								fullWidth
								sx={{
									color: "#fff",
									borderColor: "rgba(255,255,255,0.5)",
									textTransform: "none",
									fontWeight: 600,
									"&:hover": {
										borderColor: "#fff",
										bgcolor: "rgba(255,255,255,0.1)",
									},
								}}
							>
								Logout
							</Button>
						)}
					</Box>
				</Box>
			</Drawer>

			{/* PAGE CONTENT */}
			<Box
				sx={{
					minHeight: "100vh",
					color: "#fff",
					pt: { xs: 10, md: 12 },
					backgroundColor: "#fff",
					backgroundImage: `url(${slide5Img})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundAttachment: "fixed",
				}}
			>
				<Container maxWidth="md">
					<Stack spacing={2.5} sx={{ py: { xs: 4, md: 6 } }}>
						<Typography variant="h4" fontWeight={900}>
							Khidmat e Khalq
						</Typography>
						<Typography sx={{ opacity: 0.85, lineHeight: 1.8 }}>
							Khidmat e Khalq, which translates to "Service to Humanity," is a noble initiative dedicated to serving the community and helping those in need. This program embodies the spirit of compassion, generosity, and selfless service, following the teachings of Islam to care for and support our fellow human beings.
						</Typography>

						<Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

						<Stack spacing={1}>
							<Typography variant="h6" fontWeight={800}>
								Our Mission
							</Typography>
							<Typography sx={{ opacity: 0.85, lineHeight: 1.8 }}>
								Through Khidmat e Khalq, we strive to provide essential support and assistance to underprivileged members of our community. Our mission is to spread kindness, offer relief to those facing hardships, and create a positive impact in society through various charitable activities and welfare programs.
							</Typography>
						</Stack>

						<Stack spacing={1}>
							<Typography variant="h6" fontWeight={800}>
								What We Do
							</Typography>
							<Typography sx={{ opacity: 0.85 }}>
								- Provide food and essential supplies to families in need
							</Typography>
							<Typography sx={{ opacity: 0.85 }}>
								- Organize community welfare programs and charitable events
							</Typography>
							<Typography sx={{ opacity: 0.85 }}>
								- Offer support during religious occasions and community gatherings
							</Typography>
							<Typography sx={{ opacity: 0.85 }}>
								- Facilitate educational and spiritual guidance initiatives
							</Typography>
						</Stack>

						<Stack spacing={1}>
							<Typography variant="h6" fontWeight={800}>
								Get Involved
							</Typography>
							<Typography sx={{ opacity: 0.85, lineHeight: 1.8 }}>
								We welcome everyone who wishes to contribute to this noble cause. Whether through donations, volunteering, or spreading awareness, every effort makes a difference in transforming lives and building a stronger, more compassionate community.
							</Typography>
						</Stack>
					</Stack>
				</Container>

				<SocialMediaIcons />
				<Footer />
			</Box>
		</>
	);
}
