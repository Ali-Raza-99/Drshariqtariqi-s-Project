import React, { useMemo, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";

import bgImg from "../assets/5.png";
import logoImg from "../assets/mainlogo.png";
import CourseCard from "./CourseCard";
import { useAuth } from "../context/AuthContext";
import { getNavTo, isNavItemActive, getNavItems } from "./layout/navConfig";
import {
  getUserProfile,
  listCourses,
} from "../firebase/firestore";


export default function Courses() {
  const { currentUser, authLoading, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fallbackCourses = useMemo(
    () => [],
    []
  );

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;
      try {
        setLoadingCourses(true);
        const data = await listCourses();
        if (cancelled) return;

        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(fallbackCourses);
        }
      } catch {
        if (cancelled) return;
        setCourses(fallbackCourses);
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, fallbackCourses]);

  const coursesPerView = isMdUp ? 4 : isSmUp ? 2 : 1;
  const maxStartIndex = Math.max(0, courses.length - coursesPerView);
  const [courseStartIndex, setCourseStartIndex] = useState(0);
  React.useEffect(() => {
    setCourseStartIndex(0);
  }, [coursesPerView, courses.length]);

  const courseViewportRef = useRef(null);
  const courseTrackRef = useRef(null);
  const [courseStepPx, setCourseStepPx] = useState(0);
  const [courseItemWidthPx, setCourseItemWidthPx] = useState(0);

  React.useLayoutEffect(() => {
    const viewport = courseViewportRef.current;
    const track = courseTrackRef.current;
    if (!viewport || !track) return;

    const computeStep = () => {
      const viewportWidth = viewport.getBoundingClientRect().width;
      if (!viewportWidth) return;

      const styles = window.getComputedStyle(track);
      const gapValue = styles.columnGap || styles.gap || styles.rowGap || "0px";
      const gap = Number.parseFloat(gapValue) || 0;

      const itemWidth =
        (viewportWidth - gap * (coursesPerView - 1)) / coursesPerView;
      if (!Number.isFinite(itemWidth) || itemWidth <= 0) return;

      const roundedItemWidth = Math.max(1, Math.floor(itemWidth));
      const roundedStep = Math.max(1, Math.floor(roundedItemWidth + gap));
      setCourseItemWidthPx(roundedItemWidth);
      setCourseStepPx(roundedStep);
    };

    computeStep();
    const resizeObserver = new ResizeObserver(() => computeStep());
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [coursesPerView]);

  const translateX = Math.round(courseStepPx * courseStartIndex);
  const goPrevCourse = () =>
    setCourseStartIndex((i) => Math.max(0, i - 1));
  const goNextCourse = () =>
    setCourseStartIndex((i) => Math.min(maxStartIndex, i + 1));

  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  React.useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!currentUser?.uid) {
        setProfilePicUrl(null);
        if (!cancelled) {
          setIsAdmin(false);
          setAdminChecked(true);
        }
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

  const openProfileMenu = (event) => setProfileMenuAnchorEl(event.currentTarget);
  const closeProfileMenu = () => setProfileMenuAnchorEl(null);
  const handleLogout = async () => {
    closeProfileMenu();
    await logout();
  };

  const openDetailsDialog = (course) => {
    console.log("Opening details for course:", course);
    console.log("Course detail:", course.detail);
    setSelectedCourse(course);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedCourse(null);
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
              {getNavItems(isAdmin).map((item) => {
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

      <Box
        sx={{
          minHeight: "100vh",
          color: "#fff",
          pt: { xs: 8, md: 10 },
          pb: 8,
          backgroundColor: "#fff",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              backgroundColor: "transparent",
              borderRadius: 0,
              p: { xs: 1.5, md: 2 },
            }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
              <Grid item xs={12}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  textAlign="left"
                  sx={{ color: "white" }}
                >
                  Courses
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                position: "relative",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(0,0,0,0.22)",
                backdropFilter: "blur(8px)",
                p: { xs: 2, md: 2.5 },
                overflow: "hidden",
                "--pv": coursesPerView,
                "--cardGap": { xs: "16px", md: "24px" },
              }}
              >
              <IconButton
                aria-label="Previous courses"
                onClick={goPrevCourse}
                disabled={courseStartIndex === 0}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(6px)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.55)" },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.35)" },
                  zIndex: 2,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                aria-label="Next courses"
                onClick={goNextCourse}
                disabled={courseStartIndex >= maxStartIndex}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(6px)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.55)" },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.35)" },
                  zIndex: 2,
                }}
              >
                <ChevronRightIcon />
              </IconButton>

              <Box sx={{ px: { xs: 4, md: 6 } }}>
                <Box ref={courseViewportRef} sx={{ overflow: "hidden" }}>
                  <Box
                    ref={courseTrackRef}
                    sx={{
                      display: "flex",
                      gap: "var(--cardGap)",
                      transform: `translate3d(-${translateX}px, 0, 0)`,
                      transition:
                        "transform 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                      willChange: "transform",
                    }}
                  >
                  {courses.map((course) => {
                    return (
                      <Box
                        key={course.id}
                        data-carousel-item="true"
                        sx={{
                          flex: courseItemWidthPx
                            ? `0 0 ${courseItemWidthPx}px`
                            : "0 0 calc((100% - (var(--cardGap) * (var(--pv) - 1))) / var(--pv))",
                          width: courseItemWidthPx ? `${courseItemWidthPx}px` : undefined,
                          minWidth: 0,
                        }}
                      >
                        <CourseCard
                          image={course.imageUrl ?? course.image}
                          name={course.name}
                          price={course.price}
                          onViewDetails={() => openDetailsDialog(course)}
                        />
                      </Box>
                    );
                  })}
                  </Box>
                </Box>
              </Box>

              {maxStartIndex > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.75,
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 999,
                      backgroundColor: "rgba(0,0,0,0.30)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {Array.from({ length: maxStartIndex + 1 }).map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCourseStartIndex(index)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Go to course position ${index + 1}`}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor:
                            index === courseStartIndex
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.55)",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              </Box>
          </Box>
        </Container>
      </Box>

      {/* DETAILS DIALOG */}
      <Dialog
        open={detailsDialogOpen}
        onClose={closeDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, rgba(15,15,25,0.98), rgba(25,25,35,0.98))",
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={closeDetailsDialog}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedCourse && (
            <Grid container spacing={0}>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    height: { xs: 300, md: "100%" },
                    minHeight: { md: 500 },
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: { xs: "12px 12px 0 0", md: "12px 0 0 12px" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={selectedCourse.imageUrl ?? selectedCourse.image}
                    alt={selectedCourse.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 2,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {selectedCourse.name}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: "#4fc3f7",
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    Rs. {selectedCourse.price}
                  </Typography>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Course Details
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      pr: 1,
                      p: 2,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.1)",
                      minHeight: 150,
                      "&::-webkit-scrollbar": {
                        width: 8,
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 4,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 4,
                        "&:hover": {
                          background: "rgba(255,255,255,0.3)",
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.95)",
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedCourse.detail || "No details available for this course."}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={closeDetailsDialog}
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%)",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(79, 195, 247, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

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
