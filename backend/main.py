from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from functools import lru_cache
from collections import Counter
import pandas as pd
import ast
import re
import logging

# =========================================================
# ⚙️ KONFIGURASI DASAR
# =========================================================
MODEL_PATH = "bert-ner-adr/checkpoint-7600"
DATASET_PATH = "dataset/ade_cadec_result_effects.csv"

# Logging agar tahu kapan model dimuat
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =========================================================
# 🚀 FASTAPI APP SETUP
# =========================================================
app = FastAPI(title="Drug Side Effect NER API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    # Ganti dengan ["http://localhost:5173"] untuk produksi
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# 🧠 MODEL & PIPELINE SETUP (CACHED)
# =========================================================


@lru_cache(maxsize=1)
def get_ner_pipeline():
    logger.info("🔄 Loading NER model and tokenizer into memory...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForTokenClassification.from_pretrained(MODEL_PATH)
    nlp = pipeline("ner", model=model, tokenizer=tokenizer,
                   aggregation_strategy="simple")
    logger.info("✅ NER model loaded successfully!")
    return nlp


@app.on_event("startup")
def on_startup():
    """
    Event ini hanya dijalankan sekali saat FastAPI startup.
    Tujuannya agar model diload lebih awal dan siap dipakai.
    """
    try:
        get_ner_pipeline()
        logger.info("🚀 Model siap digunakan!")
    except Exception as e:
        logger.error(f"❌ Gagal memuat model: {e}")


# =========================================================
# 📊 DATASET LOADING
# =========================================================
try:
    df = pd.read_csv(DATASET_PATH)
    logger.info(f"📄 Dataset berhasil dimuat: {len(df)} baris")
except Exception as e:
    logger.error(f"❌ Gagal memuat dataset: {e}")
    df = pd.DataFrame()

# =========================================================
# 🧹 UTILITAS PEMROSESAN DATA
# =========================================================


def clean_entry(raw):
    try:
        parsed = ast.literal_eval(raw)
        return [parsed[i:i+2] for i in range(0, len(parsed), 2)]
    except Exception:
        return []


def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text


def count_total_effects(raw):
    return sum(len(effect[1]) for effect in raw)


# mendapatkan efek samping beserta jumlah kemunculan untuk satu merk obat
def get_effect_frequency(raw):
    effects = []
    for _, items in raw:
        for e in items:
            effects.append(normalize_text(e["effect"]))
    freq = Counter(effects)
    return [{"text": k, "value": v} for k, v in freq.most_common()]


if "result" in df.columns:
    df["result_cleaned"] = df["result"].apply(clean_entry)

# =========================================================
# 📍 ROUTES / ENDPOINTS
# =========================================================


@app.get("/")
def home():
    return {"message": "✅ Drug NER API is running!"}


@app.get("/description-apps")
def get_description_apps():
    try:
        total_efek = 0
        total_ulasan = 0
        for index, row in df.iterrows():
            data_cleaned = row['result_cleaned']
            data_efek = get_effect_frequency(data_cleaned)
            total_efek += len(data_efek)
            total_ulasan += len(data_cleaned)

        return {"data": {
            'jumlah_obat': len(df),
            'jumlah_ulasan': total_ulasan,
            'jumlah_efek_samping': total_efek,
            'model': 'BERT'
        }, "status": "success"}
    except Exception as e:
        return {"data": f"Error: {str(e)}", "status": "failed"}


@app.get("/get-all-drugs")
def get_all_drugs():
    try:
        return {"data": df["drug"].tolist(), "status": "success"}
    except Exception as e:
        return {"data": f"Error: {str(e)}", "status": "failed"}


@app.get("/analyze-by-brand/{name}")
def analyze_by_brand(name: str):
    try:
        searched = df[df["drug"].str.lower() == name.lower()]
        if searched.empty:
            return {"data": {}, "status": "success"}

        data_cleaned = searched["result_cleaned"].dropna().iloc[0]
        data_efek = get_effect_frequency(data_cleaned)
        result = {
            "total_efek_samping": len(data_efek),
            "total_ulasan": len(data_cleaned),
            "data_efek": data_efek,
            "data_ulasan": data_cleaned,
        }
        return {"data": result, "status": "success"}
    except Exception as e:
        logger.error(f"❌ analyze_by_brand error: {e}")
        return {"data": f"Terjadi error: {str(e)}", "status": "failed"}


class ReviewData(BaseModel):
    review: str


@app.post("/analyze-by-review")
def analyze_review(review: ReviewData):
    """
    Endpoint untuk menganalisis efek samping dalam satu kalimat review.
    """
    try:
        nlp_ner = get_ner_pipeline()
        predictions = nlp_ner(review.review)
        result = [
            {
                "entity": pred["entity_group"],
                "text": pred["word"],
                "value": float(pred["score"]),
                "start": pred["start"],
                "end": pred["end"],
            }
            for pred in predictions
            if float(pred["score"]) > 0.5
        ]
        return {"data": result, "status": "success"}
    except Exception as e:
        logger.error(f"❌ analyze_review error: {e}")
        return {"data": f"Terjadi error: {str(e)}", "status": "failed"}
