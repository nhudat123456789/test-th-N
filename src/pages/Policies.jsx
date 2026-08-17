import React from 'react';

const SECTIONS = [
  {
    id: 'van-chuyen',
    title: 'Chính sách vận chuyển',
    body: [
      'Rau Nhà Phố giao hàng tươi sạch tận cửa cho khách hàng tại khu vực nội thành TP.HCM.',
      'Thời gian giao hàng dự kiến: trong vòng 2 giờ kể từ khi xác nhận đơn đối với khu vực nội thành, và trong ngày đối với các quận xa hơn.',
      'Phí vận chuyển: Miễn phí cho đơn hàng từ 150.000₫. Đơn dưới mức này phụ phí 20.000₫.',
      'Khách hàng sẽ nhận được thông báo về thời gian giao cụ thể qua số điện thoại đã đăng ký.',
    ],
  },
  {
    id: 'doi-tra',
    title: 'Chính sách đổi trả',
    body: [
      'Chúng tôi cam kết chất lượng tươi sạch cho mọi sản phẩm. Nếu sản phẩm đến tay bạn bị dập nát, héo úa hoặc không đúng mô tả, xin vui lòng liên hệ trong vòng 24 giờ kể từ khi nhận hàng.',
      'Điều kiện đổi trả: Sản phẩm còn nguyên trạng thái nhận được, kèm hình ảnh/video minh chứng gửi về hello@raunhapho.vn hoặc hotline 1900 1234.',
      'Hình thức xử lý: Đổi sản phẩm mới tương đương hoặc hoàn tiền 100% giá trị sản phẩm theo lựa chọn của khách.',
      'Rau Nhà Phố sẽ thu hồi sản phẩm lỗi tại nhà khách mà không phát sinh thêm phí.',
    ],
  },
  {
    id: 'bao-hanh',
    title: 'Bảo hành chất lượng',
    body: [
      'Mọi sản phẩm đều được chọn lọc kỹ càng và đóng gói đạt chuẩn tươi sạch trước khi giao.',
      'Chúng tôi truy xuất nguồn gốc rõ ràng từ nông trại đến cửa hàng, đảm bảo không sử dụng hóa chất bảo quản độc hại.',
      'Nếu phát hiện vấn đề về chất lượng sau khi sử dụng, khách hàng có thể phản hồi để được hỗ trợ và bồi thường theo quy định.',
      'Đội ngũ chăm sóc khách hàng sẵn sàng tiếp nhận mọi phản ánh và xử lý trong vòng 24 giờ làm việc.',
    ],
  },
  {
    id: 'thanh-toan',
    title: 'Phương thức thanh toán',
    body: [
      'Thanh toán khi nhận hàng (COD): Trả tiền mặt cho shipper khi nhận sản phẩm.',
      'Thanh toán online qua thẻ tín dụng/ghi nợ (Stripe): Giao dịch được mã hóa và bảo mật theo chuẩn quốc tế.',
      'Tất cả giá niêm yết trên website đã bao gồm thuế GTGT.',
    ],
  },
];

export default function Policies() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">Chính sách</p>
      <h1 className="mt-1 font-display text-5xl text-primary">Chính sách cửa hàng</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Cam kết tươi sạch và minh bạch trong từng giao dịch — từ nông trại đến bếp nhà bạn.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="rounded-2xl border border-emerald-900/10 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mục lục</p>
            <ul className="space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block rounded-xl px-3 py-2 text-sm text-primary hover:bg-emerald-50">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* CONTENT */}
        <div className="space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-3xl text-primary">{s.title}</h2>
              <div className="mt-4 space-y-3">
                {s.body.map((p, i) => (
                  <p key={i} className="leading-relaxed text-muted-foreground">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}