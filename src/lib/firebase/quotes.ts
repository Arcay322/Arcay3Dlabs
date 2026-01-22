import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { QuoteRequest } from './types';

const QUOTES_COLLECTION = 'quotes';

// Upload file to Firebase Storage
export async function uploadQuoteFile(file: File): Promise<string> {
  if (!storage) {
    console.warn('Firebase Storage no está inicializado. No se puede subir el archivo.');
    throw new Error('El servicio de almacenamiento no está disponible.');
  }

  const timestamp = Date.now();
  const fileName = `quotes/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

// Create new quote request
export async function createQuoteRequest(
  quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  const docRef = await addDoc(collection(db, QUOTES_COLLECTION), {
    ...quote,
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

// Get all quote requests
export async function getQuoteRequests(status?: string): Promise<QuoteRequest[]> {
  let q = query(collection(db, QUOTES_COLLECTION), orderBy('createdAt', 'desc'));

  if (status) {
    q = query(collection(db, QUOTES_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'));
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as QuoteRequest[];
}

// Get single quote request
export async function getQuoteRequest(id: string): Promise<QuoteRequest | null> {
  const docRef = doc(db, QUOTES_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as QuoteRequest;
}

// Update quote request
export async function updateQuoteRequest(
  id: string,
  updates: Partial<Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, QUOTES_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}
