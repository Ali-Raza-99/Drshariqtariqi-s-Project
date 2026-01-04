import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function IlmUlAdadadCalculator() {
	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Ilm‑ul‑Adadad Calculator
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 860 }}>
					This page provides guidance and examples for number-based calculations used in Ilm‑ul‑Adadad.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={2} sx={{ maxWidth: 900 }}>
					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							What you can add here
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							- Name/word input
							<br />- Letter-to-number mapping
							<br />- Total calculation and explanation
						</Typography>
					</Box>

					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Example
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							Enter a word/name and display a computed value with steps.
						</Typography>
					</Box>
				</Stack>
			</Box>
		</SitePage>
	);
}
