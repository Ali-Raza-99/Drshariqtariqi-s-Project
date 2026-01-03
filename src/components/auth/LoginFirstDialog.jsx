import React from "react";
import { Box, Button, Dialog, Divider, IconButton, Slide, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginFirstDialog({
	open,
	onClose,
	title = "Login required",
	description = "Please login first to place orders and manage your cart.",
}) {
	const navigate = useNavigate();

	const handleClose = () => onClose?.();
	const goToLogin = () => {
		handleClose();
		navigate("/login");
	};

	return (
		<Dialog
			open={Boolean(open)}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
			TransitionComponent={Transition}
			transitionDuration={{ enter: 240, exit: 200 }}
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
				<Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.1 }}>
					{title}
				</Typography>
				<IconButton
					onClick={handleClose}
					sx={{ color: "rgba(255,255,255,0.85)" }}
					aria-label="Close"
				>
					<CloseIcon />
				</IconButton>
			</Box>

			<Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

			<Box sx={{ px: 2.25, py: 2 }}>
				<Typography variant="body2" sx={{ opacity: 0.75, fontSize: 13, mb: 2 }}>
					{description}
				</Typography>

				<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
					<Button
						onClick={handleClose}
						sx={{
							textTransform: "none",
							borderRadius: 2,
							color: "rgba(255,255,255,0.9)",
							border: "1px solid rgba(255,255,255,0.18)",
							bgcolor: "rgba(255,255,255,0.04)",
							"&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={goToLogin}
						startIcon={<LoginIcon />}
						sx={{
							textTransform: "none",
							borderRadius: 2,
							fontWeight: 800,
							bgcolor: "#fff",
							color: "#111",
							"&:hover": { bgcolor: "grey.800", color: "#fff" },
						}}
					>
						Login
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}
