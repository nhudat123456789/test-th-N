import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/40 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-destructive">
          <ShieldX size={32} />
        </div>
        <h1 className="font-display text-4xl text-primary">403</h1>
        <p className="mt-2 text-muted-foreground">
          Bạn không có quyền truy cập trang quản trị.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button className="rounded-full bg-primary">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
