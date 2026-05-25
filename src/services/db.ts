import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export const collections = {
  STORES: "stores",
  PRODUCTS: "products",
  MATERIALS: "materials",
  ORDERS: "orders"
};

// ========================
// STORES
// ========================

export async function fetchStoreProfile(storeId: string) {
  try {
    const docRef = doc(db, collections.STORES, storeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collections.STORES}/${storeId}`);
    return null;
  }
}

export async function saveStoreProfile(storeId: string, data: any) {
  try {
    const docRef = doc(db, collections.STORES, storeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, { ...data, ownerId: storeId, createdAt: new Date().toISOString() });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collections.STORES}/${storeId}`);
  }
}


// ========================
// PRODUCTS
// ========================

export async function fetchActiveProducts(storeId: string) {
  try {
    const q = query(
      collection(db, collections.PRODUCTS), 
      where("storeId", "==", storeId),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collections.PRODUCTS);
    return [];
  }
}

export function subscribeToProducts(storeId: string, callback: (products: any[]) => void) {
  const q = query(collection(db, collections.PRODUCTS), where("storeId", "==", storeId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collections.PRODUCTS);
  });
}

// ========================
// MATERIALS
// ========================

export function subscribeToMaterials(storeId: string, callback: (materials: any[]) => void) {
  const q = query(collection(db, collections.MATERIALS), where("storeId", "==", storeId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collections.MATERIALS);
  });
}

// ========================
// ORDERS
// ========================

export function subscribeToOrders(storeId: string, callback: (orders: any[]) => void) {
  const q = query(collection(db, collections.ORDERS), where("storeId", "==", storeId));
  return onSnapshot(q, (snapshot) => {
    // Sort locally because we can't orderBy on a different field than the inequality filter in Firebase without an index
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collections.ORDERS);
  });
}

// ========================
// GENERIC OPERATIONS
// ========================

export async function createDocument(collectionName: string, id: string, data: any) {
  try {
    // Ensure storeId is included implicitly if not provided, but mostly we provide it in components
    await setDoc(doc(db, collectionName, id), { ...data, createdAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${id}`);
  }
}

export async function updateDocument(collectionName: string, id: string, data: any) {
  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}
