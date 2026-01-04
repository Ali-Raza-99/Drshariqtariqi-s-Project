import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function Istikhara() {
	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Istikhara
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 860 }}>
					Information and guidance related to Istikhara.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={2} sx={{ maxWidth: 900 }}>
					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Before you start
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							Be clear about your question and intention. Maintain respectful etiquette and sincerity.
						</Typography>
					</Box>

					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							What this page can include
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							- Steps and instructions
							<br />- Frequently asked questions
							<br />- Contact/appointment guidance if needed
						</Typography>
					</Box>
				</Stack>
			</Box>
		</SitePage>
	);
}
