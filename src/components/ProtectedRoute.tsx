
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role required, redirect to appropriate dashboard
  if (!requiredRole) {
    const redirectPath = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/client';
    return <Navigate to={redirectPath} replace />;
  }

  // If user doesn't have required role, redirect to their appropriate dashboard
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
