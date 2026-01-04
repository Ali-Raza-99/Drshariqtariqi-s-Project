import React, { useMemo } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function MureedCounter() {
	const sampleCounts = useMemo(
		() => [
			{ label: "Today", value: 12 },
			{ label: "This Week", value: 84 },
			{ label: "This Month", value: 320 },
		],
		[]
	);

	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Mureed Counter
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 760 }}>
					A simple overview area for tracking counts and updates.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={1.5} sx={{ maxWidth: 520 }}>
					{sampleCounts.map((c) => (
						<Box
							key={c.label}
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 2,
								p: 1.5,
								borderRadius: 2,
								border: "1px solid rgba(255,255,255,0.12)",
								bgcolor: "rgba(255,255,255,0.04)",
							}}
						>
							<Typography fontWeight={800}>{c.label}</Typography>
							<Typography fontWeight={1000} sx={{ letterSpacing: 0.4 }}>
								{c.value}
							</Typography>
						</Box>
					))}
					<Typography variant="body2" sx={{ opacity: 0.7 }}>
						Replace these sample numbers with real data when available.
					</Typography>
				</Stack>
			</Box>
		</SitePage>
	);
}
