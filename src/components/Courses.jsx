import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function Courses() {
	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Courses
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 760 }}>
					A curated set of lessons for spiritual learning and practical guidance.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={2} sx={{ maxWidth: 820 }}>
					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Popular Topics
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							- Basic spiritual practices (daily routine)
							<br />- Understanding supplications and etiquette
							<br />- Practical guidance for self-discipline
						</Typography>
					</Box>

					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							How It Works
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							Each course includes a short introduction, learning goals, and step-by-step guidance.
						</Typography>
					</Box>
				</Stack>
			</Box>
		</SitePage>
	);
}
