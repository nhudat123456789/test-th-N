import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/roles';
import Forbidden from '@/pages/Forbidden';

export default function AdminRoute({ children, showForbidden = true }) {
  const { user, isLoadingAuth, authChecked } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin(user)) {
    if (showForbidden) return <Forbidden />;
    return <Navigate to="/" replace />;
  }

  return children;
}
