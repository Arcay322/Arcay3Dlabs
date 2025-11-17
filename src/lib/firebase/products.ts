import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Product } from './types';

const PRODUCTS_COLLECTION = 'products';

// Get all products with optional filters
export async function getProducts(filters?: {
  category?: string;
  featured?: boolean;
  limitCount?: number;
}): Promise<Product[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }

  if (filters?.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured));
  }

  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}

// Get single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as Product;
}

// Create new product
export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

// Update product
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Get featured products
export async function getFeaturedProducts(limitCount: number = 4): Promise<Product[]> {
  return getProducts({ featured: true, limitCount });
}
