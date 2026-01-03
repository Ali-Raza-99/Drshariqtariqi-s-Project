import { useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import LoginFirstDialog from "./auth/LoginFirstDialog";
import AddToCartButton from "./cart/AddToCartButton";

export default function ProductCard({
  image,
  name,
  price,
  onAddToCart,
  onBuyNow,
}) {
  const { currentUser } = useAuth();
  const [qty, setQty] = useState(1);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const requireLoginOr = (fn) => {
    if (!currentUser) {
      setLoginPromptOpen(true);
      return;
    }
    fn?.();
  };

  const increaseQty = () => requireLoginOr(() => setQty((q) => q + 1));
  const decreaseQty = () =>
    requireLoginOr(() => setQty((q) => (q > 1 ? q - 1 : q)));

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        bgcolor: "black",
        color: "white",
        borderRadius: 4,
        p: 1.5,
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          bgcolor: "transparent",
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={name}
          sx={{ objectFit: "cover", display: "block" }}
        />
      </Box>

      {/* TITLE + STARS */}
      <Box
        sx={{
          mt: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {name}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.25, alignItems: "center" }}>
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
        </Box>
      </Box>

      {/* PRICE */}
      <Typography variant="subtitle1" fontWeight={400} mt={0.75}>
        Rs. {price}
      </Typography>

      {/* QUANTITY */}
      <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
        <IconButton
          onClick={decreaseQty}
          sx={{
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.65)" },
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
            {qty}
          </Typography>
        </Box>

        <IconButton
          onClick={increaseQty}
          sx={{
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.65)" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      {/* ACTION BUTTONS */}
      <Stack direction="row" spacing={1} mt={1.5}>
        <Button
          fullWidth
          onClick={() => requireLoginOr(() => onBuyNow?.({ name, price, qty }))}
          sx={{
            bgcolor: "white",
            color: "black",
            fontWeight: 800,
            borderRadius: 2,
            textTransform: "none",
            py: 1,
            "&:hover": { bgcolor: "#eee" },
          }}
        >
          Buy Now
        </Button>

        <AddToCartButton
          onAddToCart={() => onAddToCart?.({ name, price, qty })}
          payload={undefined}
          sx={{
            bgcolor: "white",
            color: "black",
            borderRadius: 2,
          }}
          ariaLabel="Add to cart"
        />
      </Stack>

      <LoginFirstDialog
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="Login first"
        description="Please login first for orders and to use the cart."
      />
    </Card>
  );
}
