import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";

export const db = getFirestore(firebaseApp);

export const upsertUserProfile = async ({ uid, data }) => {
	const ref = doc(db, "users", uid);
	await setDoc(
		ref,
		{
			...data,
			uid,
			updatedAt: serverTimestamp(),
			createdAt: data?.createdAt ?? serverTimestamp(),
		},
		{ merge: true }
	);
	return ref;
};

export const setUserDocExact = async ({ uid, data }) => {
	const ref = doc(db, "users", uid);
	await setDoc(ref, data);
	return ref;
};

export const getUserProfile = async (uid) => {
	const ref = doc(db, "users", uid);
	const snap = await getDoc(ref);
	return snap.exists() ? snap.data() : null;
};

export const deleteUserProfile = async (uid) => {
	const ref = doc(db, "users", uid);
	await deleteDoc(ref);
};

export const listProducts = async () => {
	const ref = collection(db, "products");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createProduct = async ({ data }) => {
	const ref = collection(db, "products");
	const docRef = await addDoc(ref, {
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const updateProduct = async ({ id, data }) => {
	const ref = doc(db, "products", id);
	await updateDoc(ref, {
		...data,
		updatedAt: serverTimestamp(),
	});
	return ref;
};

export const deleteProduct = async (id) => {
	const ref = doc(db, "products", id);
	await deleteDoc(ref);
};
