import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Badge,
  Divider,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareIcon from "@mui/icons-material/Share";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CartQuantityControl from "./cart/CartQuantityControl";

import slide1Img from "../assets/1.png";
import slide5Img from "../assets/5.png";
import logoImg from "../assets/mainlogo.png";
import oilImg from "../assets/oil.jpeg";
import shariq from "../assets/shariq.jpeg";
import bakhorImg from "../assets/bakhor.jpeg";
import powderImg from "../assets/powder.jpeg";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../firebase/firestore";
import { getNavItems, getNavTo, isNavItemActive } from "./layout/navConfig";
import Footer from "./layout/Footer";

const CartTransition = React.forwardRef(function CartTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const sliderItems = [
  {
    title: "Hakeem Shariq Tariq",
    subtitle: "A Center of Spiritual Healing & Divine Knowledge",
    image: slide1Img,
  },
  {
    title: "Spiritual Guidance",
    subtitle: "Based on Quran, Sunnah & Sufi Wisdom",
    image: slide5Img,
  },
  {
    title: "Learning & Resources",
    subtitle: "Courses, Products & More",
    image: slide1Img,
  },
];

export default function HomePage() {
  const { currentUser, authLoading, logout } = useAuth();
  const location = useLocation();
  const slides = useMemo(() => sliderItems, []);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
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

  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  const goPrev = () =>
    setActiveSlideIndex(
      (current) => (current - 1 + slides.length) % slides.length
    );
  const goNext = () =>
    setActiveSlideIndex((current) => (current + 1) % slides.length);

  const activeSlide = slides[activeSlideIndex];

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


  // Show social icons for users and unlogged users on all pages
  // For admin, show only on home page (location.pathname === "/")
  const showSocialIcons = (!isAdmin) || (isAdmin && location.pathname === "/");

  return (
    <>
      <CssBaseline />
      {showSocialIcons && (
        <Box
          sx={{
            position: "fixed",
            left: 16,
            bottom: 60,
            zIndex: 1000,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            sx={{
              width: 50,
              height: 50,
              bgcolor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
              },
              "&:hover ~ .social-icons": {
                opacity: 1,
                transform: "translateX(0)",
                pointerEvents: "auto",
              },
            }}
          >
            <ShareIcon />
          </IconButton>

          <Box
            className="social-icons"
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              opacity: 0,
              transform: "translateX(-20px)",
              pointerEvents: "none",
              transition: "all 0.4s ease",
              "&:hover": {
                opacity: 1,
                transform: "translateX(0)",
                pointerEvents: "auto",
              },
            }}
          >
            {[
              { icon: <FacebookIcon />, url: "https://facebook.com", label: "Facebook" },
              { icon: <YouTubeIcon />, url: "https://youtube.com", label: "YouTube" },
              { icon: <InstagramIcon />, url: "https://instagram.com", label: "Instagram" },
              { icon: <TwitterIcon />, url: "https://twitter.com", label: "Twitter" },
              { icon: <WhatsAppIcon />, url: "https://whatsapp.com", label: "WhatsApp" },
            ].map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          backgroundImage: `url(${slide5Img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
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
              {getNavItems(isAdmin, !!currentUser).map((item) => {
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
                          transition: "transform 180ms ease, background-color 220ms ease",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.10)",
                            transform: "translateY(-1px)",
                          },
                          "&:active": { transform: "translateY(0px) scale(0.98)" },
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
                                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13, mt: 0.25 }}>
                                    Rs. {p.price}
                                  </Typography>
                                </Box>

                                <CartQuantityControl
                                  quantity={qty}
                                  onIncrease={() => incCart(p.id)}
                                  onDecrease={() => decCart(p.id)}
                                  maxQuantity={99}
                                  productName={p.name}
                                />

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

      {/* HERO SLIDER */}
      <Box sx={{ mt: 8 }}>
        <Box
          sx={{
            height: "85vh",
            backgroundImage: `url(${activeSlide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Container>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" color="white" fontWeight={700}>
                  {activeSlide.title}
                </Typography>
                <Typography
                  variant="h5"
                  color="white"
                  sx={{ mt: 2, mx: "auto", maxWidth: 600 }}
                >
                  {activeSlide.subtitle}
                </Typography>
              </Box>
            </Container>
          </Box>

          <IconButton
            aria-label="Previous slide"
            onClick={goPrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            onClick={goNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            {slides.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveSlideIndex(index)}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={0}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundColor:
                    index === activeSlideIndex
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ABOUT SECTION */}
      <Box
        sx={{
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              height: "100%",
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: { xs: "column",sm:'row', md: "row" },
              alignItems: "center",
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                flex: 1,
                color: "#fff",
              }}
            >
              <Typography 
                variant="h4" 
                fontWeight={700} 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  color: "#fff"
                }}
              >
                About Hakeem Shariq Tariq
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8, 
                  color: "rgba(255,255,255,0.85)", 
                  fontSize: { xs: "0.95rem", md: "1rem" }
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error 
                sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae 
                ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </Typography>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={shariq}
                alt="Hakeem Shariq Tariq"
                sx={{
                  width: "465px",
                  height: "465px",
                  objectFit: "cover",
                  borderRadius: 3,
                  border: "2px solid rgba(255,255,255,0.2)",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SERVICES SECTION */}
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4} md={4}>
              <Box
                component={RouterLink}
                to={isAdmin ? "/admin/appointments/add" : "/appointment"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 5,
                  px: 5.2,
                  minHeight: 280,
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <CalendarMonthIcon
                    sx={{
                      fontSize: 60,
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  Appointments
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Box
                component={RouterLink}
                to={isAdmin ? "/admin/courses/add" : "/courses"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 5,
                  px: 8,
                  minHeight: 280,
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <SchoolIcon
                    sx={{
                      fontSize: 60,
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  Courses
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Box
                component={RouterLink}
                to={isAdmin ? "/admin/products/add" : "/products"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 5,
                  px: 8,
                  minHeight: 280,
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <ShoppingBagIcon
                    sx={{
                      fontSize: 60,
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  Products
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
      </Box>
    </>
  );
}
//       <CssBaseline />

//       {/* Navbar */}
//       <AppBar position="fixed" color="transparent" sx={{ backdropFilter: "blur(10px)", boxShadow: "none" }}>
//         <Container>
//           <Toolbar disableGutters>
//             <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fff" }}>
//               Shazli Ruhani Darsgah
//             </Typography>

//             {navItems.map((item) => (
//               <Button
//                 key={item}
//                 component={item === "Home" ? RouterLink : "button"}
//                 to={item === "Home" ? "/" : undefined}
//                 sx={{ color: "#fff", fontWeight: "600" }}
//               >
//                 {item}
//               </Button>
//             ))}
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* Hero Slider */}
//       <Box
//         sx={{
//           height: "80vh",
//           mt: 8,
//           background: "#000",
//           color: "#fff",
//           position: "relative",
//         }}
//       >
//         <Box
//           sx={{
//             height: "80vh",
//             backgroundImage: `url(${slides[activeSlideIndex]})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <Box sx={{ p: 6 }}>
//             <HeroText variant="h2">Welcome to Our Community</HeroText>
//             <HeroText variant="h5" sx={{ mt: 2 }}>
//               Rooted in Spiritual Wisdom & Modern Healing
//             </HeroText>
//           </Box>
//         </Box>

//         <IconButton
//           aria-label="Previous slide"
//           onClick={goPrev}
//           sx={{
//             position: "absolute",
//             left: 16,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "#fff",
//             backgroundColor: "rgba(0,0,0,0.35)",
//             "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
//           }}
//         >
//           <ChevronLeftIcon />
//         </IconButton>
//         <IconButton
//           aria-label="Next slide"
//           onClick={goNext}
//           sx={{
//             position: "absolute",
//             right: 16,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "#fff",
//             backgroundColor: "rgba(0,0,0,0.35)",
//             "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
//           }}
//         >
//           <ChevronRightIcon />
//         </IconButton>

//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             left: "50%",
//             transform: "translateX(-50%)",
//             display: "flex",
//             gap: 1,
//           }}
//         >
//           {slides.map((_, index) => (
//             <Box
//               key={index}
//               onClick={() => setActiveSlideIndex(index)}
//               role="button"
//               aria-label={`Go to slide ${index + 1}`}
//               tabIndex={0}
//               sx={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 backgroundColor:
//                   index === activeSlideIndex
//                     ? "rgba(255,255,255,0.95)"
//                     : "rgba(255,255,255,0.45)",
//               }}
//             />
//           ))}
//         </Box>
//       </Box>

//       {/* Intro Section */}
//       <Container sx={{ py: 6 }}>
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h4" gutterBottom fontWeight="700">
//               About Shazli Ruhani Darsgah
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Shazli Ruhani Darsgah founded by Hakeem Shariq Tariq shares spiritual wisdom in Sufism and healing sciences blending tradition with modern perspectives. Explore courses, library resources, and more.
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box
//               component="img"
//               src="/images/about.jpg"
//               alt="About Section"
//               sx={{ width: "100%", borderRadius: "8px" }}
//             />
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };

// export default HomePage;
