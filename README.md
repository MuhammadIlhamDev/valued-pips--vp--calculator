# Valued Pips (VP) Calculator

Aplikasi web berbasis Angular yang dirancang untuk menghitung potensi perolehan TF Point dan penebusannya berdasarkan trading pips pada berbagai pasangan mata uang.

## Fitur Utama

- **Kalkulasi Valued Pips (VP)**: Menghitung VP berdasarkan pips yang diperoleh dari berbagai pasangan mata uang
- **Sistem Level**: Mendukung berbagai level trader dari Rookie hingga Legend dengan pengali poin yang berbeda
- **Program Kemitraan**: Mendukung tiga tier kemitraan (Basic, Prospect, Priority) dengan persentase penebusan yang berbeda
- **Simulasi Penebusan Poin**: Menghitung nilai tunai dari poin yang dapat ditukar
- **Antarmuka Responsif**: Desain yang ramah pengguna dengan tampilan yang menarik

## Cara Menggunakan

1. **Pilih Level Trader**: Pilih level trader Anda dari dropdown yang tersedia
2. **Pilih Tier Kemitraan** (jika tersedia): Pilih tier kemitraan yang sesuai
3. **Input Pips**: Masukkan jumlah pips untuk setiap pasangan mata uang yang Anda tradingkan
4. **Hitung**: Klik tombol "Calculate" untuk menghitung VP dan TF Point
5. **Tukar Poin** (jika memenuhi syarat): Masukkan jumlah poin yang ingin ditukar untuk melihat nilai tunainya

## Persyaratan Sistem

- Node.js (versi terbaru)
- Angular CLI

## Instalasi dan Menjalankan Aplikasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/valued-pips-vp-calculator.git
   ```

2. Navigasi ke direktori proyek:
   ```bash
   cd valued-pips-vp-calculator
   ```

3. Install dependensi:
   ```bash
   npm install
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

5. Buka browser dan akses `http://localhost:4200`

## Build untuk Produksi

Untuk membuat build produksi, jalankan perintah:
```bash
npm run build
```

## Struktur Proyek

```
valued-pips-(vp)-calculator/
├── src/
│   ├── app.component.html       # Template HTML komponen utama
│   └── app.component.ts         # Logika komponen utama
├── angular.json                 # Konfigurasi Angular
├── package.json                 # Dependensi dan skrip proyek
├── tsconfig.json                # Konfigurasi TypeScript
└── index.html                   # Halaman HTML utama
```

## Teknologi yang Digunakan

- Angular 20.3.0
- TypeScript
- Tailwind CSS
- RxJS

