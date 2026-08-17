import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, CreditCard, Truck, CheckCircle2, Wallet } from 'lucide-react';

const PAYMENTS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: Wallet },
  { id: 'stripe', label: 'Thẻ tín dụng / ghi nợ (Stripe)', icon: CreditCard },
];

export default function Checkout() {
  const { items, total, saved, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  });
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.address) { setError('Vui lòng điền họ tên, số điện thoại và địa chỉ giao hàng.'); return; }
    setLoading(true);
    try {
      const result = await base44.functions.invoke('placeOrder', {
        customer_name: form.name,
        customer_email: form.email || user?.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          image: i.image,
        })),
        total,
        payment_method: payment,
        note: form.note,
      });

      const order = result?.data?.order ?? result?.order ?? result?.data ?? result;

      if (user) {
        base44.auth.updateMe({ phone: form.phone, address: form.address }).catch(() => {});
      }

      clear();
      setDone(order);
    } catch (err) {
      setError(err?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-accent" size={56} />
        <h1 className="font-display text-4xl text-primary">Đặt hàng thành công!</h1>
        <p className="mt-3 text-muted-foreground">Cảm ơn {done.customer_name}! Đơn hàng <span className="font-mono text-primary">#{done?.id ? done.id.slice(-8).toUpperCase() : 'ĐANG XỬ LÝ'}</span> đã được tiếp nhận. Chúng tôi sẽ giao tươi đến bạn sớm nhất.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/my-garden"><Button className="rounded-full bg-accent text-white hover:bg-accent/90">Theo dõi vườn rau</Button></Link>
          <Link to="/products"><Button variant="outline" className="rounded-full">Tiếp tục mua sắm</Button></Link>
          <Link to="/account"><Button variant="outline" className="rounded-full">Xem đơn hàng</Button></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Giỏ hàng trống</h1>
        <Link to="/products"><Button className="mt-6 rounded-full bg-primary">Mua sắm</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-4xl text-primary">Thanh toán</h1>
      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-emerald-900/10 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-primary"><MapPin size={20} /> Địa chỉ giao hàng</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Họ và tên *</Label>
                <Input value={form.name} onChange={set('name')} required placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-1.5">
                <Label>Số điện thoại *</Label>
                <Input value={form.phone} onChange={set('phone')} required placeholder="09xx xxx xxx" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="ban@email.com" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Địa chỉ giao hàng *</Label>
                <Input value={form.address} onChange={set('address')} required placeholder="Số nhà, đường, phường, quận, TP" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Ghi chú (tuỳ chọn)</Label>
                <Textarea value={form.note} onChange={set('note')} rows={2} placeholder="Thời gian giao, lưu ý giao hàng..." />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-900/10 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-primary"><Wallet size={20} /> Phương thức thanh toán</h2>
            <div className="space-y-3">
              {PAYMENTS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${payment === p.id ? 'border-accent bg-emerald-50' : 'border-emerald-900/10 hover:bg-emerald-50/50'}`}
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${payment === p.id ? 'bg-accent text-white' : 'bg-emerald-50 text-primary'}`}><p.icon size={18} /></span>
                  <span className="text-sm font-medium text-primary">{p.label}</span>
                  <span className={`ml-auto h-5 w-5 rounded-full border-2 ${payment === p.id ? 'border-accent bg-accent' : 'border-emerald-900/20'}`} />
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-6">
            <h2 className="font-display text-2xl text-primary">Đơn của bạn</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-auto">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-emerald-50">{it.image && <Image src={it.image} alt="" fittingType="fill" className="h-full w-full" />}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-primary">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.qty} × {it.price.toLocaleString('vi-VN')}₫</div>
                  </div>
                  <div className="font-mono text-sm text-primary">{(it.qty * it.price).toLocaleString('vi-VN')}₫</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-emerald-900/10 pt-4 text-sm">
              {saved > 0 && (
                <div className="flex justify-between text-destructive"><span>Tiết kiệm</span><span className="font-mono">-{saved.toLocaleString('vi-VN')}₫</span></div>
              )}
              <div className="flex justify-between text-muted-foreground"><span>Phí vận chuyển</span><span className="text-accent">Miễn phí</span></div>
              <div className="flex justify-between border-t border-emerald-900/10 pt-2 text-lg font-semibold text-primary">
                <span>Tổng cộng</span><span className="font-mono">{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-5 w-full rounded-full bg-accent py-6 text-white hover:bg-accent/90">
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Truck size={13} /> Giao tươi trong 2 giờ nội thành</p>
          </div>
        </div>
      </form>
    </div>
  );
}