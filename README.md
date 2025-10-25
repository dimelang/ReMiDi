# 💊 ReMiDi — Drug Side Effect Analyzer

ReMiDi adalah aplikasi web berbasis kecerdasan buatan yang dirancang untuk **mendeteksi dan menganalisis efek samping obat** dari ulasan pengguna.  
Aplikasi ini memanfaatkan model **Named Entity Recognition (NER)** berbasis **BERT** untuk mengekstraksi informasi medis secara otomatis dari teks, kemudian menampilkan hasil analisis dalam bentuk **visualisasi interaktif** melalui antarmuka web modern.

---

## Fitur Utama

### Analisis Obat
- Pilih **merek obat** tertentu dan lihat:
  - Jumlah total efek samping yang terdeteksi  
  - Jumlah ulasan yang dianalisis  
  - Efek samping yang paling sering muncul  
  - **Word cloud** efek samping  
  - **Grafik frekuensi** efek samping teratas  
  - Ulasan lengkap beserta **penanda efek sampingnya**

### Analisis Review
- Masukkan satu kalimat ulasan obat untuk mendapatkan:
  - **Confidence score** dari setiap efek samping yang terdeteksi  
  - Visualisasi entitas langsung pada teks ulasan  

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|-----------|------------|
| **Frontend** | [React.js](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/) |
| **Backend** | [FastAPI (Python)](https://fastapi.tiangolo.com/) |
| **Model AI** | BERT (Fine-tuned NER for Adverse Drug Reaction) |
| **Visualisasi** | [d3.js](https://d3js.org/) |

---

---

## Cara Menjalankan Proyek

### Clone Repository
```bash
git clone https://github.com/dimelang/ReMiDi.git
cd ReMiDi
```


### Download Model
[Download model](https://binusianorg-my.sharepoint.com/personal/dimas_elang_binus_ac_id/_layouts/15/guestaccess.aspx?share=EcNQ3wukuBRKrH4JaotFI6YBX0J5IzV07mwHT_CVRSL6Gw&e=cVK5xD), ekstrak file ZIP ke dalam folder backend. Pastikan struktur folder backend seperti berikut:
```bash
backend/
├── main.py
├── bert-ner-adr/
│   └── checkpoint-7600/
│       ├── config.json
│       ├── model.safetensor
│       .
│       .
│       .
│       └── vocab.txt
└── dataset 
    └── ade_cadec-result_effects.csv
```

Gunakan dua terminal yang berbeda untuk backend dan frontend
### Menjalankan Backend

Buat virtual environment
```bash
python -m venv remidi_env
```
```bash
Aktifkan virtual environment
# Windows
remidi_env\Scripts\acivate
```
```bash
# Linux & MacOS
source remidi_env/bin/activate
```

```bash
cd backend
pip install fastapi uvicorn transformers torch pandas pydantic python-multipart
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --workers 1
```

### Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```



