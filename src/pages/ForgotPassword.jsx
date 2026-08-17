import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      /* always show generic success */
    } finally {
      setSent(true);
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
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-3 text-accent" size={40} />
              <h1 className="font-display text-3xl text-primary">Kiểm tra email</h1>
              <p className="mt-2 text-sm text-muted-foreground">Nếu email tồn tại, chúng tôi đã gửi liên kết đặt lại mật khẩu đến <span className="font-medium text-primary">{email}</span>.</p>
              <Link to="/login"><Button className="mt-6 w-full rounded-full bg-primary">Quay lại đăng nhập</Button></Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl text-primary">Quên mật khẩu</h1>
              <p className="mt-2 text-sm text-muted-foreground">Nhập email đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="ban@email.com" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                  {loading ? 'Đang gửi...' : 'Gửi liên kết'}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Nhớ mật khẩu? <Link to="/login" className="font-medium text-accent hover:underline">Đăng nhập</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}