import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useAuth } from "../../context/AuthContext";
import LoginFirstDialog from "../auth/LoginFirstDialog";

export default function AddToCartButton({
	onAddToCart,
	payload,
	disabled,
	sx,
	ariaLabel = "Add to cart",
}) {
	const { currentUser } = useAuth();
	const [loginPromptOpen, setLoginPromptOpen] = useState(false);

	const handleClick = () => {
		if (!currentUser) {
			setLoginPromptOpen(true);
			return;
		}
		onAddToCart?.(payload);
	};

	return (
		<>
			<IconButton
				onClick={handleClick}
				disabled={disabled}
				sx={sx}
				aria-label={ariaLabel}
			>
				<ShoppingCartOutlinedIcon />
			</IconButton>
			<LoginFirstDialog
				open={loginPromptOpen}
				onClose={() => setLoginPromptOpen(false)}
				title="Login first"
				description="Please login first for orders and to use the cart."
			/>
		</>
	);
}
