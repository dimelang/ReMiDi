import { Microscope } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAnalysis } from "../context/AnalysisContext";
import Toastify from "toastify-js";
import { useLoading } from "../context/LoadingContext";

export default function SentenceAnalysis() {
    const [sentence, setSentence] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { setSentenceResult } = useAnalysis();
    const isValid = sentence.trim().length > 0;
    const { setLoadingStatus } = useLoading();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSentence(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // reset dulu
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 20}px`; // sesuaikan tinggi
        }
    }

    const handleAnalyze = () => {
        const analyzeReview = async () => {
            try {
                const response = await fetch('http://localhost:8000/analyze-by-review/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'review': sentence }),
                })
                const result = await response.json();

                if (result.status == 'success') {
                    const data = result.data
                    console.log(data);
                    if (!data || Object.keys(data).length === 0) {
                        Toastify({
                            text: "Tidak ada data analisis untuk review yang anda masukkan.",
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            style: { background: "linear-gradient(to right, #ff4e50, #f9d423)" },
                        }).showToast();
                    }
                    setSentenceResult({ 'review': sentence, 'result': result.data });
                    setLoadingStatus(false);
                    return;
                } else {
                    setLoadingStatus(false);
                    throw new Error(result.data)
                }
            } catch (error) {
                Toastify({
                    text: "Terjadi kesalahan. Gagal menganalisis obat",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #ff4e50, #f9d423)",
                    },

                    onClick: function () { } // Callback after click
                }).showToast();
                setLoadingStatus(false);
            }
        }
        setLoadingStatus(true);
        analyzeReview();
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Analisis Berdasarkan Kalimat 📝
            </h2>

            <textarea
                ref={textareaRef}
                placeholder="Tulis kalimat ulasan di sini..."
                rows={1}
                value={sentence}
                onChange={handleInputChange}
                className="w-full border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#065084] dark:ring-[#78B9B5] mb-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300"
            />

            <button
                disabled={!isValid}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out
          ${isValid
                        ? "bg-[#065084] dark:bg-[#78B9B5] text-white dark:text-gray-900 hover:scale-105 hover:shadow-md"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                onClick={handleAnalyze}
            >
                <Microscope className="w-5 h-5" />
                Analisis
            </button>
        </div>
    );
}
