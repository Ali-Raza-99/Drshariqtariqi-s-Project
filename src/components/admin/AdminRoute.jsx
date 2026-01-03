import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../firebase/firestore";

export default function AdminRoute({ children }) {
	const { currentUser, authLoading } = useAuth();
	const [checking, setChecking] = React.useState(true);
	const [isAdmin, setIsAdmin] = React.useState(false);

	React.useEffect(() => {
		let cancelled = false;

		const check = async () => {
			if (authLoading) return;
			if (!currentUser?.uid) {
				setIsAdmin(false);
				setChecking(false);
				return;
			}
			try {
				const profile = await getUserProfile(currentUser.uid);
				if (cancelled) return;
				setIsAdmin(profile?.role === "admin");
				setChecking(false);
			} catch {
				if (cancelled) return;
				setIsAdmin(false);
				setChecking(false);
			}
		};

		check();
		return () => {
			cancelled = true;
		};
	}, [authLoading, currentUser?.uid]);

	if (authLoading || checking) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "#000",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!currentUser) return <Navigate to="/login" replace />;
	if (!isAdmin) return <Navigate to="/" replace />;

	return children;
}
