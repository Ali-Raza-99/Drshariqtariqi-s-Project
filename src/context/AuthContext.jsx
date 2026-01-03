import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
	deleteAuthUser,
	listenToAuthChanges,
	loginWithEmail,
	logout,
	signupWithEmail,
	updateAuthUserProfile,
} from "../firebase/auth";
import { deleteUserProfile, setUserDocExact } from "../firebase/firestore";
import { uploadToCloudinaryUnsigned } from "../utils/cloudinaryUpload";

const AuthContext = createContext(null);

const withTimeout = async (promise, ms, message) => {
	let timeoutId;
	const timeout = new Promise((_, reject) => {
		timeoutId = setTimeout(() => reject(new Error(message)), ms);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timeoutId);
	}
};

const toIsoDateStringMaybe = (value) => {
	if (!value) return null;
	try {
		const asDayjs = dayjs(value);
		if (!asDayjs.isValid()) return null;
		return asDayjs.toISOString();
	} catch {
		return null;
	}
};

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		const unsub = listenToAuthChanges((user) => {
			setCurrentUser(user ?? null);
			setAuthLoading(false);
		});
		return () => unsub();
	}, []);

	const signup = async (formData) => {
		const {
			email,
			password,
			firstName,
			lastName,
			dateOfBirth,
			gender,
			motherName,
			fatherName,
			address,
			country,
			contact,
			userType,
			profilePicture,
		} = formData;

		const requireText = (label, value) => {
			if (!value || String(value).trim() === "") {
				throw new Error(`${label} is required`);
			}
		};

		requireText("First Name", firstName);
		requireText("Last Name", lastName);
		requireText("Email", email);
		requireText("Password", password);
		requireText("Mother Name", motherName);
		requireText("Father Name", fatherName);
		requireText("Address", address);
		requireText("Country", country);
		requireText("Contact", contact);
		requireText("Gender", gender);
		requireText("User Type", userType);

		const dateOfBirthIso = toIsoDateStringMaybe(dateOfBirth);
		if (!dateOfBirthIso) {
			throw new Error("Date of Birth is required");
		}

		const displayName = [firstName, lastName].filter(Boolean).join(" ") || null;

		// Create account first (photoURL optional; uploaded right after)
		const user = await signupWithEmail({ email, password, displayName });
		let firestoreSaved = false;
		try {
			let photoURL = null;
			if (profilePicture) {
				photoURL = await withTimeout(
					uploadToCloudinaryUnsigned(profilePicture),
					120000,
					"Profile image upload is taking too long. Try a smaller image or check your connection."
				);
			}
			await withTimeout(
				updateAuthUserProfile(user, { displayName, photoURL }),
				15000,
				"Updating profile timed out"
			);

			await withTimeout(
				setUserDocExact({
					uid: user.uid,
					data: {
						role: "user",
						firstName,
						lastName,
						email,
						password,
						dateOfBirth: dateOfBirthIso,
						gender,
						motherName,
						fatherName,
						address,
						country,
						contact,
						userType,
						profilePicture: photoURL,
					},
				}),
				20000,
				"Saving user data timed out"
			);
			firestoreSaved = true;
		} catch (err) {
			// If data isn't stored, do not keep the auth user.
			try {
				if (firestoreSaved) {
					// (Not expected, but keep logic safe)
					await deleteUserProfile(user.uid);
				} else {
					// Remove any partially-written doc if it exists.
					await deleteUserProfile(user.uid);
				}
			} catch {
				// ignore cleanup failures
			}
			try {
				await deleteAuthUser(user);
			} catch {
				// ignore cleanup failures
			}
			throw err;
		}

		return user;
	};

	const login = async (email, password) => loginWithEmail({ email, password });

	const value = useMemo(
		() => ({
			currentUser,
			authLoading,
			signup,
			login,
			logout,
		}),
		[currentUser, authLoading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
