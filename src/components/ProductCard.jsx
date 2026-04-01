import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoginFirstDialog from "./auth/LoginFirstDialog";

// Stateless guard to prevent double execution
class ClickGuard {
  constructor() {
    this.isProcessing = false;
    this.lastExecutedQty = null;
    this.minWaitMs = 500;
    this.lastExecuteTime = 0;
  }

  canExecute(targetQty) {
    const now = Date.now();
    const timeSinceLastExecute = now - this.lastExecuteTime;

    if (this.isProcessing) return false;
    if (timeSinceLastExecute < this.minWaitMs) return false;
    if (this.lastExecutedQty === targetQty) return false;

    return true;
  }

  execute(targetQty) {
    this.isProcessing = true;
    this.lastExecuteTime = Date.now();
    this.lastExecutedQty = targetQty;
  }

  complete() {
    this.isProcessing = false;
  }

  reset() {
    this.isProcessing = false;
  }
}

export default function ProductCard({
  image,
  name,
  price,
  id,
  onIncreaseQty,
  onDecreaseQty,
  onViewDetails,
}) {
  const { currentUser } = useAuth();
  const { cartItems, updateQuantity, addToCart } = useCart();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Use single guard instance for all protection
  const guardRef = useRef(new ClickGuard());
  const currentQuantityRef = useRef(0);
  const cartItemIdRef = useRef(null);

  // Get current quantity from cart for this product
  const currentQuantity = useMemo(() => {
    const cartItem = cartItems.find(item => item.productId === id);
    return cartItem?.quantity ?? 0;
  }, [cartItems, id]);

  // Get cart item ID for this product
  const cartItemId = useMemo(() => {
    const cartItem = cartItems.find(item => item.productId === id);
    return cartItem?.id;
  }, [cartItems, id]);

  // Sync refs with computed values whenever they change
  useEffect(() => {
    currentQuantityRef.current = currentQuantity;
    cartItemIdRef.current = cartItemId;
  }, [currentQuantity, cartItemId]);

  const handleIncreaseQty = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      const guard = guardRef.current;
      const currentQty = currentQuantityRef.current;
      const targetQty = currentQty === 0 ? 1 : currentQty + 1;

      // Single comprehensive guard
      if (!guard.canExecute(targetQty)) {
        console.log(
          ` Click blocked: isProcessing=${guard.isProcessing}, lastQty=${guard.lastExecutedQty}, target=${targetQty}`
        );
        return;
      }

      if (!currentUser) {
        setLoginPromptOpen(true);
        return;
      }

      guard.execute(targetQty);
      setIsUpdating(true);

      try {
        console.log(`✅ Executing increase: ${currentQty} → ${targetQty}`);
        const itemId = cartItemIdRef.current;

        if (currentQty === 0) {
          await addToCart({ id, name, price, image });
        } else {
          await updateQuantity(itemId, targetQty);
        }

        onIncreaseQty?.();
      } catch (err) {
        console.error("❌ Error:", err);
        guard.reset();
      } finally {
        guard.complete();
        setIsUpdating(false);
      }
    },
    [currentUser, id, name, price, image, addToCart, updateQuantity, onIncreaseQty]
  );

  const handleDecreaseQty = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      const guard = guardRef.current;
      const currentQty = currentQuantityRef.current;
      const targetQty = Math.max(0, currentQty - 1);

      // Single comprehensive guard
      if (!guard.canExecute(targetQty)) {
        console.log(
          `🚫 Click blocked: isProcessing=${guard.isProcessing}, lastQty=${guard.lastExecutedQty}, target=${targetQty}`
        );
        return;
      }

      if (!currentUser) {
        setLoginPromptOpen(true);
        return;
      }

      guard.execute(targetQty);
      setIsUpdating(true);

      try {
        console.log(`✅ Executing decrease: ${currentQty} → ${targetQty}`);

        if (currentQty > 0) {
          const itemId = cartItemIdRef.current;
          await updateQuantity(itemId, targetQty);
          onDecreaseQty?.();
        }
      } catch (err) {
        console.error("❌ Error:", err);
        guard.reset();
      } finally {
        guard.complete();
        setIsUpdating(false);
      }
    },
    [currentUser, id, updateQuantity, onDecreaseQty]
  );

  return (
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
      }}
    >
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
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={name}
          sx={{ 
            objectFit: "cover", 
            display: "block",
            width: "100%",
            height: "220px",
            maxWidth: "100%",
            maxHeight: "220px",
          }}
        />
        {/* INFO ICON */}
        <IconButton
          onClick={onViewDetails}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            bgcolor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            color: "white",
            width: 32,
            height: 32,
            border: "1px solid rgba(255,255,255,0.2)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.85)",
              borderColor: "rgba(255,255,255,0.4)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* TITLE + STARS */}
      <Box
        sx={{
          mt: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{ 
            textTransform: "uppercase", 
            letterSpacing: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {name}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.25, alignItems: "center", flexShrink: 0 }}>
          <StarIcon sx={{ color: "#FFD700 !important" }} fontSize="small" />
          <StarIcon sx={{ color: "#FFD700 !important" }} fontSize="small" />
          <StarIcon sx={{ color: "#FFD700 !important" }} fontSize="small" />
        </Box>
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
        Rs. {price}
      </Typography>

      {/* QUANTITY CONTROL */}
      <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
        <IconButton
          onClick={handleDecreaseQty}
          disabled={isUpdating || currentQuantity <= 0}
          disableRipple
          sx={{
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.65)" },
            "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
          }}
        >
          <RemoveIcon />
        </IconButton>

        <Box
          sx={{
            minWidth: 48,
            textAlign: "center",
            py: 0.75,
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.22)",
            bgcolor: "rgba(255,255,255,0.04)",
          }}
        >
          <Typography fontWeight={800} fontSize={14}>
            {currentQuantity}
          </Typography>
        </Box>

        <IconButton
          onClick={handleIncreaseQty}
          disabled={isUpdating}
          disableRipple
          sx={{
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.65)" },
            "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      {/* ACTION BUTTON */}
      <Button
        fullWidth
        type="button"
        disabled={isUpdating}
        disableRipple
        onClick={handleIncreaseQty}
        sx={{
          bgcolor: "white",
          color: "black !important",
          fontWeight: 800,
          borderRadius: 2,
          textTransform: "none",
          py: 1,
          mt: 1.5,
          "&:hover": { bgcolor: "#eee", opacity: 1 },
          "&:disabled": { opacity: 0.6, bgcolor: "#ccc", cursor: "not-allowed" },
        }}
      >
        {currentQuantity > 0 ? "Update Cart" : "Add to Cart"}
      </Button>

      <LoginFirstDialog
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="Login first"
        description="Please login first for orders and to use the cart."
      />
    </Card>
  );
}
