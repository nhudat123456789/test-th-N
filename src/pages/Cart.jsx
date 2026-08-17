import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQty, removeItem, total, saved, count } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-primary">
          <ShoppingBag size={36} />
        </div>
        <h1 className="font-display text-4xl text-primary">Giỏ hàng trống</h1>
        <p className="mt-2 text-muted-foreground">Hãy thêm vài món rau tươi vào giỏ nhé!</p>
        <Link to="/products">
          <Button className="mt-6 rounded-full bg-primary px-8">Mua sắm ngay</Button>
        </Link>
      </div>
    );
  }

  const checkoutTo = isAuthenticated ? '/checkout' : '/login?returnTo=/checkout';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-4xl text-primary">Giỏ hàng <span className="text-muted-foreground">({count})</span></h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white p-3">
              <Link to={`/products/${it.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                {it.image ? <Image src={it.image} alt={it.name} fittingType="fill" className="h-full w-full" /> : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${it.id}`} className="font-medium text-primary hover:text-accent">{it.name}</Link>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{it.price.toLocaleString('vi-VN')}₫ / {it.unit}</span>
                  {it.old_price && <span className="line-through">{it.old_price.toLocaleString('vi-VN')}₫</span>}
                </div>
              </div>
              <div className="flex items-center rounded-full border border-emerald-900/15">
                <button onClick={() => updateQty(it.id, it.qty - 1)} className="grid h-9 w-9 place-items-center text-primary hover:bg-emerald-50"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm">{it.qty}</span>
                <button onClick={() => updateQty(it.id, it.qty + 1)} className="grid h-9 w-9 place-items-center text-primary hover:bg-emerald-50"><Plus size={14} /></button>
              </div>
              <div className="w-28 text-right font-mono font-semibold text-primary">{(it.price * it.qty).toLocaleString('vi-VN')}₫</div>
              <button onClick={() => removeItem(it.id)} className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-6">
            <h2 className="font-display text-2xl text-primary">Tổng đơn</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span className="font-mono">{total.toLocaleString('vi-VN')}₫</span>
              </div>
              {saved > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Tiết kiệm</span>
                  <span className="font-mono">-{saved.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between border-t border-emerald-900/10 pt-3 text-lg font-semibold text-primary">
                <span>Tổng cộng</span>
                <span className="font-mono">{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <Link to={checkoutTo}>
              <Button className="mt-6 w-full rounded-full bg-accent py-6 text-white hover:bg-accent/90">
                Tiến hành thanh toán <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}