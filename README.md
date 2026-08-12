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
- Başlık, açıklama, renk, author, thumbnail, image ve footer gibi alanları düzenleyebiliyorsun
- Birden fazla field ekleyebilir ve bunları `inline` olarak ayarlayabiliyorsun
- Hazırladığın embed'i JSON olarak görüntüleyip kopyalayabiliyorsun
- Hazırladığın embed için doğrudan `discord.js` kodu oluşturabiliyor
- Discord webhook URL'sini kontrol edebiliyor
- Oluşturduğun mesajı doğrudan Discord webhook'una gönderebiliyorsun
- Webhook kullanıcı adı ve avatarını özelleştirebiliyorsun
- Normal Discord mesaj içeriğini embed ile birlikte kullanabiliyorsun

### Kullanılan Teknolojiler

| Teknoloji | Ne için |
|---|---|
| React | Kullanıcı arayüzü |
| TypeScript | Tip güvenliği ve uygulama geliştirme |
| Vite | Geliştirme sunucusu ve build |
| Tailwind CSS | Arayüz tasarımı |
| Node.js | Sunucu tarafı işlemler |
| Express | Webhook sunucusu |
| CORS | İstek izinleri |
| tsx | TypeScript sunucusunu çalıştırmak |

### Proje Yapısı

```text
embed-studio/
│
├── public/
│   └── ...                  # Statik dosyalar
│
├── server/
│   └── index.ts             # Webhook sunucusu
│
├── src/
│   ├── components/
│   │   ├── Editor.tsx       # Embed düzenleme alanı
│   │   └── Preview.tsx      # Discord embed önizlemesi
│   │
│   ├── App.tsx              # Uygulamanın ana yapısı
│   └── ...
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
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

Frontend'i başlatmak için:

```bash
npm run dev
```

Webhook sunucusunu başlatmak için:

```bash
npm run server
```

Production build oluşturmak için:

```bash
npm run build
```

### Komutlar

`npm run dev` → Vite geliştirme sunucusunu başlatır

`npm run server` → Webhook sunucusunu başlatır

`npm run build` → Production build oluşturur

`npm run lint` → ESLint kontrolü yapar

`npm run preview` → Build'i önizler

### Durum

```text
STATUS
├── Frontend      ✓
├── Editor        ✓
├── Live Preview  ✓
├── JSON Export   ✓
├── discord.js    ✓
├── Webhook       ✓
└── Development   ── Active
```

## English

### What It Does

- Allows you to create Discord embeds through a visual editor
- Shows your changes in a real-time Discord-style preview
- Supports titles, descriptions, colors, authors, thumbnails, images and footers
- Allows adding multiple fields with `inline` support
- Generates and copies the complete JSON payload
- Generates ready-to-use `discord.js` code
- Validates Discord webhook URLs
- Sends the created message directly to a Discord webhook
- Allows customizing the webhook username and avatar
- Supports normal Discord message content together with embeds

### Technologies

| Technology | Used For |
|---|---|
| React | User interface |
| TypeScript | Type safety and application development |
| Vite | Development server and build |
| Tailwind CSS | Interface styling |
| Node.js | Server-side runtime |
| Express | Webhook server |
| CORS | Request handling |
| tsx | Running the TypeScript server |

### Project Structure

```text
embed-studio/
│
├── public/
│   └── ...                  # Static files
│
├── server/
│   └── index.ts             # Webhook server
│
├── src/
│   ├── components/
│   │   ├── Editor.tsx       # Embed editor
│   │   └── Preview.tsx      # Discord embed preview
│   │
│   ├── App.tsx              # Main application
│   └── ...
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
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

Start the frontend:

```bash
npm run dev
```

Start the Webhook Server:

```bash
npm run server
```

Create a production build:

```bash
npm run build
```

### Scripts

`npm run dev` → Start Vite development server

`npm run server` → Start webhook server

`npm run build` → Create production build

`npm run lint` → Run ESLint

`npm run preview` → Preview production build

### Status

```text
STATUS
├── Frontend      ✓
├── Editor        ✓
├── Live Preview  ✓
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
