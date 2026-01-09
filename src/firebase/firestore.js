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

// ------------------------------
// Courses
// ------------------------------

export const listCourses = async () => {
	const ref = collection(db, "courses");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createCourse = async ({ data }) => {
	const ref = collection(db, "courses");
	const docRef = await addDoc(ref, {
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const updateCourse = async ({ id, data }) => {
	const ref = doc(db, "courses", id);
	await updateDoc(ref, {
		...data,
		updatedAt: serverTimestamp(),
	});
	return ref;
};

export const deleteCourse = async (id) => {
	const ref = doc(db, "courses", id);
	await deleteDoc(ref);
};

// ------------------------------
// Ijtimai Qurbani Config
// ------------------------------

export const listQurbaniAnimals = async () => {
	const ref = collection(db, "qurbaniAnimals");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createQurbaniAnimal = async ({ data }) => {
	const ref = collection(db, "qurbaniAnimals");
	const docRef = await addDoc(ref, {
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const updateQurbaniAnimal = async ({ id, data }) => {
	const ref = doc(db, "qurbaniAnimals", id);
	await updateDoc(ref, {
		...data,
		updatedAt: serverTimestamp(),
	});
	return ref;
};

export const deleteQurbaniAnimal = async (id) => {
	const ref = doc(db, "qurbaniAnimals", id);
	await deleteDoc(ref);
};

export const listQurbaniBanks = async () => {
	const ref = collection(db, "qurbaniBanks");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createQurbaniBank = async ({ data }) => {
	const ref = collection(db, "qurbaniBanks");
	const docRef = await addDoc(ref, {
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const updateQurbaniBank = async ({ id, data }) => {
	const ref = doc(db, "qurbaniBanks", id);
	await updateDoc(ref, {
		...data,
		updatedAt: serverTimestamp(),
	});
	return ref;
};

export const deleteQurbaniBank = async (id) => {
	const ref = doc(db, "qurbaniBanks", id);
	await deleteDoc(ref);
};

// ------------------------------
// Mureed Registration
// ------------------------------

export const registerMureed = async ({ data }) => {
	const ref = collection(db, "mureeds");
	const docRef = await addDoc(ref, {
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const listMureeds = async () => {
	const ref = collection(db, "mureeds");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
