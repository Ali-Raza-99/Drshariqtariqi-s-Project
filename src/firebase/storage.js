import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
} from "firebase/storage";
import { firebaseApp } from "./firebase";

export const storage = getStorage(firebaseApp);

export const uploadUserProfilePicture = async ({ uid, file }) => {
	const objectRef = ref(storage, `userImages/${uid}/profile-picture`);
	await uploadBytes(objectRef, file);
	const url = await getDownloadURL(objectRef);
	return { url, path: objectRef.fullPath };
};

export const uploadFileAndGetUrl = async ({ file, fullPath }) => {
	if (!file) throw new Error("File is required");
	if (!fullPath || String(fullPath).trim() === "") throw new Error("fullPath is required");

	const objectRef = ref(storage, fullPath);
	await uploadBytes(objectRef, file);
	const url = await getDownloadURL(objectRef);
	return { url, path: objectRef.fullPath };
};

export const uploadToFolderAndGetUrl = async ({ file, folder = "uploads" }) => {
	if (!file) throw new Error("File is required");
	const safeName = `${Date.now()}-${file.name || "file"}`;
	return uploadFileAndGetUrl({ file, fullPath: `${folder}/${safeName}` });
};

export const deleteStorageFileByPath = async (fullPath) => {
	if (!fullPath) return;
	const objectRef = ref(storage, fullPath);
	await deleteObject(objectRef);
};
