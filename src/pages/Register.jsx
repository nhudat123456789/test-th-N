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

export default function Register() {
  const navigate = useNavigate();
  const { applyAuthSession, isAuthenticated, user, authChecked, isLoadingAuth } = useAuth();
  const returnTo = safeReturnTo();
  const [step, setStep] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authChecked && !isLoadingAuth && isAuthenticated) {
    return <Navigate to={getPostLoginPath(user, returnTo)} replace />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự.'); return; }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep('otp');
    } catch (err) {
      setError(err?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode: otp });

      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
        const sessionUser = result?.user ?? await base44.auth.me();
        applyAuthSession(sessionUser);
        navigate(getPostLoginPath(sessionUser, returnTo), { replace: true });
        return;
      }

      const { user: loginUser } = await base44.auth.loginViaEmailPassword(email, password);
      applyAuthSession(loginUser);
      navigate(getPostLoginPath(loginUser, returnTo), { replace: true });
    } catch (err) {
      setError(err?.message || 'Mã OTP không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try { await base44.auth.resendOtp(email); } catch {}
  };

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40 md:flex-row">
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><Leaf size={18} /></span>
          <span className="font-display text-2xl text-primary">Rau Nhà Phố</span>
        </Link>
        <div className="mx-auto w-full max-w-sm py-10">
          {step === 'register' ? (
            <>
              <h1 className="font-display text-4xl text-primary">Tạo tài khoản</h1>
              <p className="mt-2 text-sm text-muted-foreground">Tham gia Rau Nhà Phố để mua sắm rau tươi mỗi ngày.</p>
              <form onSubmit={handleRegister} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="ban@email.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="Tối thiểu 6 ký tự" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-9" placeholder="Nhập lại mật khẩu" />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Đã có tài khoản? <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-medium text-accent hover:underline">Đăng nhập</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl text-primary">Xác minh OTP</h1>
              <p className="mt-2 text-sm text-muted-foreground">Chúng tôi đã gửi mã xác minh đến <span className="font-medium text-primary">{email}</span>.</p>
              <form onSubmit={handleVerify} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp">Mã OTP</Label>
                  <Input id="otp" required value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center text-2xl tracking-[0.5em]" placeholder="000000" maxLength={6} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                  {loading ? 'Đang xác minh...' : 'Xác minh & đăng nhập'}
                </Button>
              </form>
              <button onClick={resend} className="mt-4 w-full text-center text-sm text-accent hover:underline">Gửi lại mã OTP</button>
            </>
          )}
        </div>
        <div />
      </div>
      <div className="relative hidden md:block md:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-700" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-display text-4xl leading-tight">Gia nhập vườn tươi.</p>
          <p className="mt-3 max-w-sm text-emerald-100">Đăng ký ngay để nhận ưu đãi đầu tiên và theo dõi đơn hàng mọi lúc.</p>
        </div>
      </div>
    </div>
  );
}