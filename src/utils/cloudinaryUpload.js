const readJsonSafely = async (res) => {
	try {
		return await res.json();
	} catch {
		return null;
	}
};

const getRequiredEnv = (key) => {
	const value = import.meta.env[key];
	if (!value) {
		throw new Error(
			`Missing ${key}. Add it to a .env file and restart the dev server.`
		);
	}
	return value;
};

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * Returns Cloudinary's `secure_url`.
 */
export const uploadToCloudinaryUnsigned = async (file) => {
	if (!file) throw new Error("No file selected");
	if (!(file instanceof File)) throw new Error("Invalid file");
	if (!file.type?.startsWith("image/")) {
		throw new Error("Please select an image file");
	}

	const cloudName = getRequiredEnv("VITE_CLOUDINARY_CLOUD_NAME");
	const uploadPreset = getRequiredEnv("VITE_CLOUDINARY_UPLOAD_PRESET");

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
		{
			method: "POST",
			body: formData,
		}
	);

	const json = await readJsonSafely(res);
	if (!res.ok) {
		const message =
			json?.error?.message || json?.message || "Cloudinary upload failed";
		throw new Error(String(message));
	}

	const secureUrl = json?.secure_url;
	if (!secureUrl) throw new Error("Cloudinary did not return secure_url");
	return secureUrl;
};
