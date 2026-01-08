import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { Role } from '../types';

export default function ProtectedRoute({ role = 'ADMIN' }: { role?: Role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
