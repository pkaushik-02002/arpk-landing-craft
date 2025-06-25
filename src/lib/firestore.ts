
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { app } from './firebase';

export const db = getFirestore(app);

export interface WebsiteRequest {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected' | 'on-hold';
  createdAt: any;
  clientEmail: string;
  clientId: string;
}

// Add a new website request
export const addWebsiteRequest = async (requestData: Omit<WebsiteRequest, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'websiteRequests'), {
      ...requestData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Get all website requests (for admin)
export const getAllWebsiteRequests = () => {
  return query(collection(db, 'websiteRequests'), orderBy('createdAt', 'desc'));
};

// Get website requests for a specific client
export const getClientWebsiteRequests = (clientId: string) => {
  return query(
    collection(db, 'websiteRequests'),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
};

// Update request status
export const updateRequestStatus = async (requestId: string, status: WebsiteRequest['status']) => {
  try {
    await updateDoc(doc(db, 'websiteRequests', requestId), { status });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
