export const firebaseErrorMessage = (err, fallback = "Something went wrong") => {
	const code = String(err?.code ?? "");
	if (code) {
		switch (code) {
			case "permission-denied":
				return "Permission denied. Check Firestore rules";
			case "unavailable":
				return "Service unavailable. Try again";
			case "storage/unauthorized":
				return "Permission denied. Check Storage rules";
			case "storage/canceled":
				return "Upload canceled";
			case "storage/unknown":
				return "Upload failed. Try again";
			case "auth/invalid-email":
				return "Invalid email address";
			case "auth/missing-email":
				return "Email is required";
			case "auth/missing-password":
				return "Password is required";
			case "auth/weak-password":
				return "Password should be at least 6 characters";
			case "auth/email-already-in-use":
				return "Email is already in use";
			case "auth/user-not-found":
			case "auth/wrong-password":
			case "auth/invalid-credential":
				return "Invalid email or password";
			case "auth/user-disabled":
				return "This account has been disabled";
			case "auth/too-many-requests":
				return "Too many attempts. Try again later";
			case "auth/network-request-failed":
				return "Network error. Please check your connection";
			default:
				break;
		}
	}

	let message = String(err?.message ?? fallback);

	// Common Firebase format: "Firebase: Error (auth/some-code)."
	message = message.replace(/^Firebase:\s*/i, "");
	message = message.replace(/^Error:\s*/i, "");
	message = message.replace(/^Error\s*\(([^)]+)\)\.?$/i, "$1");

	// If message still contains a raw auth code, make it readable.
	const authCodeMatch = message.match(/auth\/[a-z0-9-]+/i);
	if (authCodeMatch) {
		return authCodeMatch[0];
	}

	return message;
};
