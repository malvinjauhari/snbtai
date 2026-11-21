import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { PageLoader } from './shared/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.log("ProtectedRoute: No user, redirecting to login");
      navigate('/auth/login', { state: { from: location }, replace: true });
      return;
    }
  }, [user, loading, location, navigate]);

  if (loading) return <PageLoader />;

  // If we are redirecting, we can return null to avoid flashing.
  // We'll let the user render only if authenticated
  if (!user) return null;

  return <>{children}</>;
}
