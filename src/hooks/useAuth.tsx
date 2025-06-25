
import { useState, useEffect, createContext, useContext } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface AuthUser extends User {
  role?: 'client' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get custom claims for role
        const tokenResult = await firebaseUser.getIdTokenResult();
        const role = tokenResult.claims.role as 'client' | 'admin' || 'client';
        
        setUser({
          ...firebaseUser,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
