import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getPostLoginPath } from '@/lib/roles';
import { safeReturnTo } from '@/lib/authReturnTo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { applyAuthSession, isAuthenticated, user, authChecked, isLoadingAuth } = useAuth();
  const returnTo = safeReturnTo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authChecked && !isLoadingAuth && isAuthenticated) {
    return <Navigate to={getPostLoginPath(user, returnTo)} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await base44.auth.loginViaEmailPassword(email, password);
      applyAuthSession(user);
      navigate(getPostLoginPath(user, returnTo), { replace: true });
    } catch (err) {
      setError(err?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40 md:flex-row">
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><Leaf size={18} /></span>
          <span className="font-display text-2xl text-primary">Rau Nhà Phố</span>
        </Link>
        <div className="mx-auto w-full max-w-sm py-10">
          <h1 className="font-display text-4xl text-primary">Đăng nhập</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vui lòng đăng nhập để đặt hàng và xem lịch sử đơn.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="ban@email.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản? <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`} className="font-medium text-accent hover:underline">Đăng ký</Link>
          </p>
        </div>
        <div />
      </div>
      <div className="relative hidden md:block md:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-700" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-display text-4xl leading-tight">Tươi mỗi lá, sạch từng bữa.</p>
          <p className="mt-3 max-w-sm text-emerald-100">Nguồn gốc rõ ràng, giao nhanh tận bếp — trải nghiệm mua sắm rau củ quả tươi sạch.</p>
        </div>
      </div>
    </div>
  );
}