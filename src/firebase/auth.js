import {
	createUserWithEmailAndPassword,
	deleteUser,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	getAuth,
} from "firebase/auth";
import { firebaseApp } from "./firebase";

export const auth = getAuth(firebaseApp);

export const listenToAuthChanges = (callback) => onAuthStateChanged(auth, callback);

export const signupWithEmail = async ({ email, password, displayName, photoURL }) => {
	const credential = await createUserWithEmailAndPassword(auth, email, password);
	if (displayName || photoURL) {
		await updateProfile(credential.user, {
			displayName: displayName ?? null,
			photoURL: photoURL ?? null,
		});
	}
	return credential.user;
};

export const updateAuthUserProfile = async (user, { displayName, photoURL }) => {
	if (!user) return;
	await updateProfile(user, {
		displayName: displayName ?? user.displayName ?? null,
		photoURL: photoURL ?? user.photoURL ?? null,
	});
};

export const loginWithEmail = async ({ email, password }) => {
	const credential = await signInWithEmailAndPassword(auth, email, password);
	return credential.user;
};

export const logout = async () => signOut(auth);

export const deleteAuthUser = async (user) => {
	if (!user) return;
	await deleteUser(user);
};
