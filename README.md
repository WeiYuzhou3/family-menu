# 🍳 Family Menu — 家庭私厨

一款温暖的家庭菜单 Web 应用。录入菜品（图片 + 食材 + 做法），老婆按「日期 + 餐次」预约点单，老公在厨房看板查看订单并按菜谱做菜。

---

## ✨ 功能概览

### 老婆端
- 📅 **周菜单预约** — 选择日期（今天 ~ 周日）+ 餐次（早/中/晚餐），按需点菜
- 🛒 **购物车** — 支持多菜品、多数量、特殊备注
- 📋 **订单管理** — 按日期和餐次查看进行中 & 已完成订单

### 老公端
- 🧑‍🍳 **厨房看板** — 按日期切换，早中晚三餐订单分组展示
- 📖 **订单详情** — 查看菜品清单、特殊需求、状态流转
- ⚙️ **菜品管理** — 新增/编辑/删除菜品，图片上传，食材编辑器

### 通用
- 🔐 **角色登录** — 老婆/老公各自密码进入对应界面
- 📱 **PWA 支持** — 可安装到手机主屏幕，接近原生 App 体验
- 🎨 **原木小清新 UI** — 暖白 + 鼠尾草绿 + 木色调

---

## 🏗️ 技术架构

```
family-menu/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── login/              # 登录页
│   │   ├── (wife)/             # 老婆端路由组
│   │   │   ├── menu/           # 菜单浏览 + 菜品详情
│   │   │   └── orders/         # 购物车 + 订单列表
│   │   ├── (husband)/          # 老公端路由组
│   │   │   ├── kitchen/        # 厨房看板 + 订单详情
│   │   │   └── admin/          # 菜品管理 CRUD
│   │   ├── api/upload/         # 图片上传 API
│   │   └── manifest.ts + sw.ts # PWA 配置
│   ├── components/
│   │   ├── ui/                 # 通用 UI 组件库
│   │   ├── DateMealSelector    # 日期餐次选择器
│   │   ├── DishForm            # 菜品表单
│   │   ├── ImageUpload         # 图片上传组件
│   │   └── IngredientsEditor   # 食材编辑器
│   ├── contexts/               # React Context (购物车、认证)
│   └── lib/
│       ├── auth/               # iron-session 会话管理
│       ├── db/                 # 数据库查询层 (dishes, orders, passwords)
│       └── supabase/           # Supabase 客户端 + 类型定义
├── scripts/
│   ├── schema.sql              # 数据库建表 SQL
│   └── seed-passwords.ts       # 密码初始化脚本
└── public/
    ├── icons/                  # PWA 图标
    └── offline.html            # 离线页面
```

### 技术栈

| 层级 | 技术 | 版本 |
|---|---|---|
| 框架 | Next.js (App Router) | 16.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.x |
| 数据库 | Supabase (PostgreSQL) | - |
| 图片存储 | Supabase Storage | - |
| 认证 | iron-session + bcryptjs | 8.x / 3.x |
| PWA | Serwist | 9.x |
| 图标 | Lucide React | - |

---

## 🚀 本地开发

### 前置条件

- Node.js 18+ 
- Supabase 账号（免费）

### 1. 克隆项目

```bash
git clone https://github.com/Weiyuzhou3/family-menu.git
cd family-menu
npm install
```

### 2. 配置 Supabase

1. 前往 [supabase.com](https://supabase.com) 注册并创建项目
2. 在 Supabase SQL Editor 中执行 `scripts/schema.sql` 创建数据表
3. 在 Supabase Storage 中创建名为 `dish-images` 的**公开**存储桶
4. 在 Supabase Settings → API 中获取：
   - Project URL
   - `anon` public key
   - `service_role` key（保密）

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
COOKIE_SECRET=一个至少32位的随机字符串
```

生成随机 `COOKIE_SECRET`：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. 初始化密码

```bash
npx tsx scripts/seed-passwords.ts
```

按提示设置老婆和老公的登录密码。

### 5. 启动开发服务器

```bash
npm run dev -- --webpack
```

打开 `http://localhost:3000`，选择角色并输入密码即可使用。

### 6. 手机访问（同一 WiFi）

手机浏览器打开 `http://你的电脑IP:3000`，例如 `http://192.168.1.15:3000`。

---

## 📦 生产部署

### 方式一：Vercel（国外访问）

1. 将项目推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 添加相同的环境变量（4 个）
4. 部署完成后获得 `*.vercel.app` 域名
5. 手机浏览器打开即可，可添加到主屏幕

> ⚠️ Vercel 默认域名国内访问可能不稳定，需自行绑定国内 CDN 域名。

### 方式二：国内云服务器

1. 购买一台轻量云服务器（腾讯云/阿里云，2C4G 即可，~68元/月）
2. 安装 Node.js 18+：

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. 克隆项目并安装依赖：

```bash
git clone https://github.com/Weiyuzhou3/family-menu.git
cd family-menu
npm install
```

4. 创建 `.env.production` 配置环境变量（同上）

5. 构建并启动：

```bash
npm run build
npm start
```

6. 配置 Nginx 反向代理 + SSL 证书（推荐用 certbot + Let's Encrypt）

7. 使用 PM2 保持进程运行：

```bash
npm install -g pm2
pm2 start npm --name "family-menu" -- start
pm2 save
pm2 startup
```

### 方式三：Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t family-menu .
docker run -d -p 3000:3000 --env-file .env.production family-menu
```

---

## 📊 数据库表结构

| 表名 | 说明 | 关键字段 |
|---|---|---|
| `dishes` | 菜品 | name, category, image_url, ingredients(JSONB), instructions |
| `orders` | 订单 | status, notes, **meal_date**, **meal_time** |
| `order_items` | 订单明细 | order_id, dish_id, quantity, special_requests |
| `app_passwords` | 登录密码 | role(wife/husband), password_hash(bcrypt) |

### 订单状态流转

```
pending (待接单) → preparing (制作中) → completed (已完成)
                                          ↘ cancelled (已取消)
```

### 餐次类型

| 值 | 显示 |
|---|---|
| `breakfast` | 🌅 早餐 |
| `lunch` | ☀️ 午餐 |
| `dinner` | 🌙 晚餐 |

---

## 🔧 修改密码

```bash
npx tsx scripts/seed-passwords.ts
```

或者在 Supabase 的 `app_passwords` 表中手动更新，密码需要用 bcrypt 加密。

---

## 🎨 自定义主题

编辑 `src/app/globals.css` 中的 CSS 变量：

```css
:root {
  --bg-base: #faf7f2;        /* 页面底色 */
  --accent: #7c9a6e;         /* 主题色 */
  --wood: #c4a882;           /* 木色调 */
  --text-primary: #3d3226;   /* 主文字色 */
  /* ... */
}
```

---

## 📱 PWA 配置

- 图标文件：`public/icons/`（192px + 512px PNG）
- Manifest：`src/app/manifest.ts`
- Service Worker：`src/app/sw.ts`

安装到手机主屏幕后，会以全屏模式打开，带启动画面。

---

## 🛠️ 常用命令

```bash
npm run dev          # 开发模式（需要 --webpack 参数）
npm run build        # 生产构建
npm start            # 生产运行
npx tsx scripts/seed-passwords.ts  # 重置密码
```
