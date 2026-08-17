import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Package, LogOut, Clock, Truck, CheckCircle2, XCircle, Camera } from 'lucide-react';

const STATUS = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', icon: Clock },
  shipping: { label: 'Đang giao', color: 'bg-sky-100 text-sky-700', icon: Truck },
  completed: { label: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ phone: user?.phone || '', address: user?.address || '' });
    if (user?.email) {
      base44.entities.Order.filter({ customer_email: user.email }, '-created_date', 50)
        .then(setOrders)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.auth.updateMe({ phone: form.phone, address: form.address });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Tài khoản</p>
          <h1 className="mt-1 font-display text-4xl text-primary">Xin chào, {user?.full_name || user?.email}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/my-garden">
            <Button className="rounded-full bg-accent text-white hover:bg-accent/90"><Camera size={16} className="mr-2" /> Vườn của tôi</Button>
          </Link>
          <Button variant="outline" onClick={() => logout()} className="rounded-full">
            <LogOut size={16} className="mr-2" /> Đăng xuất
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-emerald-900/10 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-primary"><User size={20} /> Hồ sơ</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-emerald-50/50" />
            </div>
            <div className="space-y-1.5">
              <Label>Số điện thoại</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xx xxx xxx" />
            </div>
            <div className="space-y-1.5">
              <Label>Địa chỉ giao hàng</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Địa chỉ mặc định" />
            </div>
            <Button type="submit" disabled={saving} className="w-full rounded-full bg-primary">{saving ? 'Đang lưu...' : 'Lưu'}</Button>
          </form>
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-primary"><Package size={20} /> Lịch sử đơn hàng</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-emerald-50" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-900/15 p-10 text-center">
              <p className="font-display text-2xl text-primary">Chưa có đơn hàng</p>
              <p className="mt-1 text-sm text-muted-foreground">Đơn hàng đầu tiên của bạn đang chờ!</p>
              <Link to="/products"><Button className="mt-5 rounded-full bg-primary">Mua sắm</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const st = STATUS[o.status] || STATUS.pending;
                return (
                  <div key={o.id} className="rounded-2xl border border-emerald-900/10 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-mono text-sm text-primary">#{o.id.slice(-8).toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground">{new Date(o.created_date).toLocaleString('vi-VN')}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${st.color}`}><st.icon size={13} /> {st.label}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        {o.items?.length} sản phẩm · {o.items?.reduce((s, i) => s + i.quantity, 0)} phần
                      </div>
                      <div className="font-mono font-semibold text-primary">{o.total.toLocaleString('vi-VN')}₫</div>
                    </div>
                    <div className="mt-3 truncate text-xs text-muted-foreground">Giao đến: {o.shipping_address}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}