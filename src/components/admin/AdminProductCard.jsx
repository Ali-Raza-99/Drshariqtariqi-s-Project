import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function AdminProductCard({
  image,
  name,
  price,
  onEdit,
  onDelete,
  disableActions = false,
}) {
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
        position: "relative",
      }}
    >
      <Box
        sx={{
          bgcolor: "transparent",
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={name}
          sx={{ objectFit: "cover", display: "block" }}
        />

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <IconButton
            onClick={onEdit}
            disabled={disableActions}
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              bgcolor: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.10)" },
            }}
            size="small"
            aria-label="Edit product"
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={onDelete}
            disabled={disableActions}
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              bgcolor: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.10)" },
            }}
            size="small"
            aria-label="Delete product"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

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
      </Box>

      <Typography variant="subtitle1" fontWeight={400} mt={0.75}>
        Rs. {price}
      </Typography>
    </Card>
  );
}
