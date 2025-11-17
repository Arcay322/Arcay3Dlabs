import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { GalleryImage } from './types';

const GALLERY_COLLECTION = 'gallery';

// Upload image to Firebase Storage
export async function uploadGalleryImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const fileName = `gallery/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

// Delete image from Firebase Storage
export async function deleteGalleryImageFile(imageUrl: string): Promise<void> {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
}

// Create new gallery image entry
export async function addGalleryImage(
  image: Omit<GalleryImage, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
    ...image,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// Get all gallery images
export async function getGalleryImages(filters?: {
  category?: string;
  featured?: boolean;
}): Promise<GalleryImage[]> {
  let q = query(collection(db, GALLERY_COLLECTION), orderBy('createdAt', 'desc'));

  if (filters?.category) {
    q = query(
      collection(db, GALLERY_COLLECTION),
      where('category', '==', filters.category),
      orderBy('createdAt', 'desc')
    );
  }

  if (filters?.featured !== undefined) {
    q = query(
      collection(db, GALLERY_COLLECTION),
      where('featured', '==', filters.featured),
      orderBy('createdAt', 'desc')
    );
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as GalleryImage[];
}

// Delete gallery image
export async function deleteGalleryImage(id: string, imageUrl: string): Promise<void> {
  // Delete from Storage
  await deleteGalleryImageFile(imageUrl);
  
  // Delete from Firestore
  const docRef = doc(db, GALLERY_COLLECTION, id);
  await deleteDoc(docRef);
}
