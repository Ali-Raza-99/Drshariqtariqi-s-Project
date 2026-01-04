import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import SitePage from "./layout/SitePage";

export default function Appointment() {
	return (
		<SitePage>
			<Box sx={{ py: { xs: 4, md: 6 } }}>
				<Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
					Appointment
				</Typography>
				<Typography sx={{ opacity: 0.85, maxWidth: 860 }}>
					Book a time for guidance and consultation.
				</Typography>

				<Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

				<Stack spacing={2} sx={{ maxWidth: 900 }}>
					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							Available Types
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							- General guidance
							<br />- Spiritual consultation
							<br />- Follow-up session
						</Typography>
					</Box>

					<Box>
						<Typography fontWeight={900} sx={{ mb: 0.5 }}>
							What you can add next
						</Typography>
						<Typography sx={{ opacity: 0.8 }}>
							A simple appointment form (name, contact, preferred date/time, message).
						</Typography>
					</Box>
				</Stack>
			</Box>
		</SitePage>
	);
}
