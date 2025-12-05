# Valued Pips (VP) Calculator

Aplikasi web berbasis Angular yang dirancang untuk menghitung potensi perolehan TF Point dan penebusannya berdasarkan trading pips pada berbagai pasangan mata uang.

## Fitur Utama

- **Kalkulasi Valued Pips (VP)**: Menghitung VP berdasarkan pips yang diperoleh dari berbagai pasangan mata uang
- **Sistem Level**: Mendukung berbagai level trader dari Rookie hingga Legend dengan pengali poin yang berbeda
- **Program Kemitraan**: Mendukung tiga tier kemitraan (Basic, Prospect, Priority) dengan persentase penebusan yang berbeda
- **Simulasi Penebusan Poin**: Menghitung nilai tunai dari poin yang dapat ditukar
- **Kalkulator VP ke Pips & Persentase**: Konversi VP ke jumlah pips yang diperlukan dan persentasenya
- **Simulasi Pengurangan TF Point**: Menganalisis dampak kerugian trading terhadap TF Point
- **Simulasi Penurunan Medal TF**: Memperkirakan perubahan medal berdasarkan performa trading bulanan
- **Antarmuka Responsif**: Desain yang ramah pengguna dengan tampilan yang menarik
- **Navigasi Multi-halaman**: Antarmuka dengan navigasi antara kalkulator utama dan simulator kerugian

## Cara Menggunakan

### Kalkulator VP Utama
1. **Pilih Level Trader**: Pilih level trader Anda dari dropdown yang tersedia
2. **Pilih Tier Kemitraan** (jika tersedia): Pilih tier kemitraan yang sesuai
3. **Input Pips**: Masukkan jumlah pips untuk setiap pasangan mata uang yang Anda tradingkan
4. **Hitung**: Klik tombol "Calculate" untuk menghitung VP dan TF Point
5. **Tukar Poin** (jika memenuhi syarat): Masukkan jumlah poin yang ingin ditukar untuk melihat nilai tunainya

### Simulator Kerugian
1. **Kalkulator VP ke Pips & Persentase**:
   - Masukkan target VP yang ingin dicapai
   - Pilih nilai pasangan mata uang
   - Masukkan jumlah trade rugi dan VP rugi per trade
   - Lihat hasil perhitungan pips yang diperlukan dan sisa VP setelah kerugian

2. **Simulasi Pengurangan TF Point**:
   - Sistem akan otomatis menghitung total VP loss
   - Pilih level analyst untuk melihat perkalian loss
   - Lihat total pengurangan TF Point yang akan diterapkan

3. **Simulasi Penurunan Medal TF**:
   - Masukkan jumlah medal Anda saat ini
   - Isi riwayat VP 6 bulan terakhir
   - Lihat perhitungan perubahan medal berdasarkan performa bulanan

## Persyaratan Sistem

- Node.js (versi 22.14.0 atau lebih baru)
- Angular CLI 20.3.0
- TypeScript 5.8.2
- Tailwind CSS

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

Untuk menjalankan preview build produksi:
```bash
npm run preview
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
- TypeScript 5.8.2
- Tailwind CSS
- RxJS 7.8.2
- Vite 6.2.0

## Fitur Tambahan

### Sistem Level Trader
- **Rookie**: Pengali 0.3, tidak ada penebusan poin
- **Pro**: Pengali 0.4, tidak ada penebusan poin
- **Elite**: Pengali 0.5, penebusan 5000 poin, kemitraan Basic (20%), Prospect (30%)
- **Master (Medal 8-10)**: Pengali 0.7, penebusan 10000 poin, kemitraan Basic (30%), Prospect (50%), Priority (100%)
- **Master (Medal 11-12)**: Pengali 1.0, penebusan 10000 poin, kemitraan Basic (30%), Prospect (50%), Priority (100%)
- **Legend**: Pengali 1.5, penebusan 20000 poin, kemitraan Basic (50%), Prospect (75%), Priority (100%)

### Pasangan Mata Uang yang Didukung
- 16 pasangan mata uang dengan nilai VP berbeda (0.5 hingga 2.0)
- Termasuk pasangan mayor, cross, dan komoditas (XAUUSD)

### Sistem Perhitungan Kerugian
- Pengurangan TF Point diterapkan jika VP loss ≥ 300
- Perhitungan penurunan medal berdasarkan:
  - Persentase kerugian bulanan
  - Persentase kerugian beruntun
- Status "Kembali ke Newbie" jika medal mencapai 0

