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
	where,
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

export const deleteMureed = async (id) => {
	const ref = doc(db, "mureeds", id);
	await deleteDoc(ref);
};

// ------------------------------
// Appointments
// ------------------------------

export const listAppointments = async () => {
	const ref = collection(db, "Appointment");
	const q = query(ref, orderBy("createdAt", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteAppointment = async (id) => {
	const ref = doc(db, "Appointment", id);
	await deleteDoc(ref);
};

export const setUserRole = async (uid, role) => {
	const ref = doc(db, "users", uid);
	await updateDoc(ref, {
		role: role,
		updatedAt: serverTimestamp(),
	});
	return ref;
};

// ------------------------------
// Cart (Global Collection)
// stored in cart/{cartItemId}
// with uid for filtering
// ------------------------------

export const addToCart = async ({ uid, productId, productData, quantity = 1 }) => {
	const cartRef = collection(db, "cart");
	const q = query(cartRef, where("uid", "==", uid), where("productId", "==", productId));
	const existingDocs = await getDocs(q);
	
	// Check if product already exists in user's cart
	if (existingDocs.docs.length > 0) {
		const existingProduct = existingDocs.docs[0];
		// Update quantity
		await updateDoc(doc(cartRef, existingProduct.id), {
			quantity: (existingProduct.data().quantity ?? 1) + quantity,
			updatedAt: serverTimestamp(),
		});
		return existingProduct.ref;
	} else {
		// Add new product to cart
		const docRef = await addDoc(cartRef, {
			uid,
			productId,
			...productData,
			quantity,
			addedAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return docRef;
	}
};

export const getCartItems = async (uid) => {
	const cartRef = collection(db, "cart");
	const q = query(cartRef, where("uid", "==", uid));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateCartItemQuantity = async ({ cartItemId, quantity }) => {
	const itemRef = doc(db, "cart", cartItemId);
	// Update quantity (can be 0 to show out of stock)
	await updateDoc(itemRef, {
		quantity,
		updatedAt: serverTimestamp(),
	});
	return itemRef;
};

export const removeCartItem = async (cartItemId) => {
	const itemRef = doc(db, "cart", cartItemId);
	await deleteDoc(itemRef);
};

export const clearCart = async (uid) => {
	const cartRef = collection(db, "cart");
	const q = query(cartRef, where("uid", "==", uid));
	const snap = await getDocs(q);
	const batch = [];
	snap.docs.forEach((d) => {
		batch.push(deleteDoc(d.ref));
	});
	await Promise.all(batch);
};

// ------------------------------
// Orders (Global Collection)
// stored in orders/{orderId}
// with uid for user filtering
// ------------------------------

export const createOrder = async ({ uid, orderData }) => {
	const ordersRef = collection(db, "orders");
	const docRef = await addDoc(ordersRef, {
		...orderData,
		uid,
		status: "completed",
		checkoutDate: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
	return docRef;
};

export const getUserOrders = async (uid) => {
	const ordersRef = collection(db, "orders");
	const q = query(ordersRef, where("uid", "==", uid), orderBy("checkoutDate", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllOrders = async () => {
	const ordersRef = collection(db, "orders");
	const q = query(ordersRef, orderBy("checkoutDate", "desc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateOrder = async ({ orderId, data }) => {
	const orderRef = doc(db, "orders", orderId);
	await updateDoc(orderRef, {
		...data,
		updatedAt: serverTimestamp(),
	});
	return orderRef;
};

export const deleteOrder = async (orderId) => {
	const orderRef = doc(db, "orders", orderId);
	await deleteDoc(orderRef);
};

// Backward compatibility aliases
export const addOrderToCart = addToCart;
export const getUserCart = getCartItems;
export const removeFromCart = removeCartItem;
export const clearUserCart = clearCart;
export const createCheckout = createOrder;
export const getUserCheckouts = getUserOrders;