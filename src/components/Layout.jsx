import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf, Search, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NAV = [
  { to: '/', label: 'Trang chủ' },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/contact', label: 'Liên hệ' },
  { to: '/policies', label: 'Chính sách' },
];

export default function Layout() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const admin = isAdmin(user);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="glass sticky top-0 z-50 border-b border-emerald-900/10 bg-white/75">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white">
              <Leaf size={18} />
            </span>
            <span className="font-display text-2xl leading-none text-primary">Rau Nhà Phố</span>
          </Link>

          <form onSubmit={search} className="hidden flex-1 items-center gap-2 md:flex md:max-w-sm">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm rau củ quả..."
                className="rounded-full border-emerald-900/10 bg-emerald-50/50 pl-9"
              />
            </div>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3 py-2 text-sm text-primary/80 transition-colors hover:bg-emerald-50 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            {admin && (
              <Link to="/admin/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-primary">Quản trị</Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-primary">
                <ShoppingCart size={20} />
              </Button>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/account">
                <Button variant="ghost" size="icon" className="text-primary">
                  <User size={20} />
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-emerald-50">
                  Đăng nhập
                </Button>
              </Link>
            )}
            <button
              className="grid h-10 w-10 place-items-center rounded-full text-primary lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-emerald-900/10 bg-white px-4 py-4 lg:hidden">
            <form onSubmit={search} className="mb-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm..." className="rounded-full pl-9" />
              </div>
            </form>
            <div className="flex flex-col">
              {NAV.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base text-primary hover:bg-emerald-50">
                  {l.label}
                </Link>
              ))}
              {admin && (
                <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base text-primary hover:bg-emerald-50">
                  Quản trị
                </Link>
              )}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base text-primary hover:bg-emerald-50">
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-emerald-900/10 bg-emerald-50/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><Leaf size={18} /></span>
              <span className="font-display text-2xl text-primary">Rau Nhà Phố</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Rau củ quả tươi sạch từ nông trại đến bếp nhà bạn. Giao nhanh trong 2 giờ.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary">Khám phá</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary">Tất cả sản phẩm</Link></li>
              <li><Link to="/products?sale=1" className="hover:text-primary">Khuyến mại</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/policies#van-chuyen" className="hover:text-primary">Vận chuyển</Link></li>
              <li><Link to="/policies#doi-tra" className="hover:text-primary">Đổi trả</Link></li>
              <li><Link to="/policies#bao-hanh" className="hover:text-primary">Bảo hành chất lượng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Đường Đoàn Nguyễn Tuấn, Xã Quy Đức, Huyện Bình Chánh, TP. Hồ Chí Minh</li>
              <li>1900 1234 (8h–20h)</li>
              <li>hello@raunhapho.vn</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-900/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <span>© {new Date().getFullYear()} Rau Nhà Phố. Tươi từng lá.</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5"><Truck size={14} /> Giao 2h nội thành</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Cam kết tươi sạch</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}