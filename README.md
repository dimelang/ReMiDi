# 💊 ReMiDi — Drug Side Effect Analyzer

ReMiDi adalah aplikasi web berbasis kecerdasan buatan yang dirancang untuk **mendeteksi dan menganalisis efek samping obat** dari ulasan pengguna.  
Aplikasi ini memanfaatkan model **Named Entity Recognition (NER)** berbasis **BERT** untuk mengekstraksi informasi medis secara otomatis dari teks, kemudian menampilkan hasil analisis dalam bentuk **visualisasi interaktif** melalui antarmuka web modern.

---

## 🚀 Fitur Utama

### 🧩 Analisis Obat
- Pilih **merek obat** tertentu dan lihat:
  - Jumlah total efek samping yang terdeteksi  
  - Jumlah ulasan yang dianalisis  
  - Efek samping yang paling sering muncul  
  - **Word cloud** efek samping  
  - **Grafik frekuensi** efek samping teratas  
  - Ulasan lengkap beserta **penanda efek sampingnya**

### 💬 Analisis Review
- Masukkan satu kalimat ulasan obat untuk mendapatkan:
  - **Confidence score** dari setiap efek samping yang terdeteksi  
  - Visualisasi entitas langsung pada teks ulasan  

---

## ⚙️ Teknologi yang Digunakan

| Komponen | Teknologi |
|-----------|------------|
| **Frontend** | [React.js](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/) |
| **Backend** | [FastAPI (Python)](https://fastapi.tiangolo.com/) |
| **Model AI** | BERT (Fine-tuned NER for Adverse Drug Reaction) |
| **Visualisasi** | [d3.js](https://d3js.org/) |

---


## Instalasi & Konfigurasi


---

## 🧪 Cara Menjalankan Proyek

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<username>/PharmaInsight.git
cd PharmaInsight


