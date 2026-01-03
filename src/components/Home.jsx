import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  CssBaseline,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink } from "react-router-dom";

import amliyatImg from "../assets/amliyat.jpg";
import slide1Img from "../assets/1.png";
import slide2Img from "../assets/2.png";
import logoImg from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../firebase/firestore";

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

const sliderItems = [
  {
    title: "Shazli Ruhani Darsgah",
    subtitle: "A Center of Spiritual Healing & Divine Knowledge",
    image: amliyatImg,
  },
  {
    title: "Spiritual Guidance",
    subtitle: "Based on Quran, Sunnah & Sufi Wisdom",
    image: slide1Img,
  },
  {
    title: "Learning & Resources",
    subtitle: "Courses, Library & More",
    image: slide2Img,
  },
];

export default function HomePage() {
  const { currentUser, authLoading, logout } = useAuth();
  const slides = useMemo(() => sliderItems, []);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

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
              {navItems.map((item) => (
                <Button
                  key={item}
                  component={
                    item === "Home" || item === "Product" ? RouterLink : "button"
                  }
                  to={
                    item === "Home" ? "/" : item === "Product" ? "/products" : undefined
                  }
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {item}
                </Button>
              ))}
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
            }}
          >
            <Container>
              <Typography variant="h2" color="white" fontWeight={700}>
                {activeSlide.title}
              </Typography>
              <Typography
                variant="h5"
                color="white"
                sx={{ mt: 2, maxWidth: 600 }}
              >
                {activeSlide.subtitle}
              </Typography>
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
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                About the Darsgah
              </Typography>
              <Typography color="text.secondary" lineHeight={1.8}>
                Shazli Ruhani Darsgah is dedicated to spreading spiritual
                knowledge, healing sciences, and divine wisdom under the
                guidance of Dr. Abdul Wajid Shazli. Our mission is to guide
                humanity through faith, knowledge, and spiritual discipline.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={amliyatImg}
                alt="About"
                sx={{ width: "100%", borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SERVICES SECTION */}
      <Box sx={{ py: 8, background: "#000", color: "white" }}>
        <Container>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            Our Services
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {["Istikhara", "Spiritual Healing", "Rohani Courses", "Appointments"].map(
              (service) => (
                <Grid item xs={12} md={3} key={service}>
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography fontWeight={600}>{service}</Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 3, background: "#111", color: "#aaa" }}>
        <Container>
          <Typography textAlign="center" fontSize={14}>
            © {new Date().getFullYear()} Shazli Ruhani Darsgah. All rights reserved.
          </Typography>
        </Container>
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
//               Shazli Ruhani Darsgah founded by Dr. Abdul Wajid Shazli shares spiritual wisdom in Sufism and healing sciences blending tradition with modern perspectives. Explore courses, library resources, and more.
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
