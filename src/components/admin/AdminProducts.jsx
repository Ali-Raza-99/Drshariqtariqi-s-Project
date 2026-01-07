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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";

import oilImg from "../../assets/oil.jpeg";
import bakhorImg from "../../assets/bakhor.jpeg";
import powderImg from "../../assets/powder.jpeg";
import bgImg from "../../assets/5.png";
import logoImg from "../../assets/mainlogo.png";
import { useAuth } from "../../context/AuthContext";
import { getNavTo, isNavItemActive, getNavItems } from "../layout/navConfig";
import {
  createProduct,
  deleteProduct,
  getUserProfile,
  listProducts,
  updateProduct,
} from "../../firebase/firestore";
import { uploadToCloudinaryUnsigned } from "../../utils/cloudinaryUpload";

export default function AdminProducts() {
  const { currentUser, authLoading, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const fallbackProducts = useMemo(
    () => [
      { id: "oil", name: "oil", price: 1200, imageUrl: oilImg },
      { id: "bakhor", name: "bakhor", price: 1500, imageUrl: bakhorImg },
      { id: "powder", name: "powder", price: 900, imageUrl: powderImg },
    ],
    []
  );

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [adminEditingId, setAdminEditingId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [adminPrice, setAdminPrice] = useState("");
  const [adminQuantity, setAdminQuantity] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const [adminImageFile, setAdminImageFile] = useState(null);
  const [adminImageUrl, setAdminImageUrl] = useState("");
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminError, setAdminError] = useState("");

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isEditing = Boolean(adminEditingId);

  const resetAdminForm = () => {
    setAdminEditingId(null);
    setAdminName("");
    setAdminPrice("");
    setAdminQuantity("");
    setAdminDescription("");
    setAdminImageFile(null);
    setAdminImageUrl("");
    setAdminError("");
  };

  const startAdminEdit = (product) => {
    setAdminEditingId(product.id);
    setAdminName(String(product.name ?? ""));
    setAdminPrice(String(product.price ?? ""));
    setAdminQuantity(String(product.quantity ?? ""));
    setAdminDescription(String(product.description ?? ""));
    setAdminImageUrl(String(product.imageUrl ?? ""));
    setAdminImageFile(null);
    setAdminError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPickAdminImage = (event) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setAdminImageFile(file);
    setAdminError("");
  };

  const refreshProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await listProducts();
      setProducts(Array.isArray(data) ? data : fallbackProducts);
    } catch {
      setProducts(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;
      if (currentUser && !adminChecked) return;
      try {
        setLoadingProducts(true);
        const data = await listProducts();
        if (cancelled) return;

        setProducts(Array.isArray(data) && data.length > 0 ? data : fallbackProducts);
      } catch {
        if (cancelled) return;
        setProducts(fallbackProducts);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, currentUser, adminChecked, fallbackProducts]);

  const productsPerView = isMdUp ? 4 : isSmUp ? 2 : 1;
  const maxStartIndex = Math.max(0, products.length - productsPerView);
  const [productStartIndex, setProductStartIndex] = useState(0);
  React.useEffect(() => {
    setProductStartIndex(0);
  }, [productsPerView, products.length]);

  const productViewportRef = useRef(null);
  const productTrackRef = useRef(null);
  const [productStepPx, setProductStepPx] = useState(0);
  const [productItemWidthPx, setProductItemWidthPx] = useState(0);

  React.useLayoutEffect(() => {
    const viewport = productViewportRef.current;
    const track = productTrackRef.current;
    if (!viewport || !track) return;

    const computeStep = () => {
      const viewportWidth = viewport.getBoundingClientRect().width;
      if (!viewportWidth) return;

      const styles = window.getComputedStyle(track);
      const gapValue = styles.columnGap || styles.gap || styles.rowGap || "0px";
      const gap = Number.parseFloat(gapValue) || 0;

      const itemWidth =
        (viewportWidth - gap * (productsPerView - 1)) / productsPerView;
      if (!Number.isFinite(itemWidth) || itemWidth <= 0) return;

      const roundedItemWidth = Math.max(1, Math.floor(itemWidth));
      const roundedStep = Math.max(1, Math.floor(roundedItemWidth + gap));
      setProductItemWidthPx(roundedItemWidth);
      setProductStepPx(roundedStep);
    };

    computeStep();
    const resizeObserver = new ResizeObserver(() => computeStep());
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [productsPerView]);

  const translateX = Math.round(productStepPx * productStartIndex);
  const goPrevProduct = () =>
    setProductStartIndex((i) => Math.max(0, i - 1));
  const goNextProduct = () =>
    setProductStartIndex((i) => Math.min(maxStartIndex, i + 1));

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

  const canAdminSubmit = useMemo(() => {
    const parsedPrice = Number(adminPrice);
    if (!adminName.trim()) return false;
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return false;
    if (!isEditing && !adminImageFile) return false;
    if (isEditing && !adminImageFile && !adminImageUrl) return false;
    return true;
  }, [adminName, adminPrice, adminImageFile, adminImageUrl, isEditing]);

  const handleAdminSave = async () => {
    setAdminError("");
    setAdminSaving(true);
    try {
      let finalImageUrl = adminImageUrl;
      if (adminImageFile) {
        finalImageUrl = await uploadToCloudinaryUnsigned(adminImageFile);
      }

      const payload = {
        name: adminName.trim(),
        price: Number(adminPrice),
        quantity: adminQuantity.trim(),
        description: adminDescription.trim(),
        imageUrl: finalImageUrl,
      };

      if (isEditing) {
        await updateProduct({ id: adminEditingId, data: payload });
      } else {
        await createProduct({ data: payload });
      }

      await refreshProducts();
      resetAdminForm();
    } catch (e) {
      setAdminError(e?.message || "Failed to save product");
    } finally {
      setAdminSaving(false);
    }
  };

  const handleAdminDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setAdminError("");
    setAdminSaving(true);
    try {
      await deleteProduct(id);
      await refreshProducts();
      if (adminEditingId === id) resetAdminForm();
    } catch (e) {
      setAdminError(e?.message || "Failed to delete product");
    } finally {
      setAdminSaving(false);
    }
  };

  const openProfileMenu = (event) => setProfileMenuAnchorEl(event.currentTarget);
  const closeProfileMenu = () => setProfileMenuAnchorEl(null);
  const handleLogout = async () => {
    closeProfileMenu();
    await logout();
  };

  const openDetailsDialog = (product) => {
    console.log("Opening details for product:", product);
    console.log("Product description:", product.description);
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedProduct(null);
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
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          bgcolor: "rgba(20, 20, 20, 0.95)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 2,
                          minWidth: 200,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          color: "white",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                        }}
                      >
                        <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
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
                  {isEditing ? "Edit Product" : "Add Product"}
                </Typography>
              </Grid>
            </Grid>

            {/* ADMIN FORM */}
            <Box
              sx={{
                mt: 4,
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    disabled={adminSaving}
                    sx={{
                      "& .MuiInputLabel-root": { 
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 600,
                      },
                      "& .MuiInputBase-input": { 
                        color: "white",
                        fontWeight: 500,
                        fontSize: "1rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.05)",
                        height: "56px",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "white",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Price (Rs.)"
                    fullWidth
                    type="number"
                    value={adminPrice}
                    onChange={(e) => setAdminPrice(e.target.value)}
                    disabled={adminSaving}
                    inputProps={{ min: 1, step: 1 }}
                    sx={{
                      "& .MuiInputLabel-root": { 
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 600,
                      },
                      "& .MuiInputBase-input": { 
                        color: "white",
                        fontWeight: 500,
                        fontSize: "1rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.05)",
                        height: "56px",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "white",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    value={adminQuantity}
                    onChange={(e) => setAdminQuantity(e.target.value)}
                    disabled={adminSaving}
                    sx={{
                      "& .MuiInputLabel-root": { 
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 600,
                      },
                      "& .MuiInputBase-input": { 
                        color: "white",
                        fontWeight: 500,
                        fontSize: "1rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.05)",
                        height: "56px",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "white",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    component="label"
                    fullWidth
                    disabled={adminSaving}
                    sx={{
                      height: "56px",
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 1,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255,255,255,0.5)",
                        borderColor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    {adminImageFile
                      ? `✓ ${adminImageFile.name}`
                      : isEditing && adminImageUrl
                      ? "Change Product Image"
                      : "Upload Product Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={onPickAdminImage}
                    />
                  </Button>
                </Grid>

                {adminError && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {adminError}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={5}>
                  <Button
                    variant="contained"
                    onClick={handleAdminSave}
                    disabled={!canAdminSubmit || adminSaving}
                    fullWidth
                    sx={{
                      bgcolor: "white",
                      color: "black",
                      fontWeight: 700,
                      textTransform: "none",
                      height: "56px",
                      fontSize: "1rem",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        color: "rgba(0,0,0,0.4)",
                      },
                    }}
                  >
                    {adminSaving
                      ? "Saving..."
                      : isEditing
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                </Grid>

                {isEditing && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      onClick={resetAdminForm}
                      disabled={adminSaving}
                      fullWidth
                      sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.4)",
                        textTransform: "none",
                        height: "56px",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.7)",
                          backgroundColor: "rgba(255,255,255,0.08)",
                        },
                      }}
                    >
                      Cancel Edit
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* PRODUCT DESCRIPTION BOX - SEPARATE */}
            <Box
              sx={{
                mt: 3,
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: "white",
                  mb: 2,
                  letterSpacing: 0.5,
                }}
              >
                Product Description
              </Typography>
              <TextField
                label="Enter product description and details"
                fullWidth
                multiline
                rows={8}
                value={adminDescription}
                onChange={(e) => setAdminDescription(e.target.value)}
                disabled={adminSaving}
                placeholder="Describe the product features, specifications, uses, and any other relevant information..."
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(0,0,0,0.3)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.23)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.8)" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.4)",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* PRODUCTS LIST */}
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: "white", mb: 3, mt: 6 }}
            >
              All Products
            </Typography>

            {/* PRODUCTS SLIDER */}
            <Box
              sx={{
                mt: 5,
                position: "relative",
                borderRadius: 4,
                border: "2px solid rgba(255,255,255,0.2)",
                background: "linear-gradient(135deg, rgba(20,20,20,0.85) 0%, rgba(40,40,40,0.75) 100%)",
                backdropFilter: "blur(12px)",
                p: { xs: 2.5, md: 3 },
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                "--pv": productsPerView,
                "--cardGap": { xs: "16px", md: "24px" },
              }}
            >
              {loadingProducts ? (
                <Typography sx={{ opacity: 0.85, color: "white" }}>Loading...</Typography>
              ) : products.length === 0 ? (
                <Typography sx={{ opacity: 0.85, color: "white" }}>
                  No products found. Add your first product above!
                </Typography>
              ) : (
                <>
                  <IconButton
                    aria-label="Previous products"
                    onClick={goPrevProduct}
                    disabled={productStartIndex === 0}
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
                    aria-label="Next products"
                    onClick={goNextProduct}
                    disabled={productStartIndex >= maxStartIndex}
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
                    <Box ref={productViewportRef} sx={{ overflow: "hidden" }}>
                      <Box
                        ref={productTrackRef}
                        sx={{
                          display: "flex",
                          gap: "var(--cardGap)",
                          transform: `translate3d(-${translateX}px, 0, 0)`,
                          transition:
                            "transform 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                          willChange: "transform",
                        }}
                      >
                        {products.map((product) => {
                          return (
                            <Box
                              key={product.id}
                              data-carousel-item="true"
                              sx={{
                                flex: productItemWidthPx
                                  ? `0 0 ${productItemWidthPx}px`
                                  : "0 0 calc((100% - (var(--cardGap) * (var(--pv) - 1))) / var(--pv))",
                                width: productItemWidthPx
                                  ? `${productItemWidthPx}px`
                                  : undefined,
                                minWidth: 0,
                              }}
                            >
                              <Card
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  bgcolor: "black",
                                  color: "white",
                                  borderRadius: 4,
                                  p: 1.5,
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  overflow: "hidden",
                                  boxSizing: "border-box",
                                  position: "relative",
                                }}
                              >
                                {/* EDIT & DELETE ICONS AT TOP */}
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    display: "flex",
                                    gap: 1,
                                    zIndex: 10,
                                  }}
                                >
                                  <IconButton
                                    onClick={() => startAdminEdit(product)}
                                    disabled={adminSaving}
                                    size="small"
                                    sx={{
                                      bgcolor: "rgba(255,255,255,0.95)",
                                      color: "black",
                                      width: 36,
                                      height: 36,
                                      "&:hover": {
                                        bgcolor: "white",
                                        transform: "scale(1.1)",
                                      },
                                      transition: "all 0.2s ease",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => handleAdminDelete(product.id)}
                                    disabled={adminSaving}
                                    size="small"
                                    sx={{
                                      bgcolor: "rgba(255,255,255,0.95)",
                                      color: "black",
                                      width: 36,
                                      height: 36,
                                      "&:hover": {
                                        bgcolor: "#ff4444",
                                        color: "white",
                                        transform: "scale(1.1)",
                                      },
                                      transition: "all 0.2s ease",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>

                                {/* IMAGE */}
                                <Box
                                  sx={{
                                    bgcolor: "transparent",
                                    borderRadius: 3,
                                    p: 0,
                                    overflow: "hidden",
                                    width: "100%",
                                    height: "220px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    height="220"
                                    image={product.imageUrl ?? product.image}
                                    alt={product.name}
                                    sx={{
                                      objectFit: "cover",
                                      display: "block",
                                      width: "100%",
                                      height: "220px",
                                      maxWidth: "100%",
                                      maxHeight: "220px",
                                    }}
                                  />
                                </Box>

                                {/* PRODUCT NAME */}
                                <Box sx={{ mt: 1.25 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={800}
                                    sx={{
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {product.name}
                                  </Typography>
                                </Box>

                                {/* PRICE */}
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={400}
                                  mt={0.75}
                                  sx={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  Rs. {product.price}
                                </Typography>

                                {/* QUANTITY */}
                                {product.quantity && (
                                  <Typography
                                    variant="body2"
                                    mt={0.5}
                                    sx={{
                                      color: "rgba(255,255,255,0.7)",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Qty: {product.quantity}
                                  </Typography>
                                )}

                                {/* VIEW DETAILS BUTTON */}
                                <Button
                                  fullWidth
                                  disableRipple
                                  onClick={() => openDetailsDialog(product)}
                                  disabled={adminSaving}
                                  sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    fontWeight: 800,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    py: 1,
                                    mt: 2,
                                    "&:hover": { 
                                      bgcolor: "#eee",
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 4px 12px rgba(255,255,255,0.3)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  View Details
                                </Button>
                              </Card>
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
                        {Array.from({ length: maxStartIndex + 1 }).map(
                          (_, index) => (
                            <Box
                              key={index}
                              onClick={() => setProductStartIndex(index)}
                              role="button"
                              tabIndex={0}
                              aria-label={`Go to product position ${index + 1}`}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                cursor: "pointer",
                                backgroundColor:
                                  index === productStartIndex
                                    ? "rgba(255,255,255,0.95)"
                                    : "rgba(255,255,255,0.55)",
                              }}
                            />
                          )
                        )}
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* PRODUCT DETAILS DIALOG */}
      <Dialog
        open={detailsDialogOpen}
        onClose={closeDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(15, 15, 15, 0.98)",
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 4,
            boxShadow: "0 20px 70px rgba(0,0,0,0.7)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <IconButton
            onClick={closeDetailsDialog}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 10,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ p: 0 }}>
            {selectedProduct && (
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  minHeight: 400,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: "white",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {selectedProduct.name}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{
                    color: "#4CAF50",
                    mb: 1,
                  }}
                >
                  Rs. {selectedProduct.price}
                </Typography>

                {selectedProduct.quantity && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      mb: 3,
                    }}
                  >
                    Quantity: {selectedProduct.quantity}
                  </Typography>
                )}

                <Divider
                  sx={{
                    borderColor: "rgba(255,255,255,0.2)",
                    mb: 3,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 2,
                  }}
                >
                  Product Description
                </Typography>

                <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "stretch" }}>
                  {/* LEFT SIDE - PRODUCT IMAGE */}
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={selectedProduct.imageUrl ?? selectedProduct.image}
                      alt={selectedProduct.name}
                      sx={{
                        width: "100%",
                        maxHeight: 300,
                        borderRadius: 2,
                        objectFit: "cover",
                        border: "2px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      }}
                    />
                  </Box>

                  {/* RIGHT SIDE - DETAILS WITH SCROLL */}
                  <Box
                    sx={{
                      width: "70%",
                      overflowY: "auto",
                      p: 2,
                      pl: 3,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.1)",
                      maxHeight: 300,
                      direction: "rtl",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "4px",
                        "&:hover": {
                          background: "rgba(255,255,255,0.3)",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.95)",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                        fontSize: "1.05rem",
                        direction: "ltr",
                      }}
                    >
                      {selectedProduct.description || "No description available for this product."}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Box>
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
