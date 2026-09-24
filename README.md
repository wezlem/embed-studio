# Embed Studio

<p align="center">

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

</p>

<p align="center">
  A modern Discord Embed Builder for creating, customizing and previewing embeds.
</p>

---

## Türkçe

### Ne Yapıyor

- Embed'leri görsel bir editör üzerinden oluşturmanı sağlıyor
- Yaptığın değişiklikleri gerçek zamanlı olarak Discord görünümünde gösteriyor
- Markdown etiketlerini (#, *, _, ~, code block vb.) ve Discord mention etiketlerini destekliyor
- Başlık, açıklama, renk, author, thumbnail, image ve footer gibi alanları düzenleyebiliyorsun
- Birden fazla field ekleyebilir ve bunları `inline` olarak ayarlayabiliyorsun
- Discord Link Butonları (URL Components) ekleyebiliyorsun
- Hazırladığın embed'i JSON olarak görüntüleyip kopyalayabiliyorsun
- Hazırladığın embed ve butonlar için doğrudan `discord.js` kodu oluşturabiliyor
- Discord webhook URL'sini kontrol edebiliyor ve doğrudan Discord'a mesaj gönderebiliyor
- Webhook kullanıcı adı ve avatarını özelleştirebiliyorsun
- Production ortamında tek port üzerinden (Express + Vite build) çalışabiliyor

### Kullanılan Teknolojiler

| Teknoloji | Ne için |
|---|---|
| React | Kullanıcı arayüzü |
| TypeScript | Tip güvenliği ve uygulama geliştirme |
| Vite | Geliştirme sunucusu ve build |
| Tailwind CSS | Arayüz tasarımı |
| Node.js | Sunucu tarafı işlemler |
| Express | Webhook sunucusu ve static hosting |
| CORS | İstek izinleri |
| tsx | TypeScript sunucusunu çalıştırmak |

### Proje Yapısı

```text
embed-studio/
│
├── public/
│   └── logo.png             # Statik dosyalar ve favicon
│
├── server/
│   └── index.ts             # Webhook ve sunucu yapısı
│
├── src/
│   ├── assets/              # Logo ve görsel dosyalar
│   ├── components/
│   │   ├── ButtonPanel.tsx  # Discord butonları yönetim paneli
│   │   ├── Editor.tsx       # Embed düzenleme alanı
│   │   ├── Preview.tsx      # Discord embed önizlemesi
│   │   ├── TagPanel.tsx     # Mention ve etiket paneli
│   │   └── renderMarkdown.tsx # Markdown formatlayıcı
│   │
│   ├── App.tsx              # Uygulamanın ana yapısı
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Kurulum

```bash
git clone https://github.com/wezlem/embed-studio.git
cd embed-studio
npm install
```

Geliştirme ortamında çalıştırmak için:

```bash
# Terminal 1 - Backend
npm run start

# Terminal 2 - Frontend
npm run dev
```

Production ortamında tek porttan çalıştırmak için:

```bash
npm run build
npm start
```

### Komutlar

`npm run dev` → Vite geliştirme sunucusunu başlatır

`npm run start` → Express sunucusunu ve derlenmiş arayüzü başlatır

`npm run build` → Production build oluşturur

`npm run lint` → ESLint kontrolü yapar

`npm run preview` → Build'i önizler

### Durum

```text
STATUS
├── Frontend      ✓
├── Editor        ✓
├── Live Preview  ✓
├── Markdown      ✓
├── Link Buttons  ✓
├── JSON Export   ✓
├── discord.js    ✓
├── Webhook       ✓
└── Development   ── Active
```

---

## English

### What It Does

- Allows you to create Discord embeds through a visual editor
- Shows your changes in a real-time Discord-style preview
- Supports full Discord markdown formatting and mention tags
- Supports titles, descriptions, colors, authors, thumbnails, images and footers
- Allows adding multiple fields with `inline` support
- Supports Discord Link Buttons (URL Components)
- Generates and copies the complete JSON payload
- Generates ready-to-use `discord.js` code with buttons included
- Validates Discord webhook URLs and sends messages directly
- Allows customizing the webhook username and avatar
- Runs on a single unified port in production (Express + Vite build)

### Technologies

| Technology | Used For |
|---|---|
| React | User interface |
| TypeScript | Type safety and application development |
| Vite | Development server and build |
| Tailwind CSS | Interface styling |
| Node.js | Server-side runtime |
| Express | Webhook server and static hosting |
| CORS | Request handling |
| tsx | Running the TypeScript server |

### Project Structure

```text
embed-studio/
│
├── public/
│   └── logo.png             # Static files and favicon
│
├── server/
│   └── index.ts             # Webhook and server backend
│
├── src/
│   ├── assets/              # Logos and assets
│   ├── components/
│   │   ├── ButtonPanel.tsx  # Discord link buttons editor
│   │   ├── Editor.tsx       # Embed editor
│   │   ├── Preview.tsx      # Discord embed preview
│   │   ├── TagPanel.tsx     # Mention tags panel
│   │   └── renderMarkdown.tsx # Markdown renderer
│   │
│   ├── App.tsx              # Main application
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Installation

```bash
git clone https://github.com/wezlem/embed-studio.git
cd embed-studio
npm install
```

Start in development mode:

```bash
# Terminal 1 - Backend
npm run start

# Terminal 2 - Frontend
npm run dev
```

Run in production mode (single port):

```bash
npm run build
npm start
```

### Scripts

`npm run dev` → Start Vite development server

`npm run start` → Start Express server & serve static app

`npm run build` → Create production build

`npm run lint` → Run ESLint

`npm run preview` → Preview production build

### Status

```text
STATUS
├── Frontend      ✓
├── Editor        ✓
├── Live Preview  ✓
├── Markdown      ✓
├── Link Buttons  ✓
├── JSON Export   ✓
├── discord.js    ✓
├── Webhook       ✓
└── Development   ── Active
```

<p align="center">─────────────────────────────────────────</p>

<p align="center">
  <a href="https://github.com/wezlem/embed-studio">Repository</a> ·
  <a href="https://github.com/wezlem/embed-studio/issues">Issues</a>
</p>

<p align="center">
  <sub>Built by <a href="https://github.com/wezlem">wezlem</a></sub>
</p>
