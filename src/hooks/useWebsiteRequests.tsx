
import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { 
  WebsiteRequest, 
  getAllWebsiteRequests, 
  getClientWebsiteRequests,
  addWebsiteRequest,
  updateRequestStatus
} from '@/lib/firestore';
import { useAuth } from './useAuth';

export const useWebsiteRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<WebsiteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const query = user.role === 'admin' 
      ? getAllWebsiteRequests()
      : getClientWebsiteRequests(user.uid);

    const unsubscribe = onSnapshot(query, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WebsiteRequest[];
      
      setRequests(requestsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const submitRequest = async (requestData: { title: string; description: string; requirements: string }) => {
    if (!user) return { error: 'User not authenticated' };

    return await addWebsiteRequest({
      ...requestData,
      status: 'pending',
      clientEmail: user.email || '',
      clientId: user.uid
    });
  };

  const updateStatus = async (requestId: string, status: WebsiteRequest['status']) => {
    return await updateRequestStatus(requestId, status);
  };

  return {
    requests,
    loading,
    submitRequest,
    updateStatus
  };
};
