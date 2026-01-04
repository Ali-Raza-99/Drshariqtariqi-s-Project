import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function Library() {
	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Library
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 760 }}>
					Read and explore resources for learning, reference, and spiritual study.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={2} sx={{ maxWidth: 820 }}>
					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Featured Sections
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							- Articles and notes
							<br />- Recommended readings
							<br />- Quick reference (duas and guidelines)
						</Typography>
					</Box>

					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Note
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							This section can be expanded with PDFs, books, and downloadable materials.
						</Typography>
					</Box>
				</Stack>
			</Box>
		</SitePage>
	);
}
