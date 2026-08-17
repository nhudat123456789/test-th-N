import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Lock } from 'lucide-react';

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự.'); return; }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      window.location.href = '/login';
    } catch (err) {
      setError(err?.message || 'Đặt lại mật khẩu thất bại. Liên kết có thể đã hết hạn.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/40 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><Leaf size={18} /></span>
          <span className="font-display text-2xl text-primary">Rau Nhà Phố</span>
        </Link>
        <div className="rounded-3xl border border-emerald-900/10 bg-white p-8 shadow-sm">
          <h1 className="font-display text-3xl text-primary">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-sm text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu mới</Label>
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
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-accent hover:underline">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}