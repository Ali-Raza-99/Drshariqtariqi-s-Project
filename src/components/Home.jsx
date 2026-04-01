import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Badge,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CartQuantityControl from "./cart/CartQuantityControl";
import CartDialog from "./cart/CartDialog";
import CartNavbarIcon from "./cart/CartNavbarIcon";
import SocialMediaIcons from "./SocialMediaIcons";

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

// CartTransition removed, handled in CartDialog

// TikTok Icon Component
const TikTokIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.34 0 .67.05 1 .15V9.02a7.02 7.02 0 0 0-.62-.08A4.72 4.72 0 0 0 5.78 13.14a4.71 4.71 0 0 0 4.71 4.72 4.7 4.7 0 0 0 4.71-4.72V10.81a7.08 7.08 0 0 0 4.09 1.31v-3.73a4.83 4.83 0 0 1-.59-.03Z" />
  </svg>
);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Handle WhatsApp click - opens chat with phone number
  const handleWhatsApp = () => {
    const phoneNumber = "923182392985"; // +92 country code for Pakistan
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  // Handle Email click - opens default mail client
  const handleEmail = () => {
    window.location.href = "mailto:hakeemshariqtariqtariqijahangir@gmail.com";
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
              { icon: <YouTubeIcon />, url: "https://youtube.com/@SahibzadaShariqTariqi", label: "YouTube", external: true },
              { icon: <InstagramIcon />, url: "https://instagram.com/SahibzadaShariqTariqi", label: "Instagram", external: true },
              { icon: <TikTokIcon />, url: "https://tiktok.com/@SahibzadaShariqTariqi", label: "TikTok", external: true },
              { icon: <WhatsAppIcon />, label: "WhatsApp", onClick: handleWhatsApp },
              { icon: <EmailIcon />, label: "Email", onClick: handleEmail },
            ].map((social) => (
              <IconButton
                key={social.label}
                {...(social.external ? {
                  component: "a",
                  href: social.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                } : {
                  onClick: social.onClick,
                })}
                aria-label={social.label}
                title={social.label}
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
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
                      <CartNavbarIcon totalItems={totalItems} onClick={() => setCartOpen(true)} />
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
                      <CartDialog
                        open={cartOpen}
                        onClose={() => setCartOpen(false)}
                        cartProducts={cartProducts}
                        cartQty={cartQty}
                        incCart={incCart}
                        decCart={decCart}
                        totalItems={totalItems}
                        totalAmount={totalAmount}
                      />
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
            {getNavItems(isAdmin, !!currentUser).map((item) => {
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