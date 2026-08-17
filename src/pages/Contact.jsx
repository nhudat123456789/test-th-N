import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.ContactMessage.create({
        name: form.name,
        email: form.email,
        content: form.content,
        status: 'new',
      });
      setSent(true);
      setForm({ name: '', email: '', content: '' });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <section className="border-b border-emerald-900/10 bg-emerald-50/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Liên hệ</p>
          <h1 className="mt-1 font-display text-5xl text-primary">Kết nối với vườn</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Mọi câu hỏi, góp ý hay hợp tác — chúng tôi luôn sẵn sàng lắng nghe bạn.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        {/* FORM */}
        <div>
          <h2 className="mb-6 font-display text-3xl text-primary">Gửi lời nhắn</h2>
          {sent ? (
            <div className="rounded-2xl border border-accent/30 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-accent" size={40} />
              <p className="font-display text-2xl text-primary">Cảm ơn bạn!</p>
              <p className="mt-1 text-sm text-muted-foreground">Tin nhắn đã được gửi. Chúng tôi sẽ phản hồi trong vòng 24h.</p>
              <Button onClick={() => setSent(false)} variant="outline" className="mt-5 rounded-full">Gửi tin khác</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Họ tên *</Label>
                <Input id="name" required value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={set('email')} placeholder="ban@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea id="content" required value={form.content} onChange={set('content')} rows={5} placeholder="Nội dung liên hệ hoặc góp ý..." />
              </div>
              <Button type="submit" disabled={loading} className="rounded-full bg-primary px-8">
                {loading ? 'Đang gửi...' : <>Gửi lời nhắn <Send size={16} className="ml-2" /></>}
              </Button>
            </form>
          )}
        </div>

        {/* INFO + MAP */}
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-5">
              <MapPin className="mb-2 text-accent" size={20} />
              <div className="text-sm font-semibold text-primary">Cửa hàng</div>
              <div className="mt-1 text-sm text-muted-foreground">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM</div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-5">
              <Phone className="mb-2 text-accent" size={20} />
              <div className="text-sm font-semibold text-primary">Điện thoại</div>
              <div className="mt-1 text-sm text-muted-foreground">1900 1234<br />8:00 – 20:00 mỗi ngày</div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 sm:col-span-2">
              <Mail className="mb-2 text-accent" size={20} />
              <div className="text-sm font-semibold text-primary">Email</div>
              <div className="mt-1 text-sm text-muted-foreground">hello@raunhapho.vn</div>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-900/10">
            <iframe
              title="Bản đồ Rau Nhà Phố"
              src="https://www.google.com/maps?q=Nguyen+Hue+Street+Ho+Chi+Minh+City&output=embed"
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}