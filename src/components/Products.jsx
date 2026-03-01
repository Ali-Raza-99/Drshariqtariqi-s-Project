import React, { useMemo, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  CssBaseline,
  Divider,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Stack,
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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SocialMediaIcons from "./SocialMediaIcons";
import Footer from "./layout/Footer";
import ThemedLoadingSpinner from "./ThemedLoadingSpinner";
import CartDialog from "./cart/CartDialog";

import oilImg from "../assets/oil.jpeg";
import bakhorImg from "../assets/bakhor.jpeg";
import powderImg from "../assets/powder.jpeg";
import bgImg from "../assets/5.png";
import logoImg from "../assets/mainlogo.png";
import ProductCard from "./ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getNavTo, isNavItemActive, getNavItems } from "./layout/navConfig";
import {
  getUserProfile,
  listProducts,
} from "../firebase/firestore";

const CartTransition = React.forwardRef(function CartTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Products() {
  const { currentUser, authLoading, logout } = useAuth();
  const { addToCart, totalItems } = useCart();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fallbackProducts = useMemo(
    () => [
      { id: "oil", name: "Oil", price: 1200, imageUrl: oilImg },
      { id: "oil", name: "Oil", price: 1200, imageUrl: oilImg },
      { id: "oil", name: "Oil", price: 1200, imageUrl: oilImg },
      { id: "oil", name: "Oil", price: 1200, imageUrl: oilImg },
      { id: "bakhor", name: "Bakhor", price: 1500, imageUrl: bakhorImg },
      { id: "powder", name: "Powder", price: 900, imageUrl: powderImg },
    ],
    []
  );

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;
      try {
        setLoadingProducts(true);
        const data = await listProducts();
        if (cancelled) return;

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
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
  }, [authLoading, fallbackProducts]);

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

  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = async (productData) => {
    try {
      await addToCart(productData);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart: " + err.message);
    }
  };

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

  const openDetailsDialog = (product) => {
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

                    {/* USE NEW CART DIALOG COMPONENT */}
                    {adminChecked && !isAdmin && (
                      <CartDialog
                        open={cartOpen}
                        onClose={() => setCartOpen(false)}
                      />
                    )}
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
                  Products
                </Typography>
              </Grid>
            </Grid>

            {loadingProducts ? (
              <ThemedLoadingSpinner />
            ) : (
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
                  "--pv": productsPerView,
                  "--cardGap": { xs: "16px", md: "24px" },
                }}
                >
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
                          width: productItemWidthPx ? `${productItemWidthPx}px` : undefined,
                          minWidth: 0,
                        }}
                      >
                        <ProductCard
                          id={product.id}
                          image={product.imageUrl ?? product.image}
                          name={product.name}
                          price={product.price}
                          onIncreaseQty={() => handleAddToCart(product)}
                          onDecreaseQty={() => {}}
                          onViewDetails={() => openDetailsDialog(product)}
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
                    ))}
                  </Box>
                </Box>
              )}
              </Box>
            )}
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

          <DialogContent sx={{ p: 0, maxHeight: "85vh", overflowY: "auto" }}>
            {selectedProduct && (
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  pb: { xs: 4, md: 5 },
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
                    mb: 3,
                  }}
                >
                  Rs. {selectedProduct.price}
                </Typography>

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
                  Product Details
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 4, alignItems: "stretch" }}>
                  {/* LEFT SIDE - PRODUCT IMAGE */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "35%" },
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
                        height: { xs: 250, md: 350 },
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
                      width: { xs: "100%", md: "65%" },
                      overflowY: "auto",
                      p: 2,
                      pl: 3,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.1)",
                      height: { xs: 200, md: 350 },
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
                      {selectedProduct.detail || selectedProduct.description || "No details available for this product."}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>

      <SocialMediaIcons />
      <Footer />
    </>
  );
}
