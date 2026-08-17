# Base44 Project — Rau Nhà Phố

Repository này dùng để chạy, chỉnh sửa và phát triển ứng dụng **Rau Nhà Phố** trên máy local.
Các thay đổi được push lên GitHub có thể được đồng bộ lại với Base44 Builder.

---

# 1. Yêu cầu trước khi cài

Máy cần có:

* Node.js
* npm
* Git
* Base44 CLI

Kiểm tra Node.js và npm:

```bash
node -v
npm -v
```

Cài Base44 CLI:

```bash
npm install -g base44@latest
```

Kiểm tra:

```bash
base44 --version
```

---

# 2. Clone project từ GitHub

Clone repository:

```bash
git clone <PROJECT_GIT_URL>
```

Đi vào thư mục project:

```bash
cd <PROJECT_FOLDER>
```

Ví dụ trên Windows:

```cmd
cd /d "D:\tiếng anh\testttt-main\testttt-main"
```

---

# 3. Cài dependencies

Sau khi clone project trên máy mới, chạy:

```bash
npm install
```

Không copy thư mục `node_modules` từ máy cũ.

---

# 4. Đăng nhập Base44 trên máy mới

Chạy:

```bash
base44 login
```

CLI sẽ hiển thị một mã xác thực.

Trình duyệt sẽ mở trang Base44 yêu cầu:

```text
Authorize Device
```

Nhập mã được hiển thị trong terminal.

Lưu ý: mã này xuất hiện trong terminal, không phải gửi qua email.

---

# 5. Link project với Base44 App

Kiểm tra project đã được link chưa:

```bash
base44 link
```

Nếu hiện:

```text
Project is already linked.
An .app.jsonc file with the appId already exists.
```

thì project đã được link và không cần làm thêm.

Project Rau Nhà Phố sử dụng App ID:

```text
6a744c90a68d158dc5771806
```

Có thể kiểm tra bằng:

```cmd
type base44\.app.jsonc
```

Nội dung dự kiến:

```json
{
  "id": "6a744c90a68d158dc5771806"
}
```

File này thường không được commit lên Git và có thể phải được Base44 CLI tạo lại trên máy mới.

---

# 6. Tạo `.env.local`

File `.env.local` thường không được push lên Git.

Sau khi clone project trên máy mới, phải tự tạo file:

```text
.env.local
```

tại thư mục gốc của project, cùng cấp với:

```text
package.json
src/
base44/
```

Nội dung cần dùng cho Rau Nhà Phố:

```env
# Base44 frontend configuration

VITE_BASE44_APP_ID=6a744c90a68d158dc5771806
VITE_BASE44_APP_BASE_URL=https://fresh-home-harvest.base44.app
```

Không dùng:

```env
VITE_APP_ID=your_app_id_here
```

Project này sử dụng:

```env
VITE_BASE44_APP_ID
VITE_BASE44_APP_BASE_URL
```

---

# 7. Không commit `.env.local`

Kiểm tra file:

```text
.gitignore
```

Nên có:

```gitignore
.env
.env.local
.env.*.local
```

Không push `.env.local` nếu file có cấu hình riêng của máy hoặc thông tin nhạy cảm.

---

# 8. Backend Secrets

Backend secrets không nên lưu trực tiếp trong Git.

Project có thể sử dụng:

```text
ADMIN_SETUP_KEY
ADMIN_EMAIL
ADMIN_PASSWORD
```

Kiểm tra secrets hiện có:

```bash
base44 secrets list
```

Nếu cần tạo:

```bash
base44 secrets set ADMIN_SETUP_KEY=<setup_key> ADMIN_EMAIL=<admin_email> ADMIN_PASSWORD=<admin_password>
```

Ví dụ:

```bash
base44 secrets set ADMIN_SETUP_KEY=my-secret-key ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=my-password
```

Không ghi mật khẩu thật vào README hoặc commit lên Git.

Nếu tài khoản admin đã tồn tại trong Base44 Dashboard thì thông thường không cần chạy `seedAdmin`.

---

# 9. Chạy frontend với backend thật của Base44

Đây là cách khuyên dùng khi chỉ cần:

* sửa giao diện
* test chức năng
* sử dụng dữ liệu sản phẩm thật
* sử dụng tài khoản thật
* sử dụng hình ảnh hiện có trên Base44

Chạy:

```bash
npm run dev hoac base44 dev
```

Vite sẽ hiển thị URL kiểu:

```text
http://localhost:5173
```

hoặc:

```text
http://localhost:5174
```

Nếu port `5173` đang được sử dụng, Vite sẽ tự chuyển sang port khác.

Luôn mở đúng URL được terminal hiển thị.

---

# 10. Cấu hình Base44 Client

File:

```text
src/api/base44Client.js
```

nên giữ dạng:

```js
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Create Base44 client
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});
```

Không đổi:

```js
serverUrl: ''
```

thành:

```js
serverUrl: 'http://localhost:4400'
```

nếu mục tiêu là chạy frontend local nhưng sử dụng backend/data thật trên Base44.

---

# 11. Chạy full Base44 local development

Nếu thực sự cần test backend functions local, có thể dùng:

```bash
base44 dev
```

Lệnh này có thể chạy:

* Base44 local backend
* frontend Vite
* API proxy

Ví dụ:

```text
Proxy enabled: /api -> http://localhost:4400
```

Backend local thường chạy tại:

```text
http://localhost:4400
```

Frontend có thể chạy tại:

```text
http://localhost:5173
```

hoặc port khác.

Lưu ý:

Backend local và hosted backend không hoàn toàn giống nhau.

Nếu chạy `base44 dev`, có thể gặp:

```text
401 Unauthorized
```

hoặc dữ liệu local trống nếu auth/data đang sử dụng môi trường local.

Vì vậy, nếu chỉ muốn chỉnh frontend với dữ liệu thật, ưu tiên:

```bash
npm run dev
```

---

# 12. Nếu web local báo 404 khi đăng nhập

Nếu chạy:

```bash
npm run dev
```

mà đăng nhập báo:

```text
Request failed with status code 404
```

hãy kiểm tra `.env.local`.

Nó phải có:

```env
VITE_BASE44_APP_ID=6a744c90a68d158dc5771806
VITE_BASE44_APP_BASE_URL=https://fresh-home-harvest.base44.app
```

Sau khi sửa `.env.local`, phải restart Vite:

```bash
Ctrl + C
npm run dev
```

Vite chỉ đọc biến môi trường khi server khởi động.

---

# 13. Nếu web báo 401 Unauthorized

Nếu Console hiện:

```text
401 Unauthorized
```

ở request kiểu:

```text
/entities/User/me
```

hãy kiểm tra:

1. Có đang chạy nhầm `base44 dev` thay vì `npm run dev` không.
2. `.env.local` có đúng App ID không.
3. `VITE_BASE44_APP_BASE_URL` có đúng domain không.
4. `src/api/base44Client.js` có còn `serverUrl: ''` không.
5. Restart server sau khi thay đổi `.env.local`.

---

# 14. Nếu mất toàn bộ sản phẩm hoặc hình ảnh

Nếu trang hiện:

```text
0 sản phẩm
```

hoặc:

```text
Không tìm thấy sản phẩm
```

thì chưa chắc là lỗi ảnh.

Kiểm tra Console bằng:

```text
F12 → Console
```

Nếu có:

```text
401 Unauthorized
```

thì app chưa lấy được dữ liệu từ Base44.

Nếu dùng đúng hosted backend:

```bash
npm run dev
```

và `.env.local` đúng thì sản phẩm và hình ảnh từ Base44 sẽ được tải lại.

Không upload lại toàn bộ hình ảnh trước khi kiểm tra auth/API.

---

# 15. Domain của project

Hosted Base44 URL:

```text
https://fresh-home-harvest.base44.app
```

App ID:

```text
6a744c90a68d158dc5771806
```

---

# 16. Admin account

Project đã có tài khoản Owner/Admin trên Base44 Dashboard.

Có thể kiểm tra tại:

```text
Dashboard → Users
```

Nếu tài khoản đã có:

```text
Role: admin
Owner
```

thì không cần tạo admin mới bằng `seedAdmin`.

Nếu quên mật khẩu, sử dụng chức năng:

```text
Forgot password
```

trên trang đăng nhập.

---

# 17. Backend Functions

Project hiện có các backend functions như:

```text
base44/functions/
├── ensureCustomerRole/
├── placeOrder/
└── seedAdmin/
```

Có thể kiểm tra:

```cmd
dir base44\functions
```

Ví dụ function:

```text
base44/functions/seedAdmin/entry.ts
```

Không nên chạy `seedAdmin` nếu admin đã tồn tại.

---

# 18. Kiểm tra secrets

Chạy:

```bash
base44 secrets list
```

Ví dụ kết quả:

```text
ADMIN_PASSWORD
ADMIN_EMAIL
ADMIN_SETUP_KEY
```

Base44 chỉ hiển thị tên secret, không cần lưu giá trị vào Git.

---

# 19. Quy trình chuẩn khi đổi sang máy mới

Sau khi clone repo trên máy mới:

```bash
git clone <PROJECT_GIT_URL>
cd <PROJECT_FOLDER>

npm install

npm install -g base44@latest

base44 login

base44 link
```

Sau đó tạo:

```text
.env.local
```

với:

```env
VITE_BASE44_APP_ID=6a744c90a68d158dc5771806
VITE_BASE44_APP_BASE_URL=https://fresh-home-harvest.base44.app
```

Sau đó chạy:

```bash
npm run dev
```

Đây là quy trình nhanh nhất để đưa project Rau Nhà Phố chạy lại trên một máy mới.

---

# 20. Quy trình làm việc hằng ngày

Mỗi lần muốn mở project:

```cmd
cd /d "D:\tiếng anh\testttt-main\testttt-main"
npm run dev
```

Sau đó mở URL Vite hiển thị.

Ví dụ:

```text
http://localhost:5173
```

---

# 21. Push code lên GitHub

Kiểm tra thay đổi:

```bash
git status
```

Thêm file:

```bash
git add .
```

Commit:

```bash
git commit -m "Update project"
```

Push:

```bash
git push
```

Không push các file chứa secret.

Trước khi push nên chạy:

```bash
git status
```

và kiểm tra `.env.local` không xuất hiện trong danh sách file được commit.

---

# 22. Pull code trên máy khác

Nếu project đã clone sẵn:

```bash
git pull
npm install
npm run dev
```

Không cần chạy `npm install` mỗi lần nếu `package.json` không thay đổi, nhưng chạy lại không gây vấn đề.

Nếu `.env.local` chưa có trên máy đó thì phải tạo lại thủ công.

---

# 23. Các file không nên phụ thuộc vào Git

Các file/cấu hình sau có thể không đi cùng repo:

```text
.env.local
base44/.app.jsonc
Base44 login session
local browser authentication
node_modules/
```

Do đó khi đổi máy cần setup lại.

---

# 24. Các file nên được commit

Thông thường nên commit:

```text
src/
public/
base44/functions/
base44/entities/
base44/config.jsonc
package.json
package-lock.json
README.md
.gitignore
```

---

# 25. Kiểm tra project sau khi setup

Sau khi setup máy mới, kiểm tra:

```text
[ ] npm install hoàn tất
[ ] base44 CLI đã cài
[ ] base44 login thành công
[ ] project đã link đúng App ID
[ ] .env.local đã được tạo
[ ] VITE_BASE44_APP_ID đúng
[ ] VITE_BASE44_APP_BASE_URL đúng
[ ] npm run dev chạy thành công
[ ] login admin được
[ ] sản phẩm hiển thị
[ ] hình ảnh hiển thị
[ ] giỏ hàng hoạt động
[ ] trang admin hoạt động
```

---

# 26. Thông tin project

**Project:** Rau Nhà Phố

**Base44 App ID:**

```text
6a744c90a68d158dc5771806
```

**Hosted URL:**

```text
https://fresh-home-harvest.base44.app
```

**Local frontend command:**

```bash
npm run dev
```

**Full local Base44 command:**

```bash
base44 dev
```

---

# Quick Setup — Máy mới

Nếu đã quen với project và chỉ cần các lệnh chính:

```bash
git clone <PROJECT_GIT_URL>

cd <PROJECT_FOLDER>

npm install

npm install -g base44@latest

base44 login

base44 link
```

Tạo `.env.local`:

```env
VITE_BASE44_APP_ID=6a744c90a68d158dc5771806
VITE_BASE44_APP_BASE_URL=https://fresh-home-harvest.base44.app
```

Chạy:

```bash
npm run dev
```

Mở URL mà Vite hiển thị và đăng nhập.

Nếu sản phẩm, hình ảnh và tài khoản load bình thường thì setup hoàn tất.
