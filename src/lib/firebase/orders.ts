import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Order } from './types';

const ORDERS_COLLECTION = 'orders';

// Create new order
export async function createOrder(
  order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  // TODO: Implement Firebase when configured
  // For now, simulate order creation with mock data
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('Order created (mock):', {
    id: orderId,
    ...order,
  });

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500));

  return orderId;

  /* Firebase implementation (use when configured):
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
  */
}

// Get all orders
export async function getOrders(filters?: {
  status?: string;
  customerEmail?: string;
}): Promise<Order[]> {
  let q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));

  if (filters?.status) {
    q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', filters.status),
      orderBy('createdAt', 'desc')
    );
  }

  if (filters?.customerEmail) {
    q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerEmail', '==', filters.customerEmail),
      orderBy('createdAt', 'desc')
    );
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Order[];
}

// Get single order
export async function getOrder(id: string): Promise<Order | null> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as Order;
}

// Update order
export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}
