import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image } from '@/components/ui/image';
import { LayoutDashboard, Package, ClipboardList, Tag, MessageSquare, Star, Plus, Pencil, Trash2, X, Reply } from 'lucide-react';

const TABS = [
  { id: 'products', label: 'Sản phẩm', icon: Package },
  { id: 'orders', label: 'Đơn hàng', icon: ClipboardList },
  { id: 'messages', label: 'Liên hệ', icon: MessageSquare },
  { id: 'reviews', label: 'Đánh giá', icon: Star },
];

const ORDER_STATUS = [
  { value: 'pending', label: 'Chờ xử lý', cls: 'bg-amber-100 text-amber-700' },
  { value: 'shipping', label: 'Đang giao', cls: 'bg-sky-100 text-sky-700' },
  { value: 'completed', label: 'Hoàn tất', cls: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelled', label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
];

const EMPTY_PRODUCT = { name: '', category: 'Rau Lá', price: '', old_price: '', unit: 'kg', stock: '', description: '', origin: '', images: [''], is_best_seller: false };

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadProducts = useCallback(() => { base44.entities.Product.list('-created_date', 100).then(setProducts).catch(() => {}); }, []);
  const loadOrders = useCallback(() => { base44.entities.Order.list('-created_date', 100).then(setOrders).catch(() => {}); }, []);
  const loadMessages = useCallback(() => { base44.entities.ContactMessage.list('-created_date', 100).then(setMessages).catch(() => {}); }, []);
  const loadReviews = useCallback(() => { base44.entities.Review.list('-created_date', 100).then(setReviews).catch(() => {}); }, []);

  useEffect(() => {
    loadProducts(); loadOrders(); loadMessages(); loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* TOP BAR */}
      <header className="glass sticky top-0 z-40 border-b border-emerald-900/10 bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><LayoutDashboard size={18} /></span>
          <span className="font-display text-2xl text-primary">Quản trị Rau Nhà Phố</span>
          <Link to="/" className="ml-auto"><Button variant="outline" size="sm" className="rounded-full">Xem cửa hàng</Button></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* TABS */}
        <div className="mb-6 flex gap-1 overflow-x-auto hide-scrollbar rounded-full bg-white p-1.5 ring-1 ring-emerald-900/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-emerald-50'}`}
            >
              <t.icon size={16} /> {t.label}
              {t.id === 'messages' && messages.filter((m) => m.status === 'new').length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{messages.filter((m) => m.status === 'new').length}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <ProductsTab products={products} reload={loadProducts} editing={editing} setEditing={setEditing} />
        )}
        {tab === 'orders' && <OrdersTab orders={orders} reload={loadOrders} />}
        {tab === 'messages' && <MessagesTab messages={messages} reload={loadMessages} />}
        {tab === 'reviews' && <ReviewsTab reviews={reviews} products={products} reload={loadReviews} />}
      </div>

      {editing && (
        <ProductForm
          product={editing === 'new' ? EMPTY_PRODUCT : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); loadProducts(); }}
        />
      )}
    </div>
  );
}

/* ---------- PRODUCTS ---------- */
function ProductsTab({ products, reload, setEditing }) {
  const del = async (p) => {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    await base44.entities.Product.delete(p.id);
    reload();
  };
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl text-primary">Sản phẩm ({products.length})</h2>
        <Button onClick={() => setEditing('new')} className="rounded-full bg-primary"><Plus size={16} className="mr-1" /> Thêm sản phẩm</Button>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-emerald-900/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50/60 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Sản phẩm</th>
              <th className="px-4 py-3 font-medium">Danh mục</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Tồn kho</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-emerald-900/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-emerald-50">{p.images?.[0] && <Image src={p.images[0]} alt="" fittingType="fill" className="h-full w-full" />}</div>
                    <div>
                      <div className="font-medium text-primary">{p.name}</div>
                      {p.is_best_seller && <span className="text-xs text-accent">Bán chạy</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-mono text-primary">{p.price.toLocaleString('vi-VN')}₫</td>
                <td className="px-4 py-3 text-muted-foreground">{p.stock} {p.unit}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'out_of_stock' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {p.status === 'out_of_stock' ? 'Hết hàng' : 'Còn hàng'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded-lg text-primary hover:bg-emerald-50"><Pencil size={15} /></button>
                    <button onClick={() => del(p)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ ...product, price: product.price ?? '', old_price: product.old_price ?? '', stock: product.stock ?? '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setImg = (i, v) => { const imgs = [...(form.images || [])]; imgs[i] = v; setForm({ ...form, images: imgs }); };
  const addImg = () => setForm({ ...form, images: [...(form.images || []), ''] });
  const removeImg = (i) => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      discount_percent: form.old_price ? Math.round(((Number(form.old_price) - Number(form.price)) / Number(form.old_price)) * 100) : 0,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      description: form.description,
      origin: form.origin,
      images: (form.images || []).filter(Boolean),
      is_best_seller: !!form.is_best_seller,
      status: Number(form.stock) > 0 ? 'in_stock' : 'out_of_stock',
    };
    try {
      if (form.id) await base44.entities.Product.update(form.id, payload);
      else await base44.entities.Product.create(payload);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-primary">{form.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Tên sản phẩm *</Label><Input required value={form.name} onChange={set('name')} /></div>
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
              <select value={form.category} onChange={set('category')} className="h-10 w-full rounded-lg border border-emerald-900/15 bg-white px-3 text-sm">
                {['Rau Lá', 'Củ Quả', 'Trái Cây', 'Gia Vị'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><Label>Giá hiện tại (₫) *</Label><Input type="number" required value={form.price} onChange={set('price')} /></div>
            <div className="space-y-1.5"><Label>Giá cũ (₫) — để trống nếu không KM</Label><Input type="number" value={form.old_price} onChange={set('old_price')} /></div>
            <div className="space-y-1.5"><Label>Đơn vị</Label><Input value={form.unit} onChange={set('unit')} placeholder="kg / bó / túi" /></div>
            <div className="space-y-1.5"><Label>Tồn kho</Label><Input type="number" value={form.stock} onChange={set('stock')} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Nguồn gốc</Label><Input value={form.origin} onChange={set('origin')} placeholder="Đà Lạt, Lâm Đồng..." /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Mô tả</Label><Textarea value={form.description} onChange={set('description')} rows={3} /></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Ảnh (URL)</Label>
              <Button type="button" size="sm" variant="ghost" onClick={addImg}><Plus size={14} /> Thêm ảnh</Button>
            </div>
            {(form.images || []).map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input value={img} onChange={(e) => setImg(i, e.target.value)} placeholder="https://..." />
                <button type="button" onClick={() => removeImg(i)} className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-destructive"><X size={16} /></button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-primary">
            <input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })} />
            Đánh dấu sản phẩm bán chạy
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 rounded-full bg-primary">{saving ? 'Đang lưu...' : 'Lưu'}</Button>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Hủy</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- ORDERS ---------- */
function OrdersTab({ orders, reload }) {
  const update = async (id, status) => { await base44.entities.Order.update(id, { status }); reload(); };
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl text-primary">Đơn hàng ({orders.length})</h2>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-emerald-900/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50/60 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Mã ĐH</th>
              <th className="px-4 py-3 font-medium">Khách</th>
              <th className="px-4 py-3 font-medium">Tổng</th>
              <th className="px-4 py-3 font-medium">Thanh toán</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-emerald-900/5">
                <td className="px-4 py-3 font-mono text-primary">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-primary">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                </td>
                <td className="px-4 py-3 font-mono text-primary">{o.total.toLocaleString('vi-VN')}₫</td>
                <td className="px-4 py-3 text-muted-foreground">{o.payment_method === 'cod' ? 'COD' : 'Thẻ'}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => update(o.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${ORDER_STATUS.find((s) => s.value === o.status)?.cls}`}
                  >
                    {ORDER_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- MESSAGES ---------- */
function MessagesTab({ messages, reload }) {
  const [reply, setReply] = useState({});
  const send = async (m) => {
    await base44.entities.ContactMessage.update(m.id, { status: 'handled', reply: reply[m.id] || '' });
    setReply({ ...reply, [m.id]: '' });
    reload();
  };
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl text-primary">Liên hệ & Feedback ({messages.length})</h2>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-5 ring-1 ring-emerald-900/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs ${m.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {m.status === 'new' ? 'Mới' : 'Đã xử lý'}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{m.content}</p>
            {m.reply && <div className="mt-3 rounded-xl bg-emerald-50/60 p-3 text-sm text-primary"><span className="text-xs text-muted-foreground">Phản hồi: </span>{m.reply}</div>}
            {m.status === 'new' && (
              <div className="mt-3 flex gap-2">
                <Input value={reply[m.id] || ''} onChange={(e) => setReply({ ...reply, [m.id]: e.target.value })} placeholder="Nhập phản hồi..." />
                <Button onClick={() => send(m)} className="shrink-0 rounded-full bg-primary"><Reply size={15} /></Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- REVIEWS ---------- */
function ReviewsTab({ reviews, products, reload }) {
  const name = (pid) => products.find((p) => p.id === pid)?.name || 'Sản phẩm';
  const toggle = async (r) => { await base44.entities.Review.update(r.id, { hidden: !r.hidden }); reload(); };
  const del = async (r) => { if (confirm('Xóa đánh giá này?')) { await base44.entities.Review.delete(r.id); reload(); } };
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl text-primary">Kiểm duyệt đánh giá ({reviews.length})</h2>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-emerald-900/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary">{name(r.product_id)}</div>
                <div className="text-xs text-muted-foreground">bởi {r.customer_name}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs ${r.hidden ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {r.hidden ? 'Đã ẩn' : 'Hiển thị'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toggle(r)} className="rounded-full">{r.hidden ? 'Hiện' : 'Ẩn'}</Button>
              <Button size="sm" variant="ghost" onClick={() => del(r)} className="rounded-full text-destructive hover:bg-red-50"><Trash2 size={14} /> Xóa</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}