import {
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function CourseCard({
  image,
  name,
  price,
  onViewDetails,
}) {
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
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
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

      {/* SPACER - Same height as quantity controls in ProductCard */}
      <Box sx={{ height: 42, mt: 1.5 }} />

      {/* ACTION BUTTON */}
      <Stack direction="row" spacing={1} mt={1.5}>
        <Button
          fullWidth
          disableRipple
          onClick={onViewDetails}
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
          View Details
        </Button>
      </Stack>
    </Card>
  );
}
