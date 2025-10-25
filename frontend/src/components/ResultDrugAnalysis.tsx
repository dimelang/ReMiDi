import { ClipboardList, List, MessageCircleCode, MessageSquareText, Tags, TrendingUp } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import WordCloud from "./WordCloud";
import Chart from 'chart.js/auto';
import BarChart from "./BarChart";
import { useEffect } from "react";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import EfekSampingCollapse from "./EfekSampingCollapse";
import ReviewList from "./ReviewList";
import { useLoading } from "../context/LoadingContext";

export default function ResultDrugAnalysis() {
    const { setLoadingStatus } = useLoading();
    const { drugResult, setDrugResult } = useAnalysis();
    useEffect(() => {
        const analyzeDrug = async () => {
            try {
                const response = await fetch(`http://localhost:8000/analyze-by-brand/${drugResult.nama_obat.label}`);
                const result = await response.json();

                if (result.status === 'success') {
                    const data = result.data
                    if (!data || Object.keys(data).length === 0) {
                        Toastify({
                            text: "Tidak ada data analisis untuk obat ini.",
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            style: { background: "linear-gradient(to right, #ff4e50, #f9d423)" },
                        }).showToast();

                        setDrugResult({ ...drugResult, 'result': null });
                        return;
                    }

                    setDrugResult({ ...drugResult, 'result': data });
                    setLoadingStatus(false);

                } else {
                    throw new Error(result.data);
                    setLoadingStatus(false);
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
        analyzeDrug();
    }, [drugResult.nama_obat]);

    const result = drugResult?.result;

    // 🧩 Jika belum ada data, jangan render komponen yang bergantung pada data_efek
    if (!result) {
        return (
            <div className="mt-10 text-center text-gray-500 italic">
                Belum ada hasil analisis. Silakan pilih obat terlebih dahulu.
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-row gap-2">
                <ClipboardList />
                <h2 className="text-xl font-semibold mb-4">Hasil Analisis:</h2>
                <h2 className="text-xl font-bold mb-4 text-[#065084] dark:text-[#78B9B5]">{drugResult.nama_obat.label}</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-lg flex justify-center gap-2 bg-gray-200 dark:bg-[#282c34] flex-col items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <Tags size={18} className="text-[#065084] dark:text-[#78B9B5]" />
                        <p className="font-lato font-medium text-lg text-[#065084] dark:text-[#78B9B5]">Total Efek Samping</p>
                    </div>
                    <h2 className="text-4xl font-poppins font-semibold text-[#065084] dark:text-[#78B9B5]">{drugResult.result?.total_efek_samping ?? 0}</h2>
                </div>
                <div className="p-6 rounded-lg flex justify-center gap-2 bg-gray-200 dark:bg-[#282c34] flex-col items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <MessageSquareText size={18} className="text-[#065084] dark:text-[#78B9B5]" />
                        <p className="font-lato font-medium text-lg text-[#065084] dark:text-[#78B9B5]">Ulasan Dianalisis</p>
                    </div>
                    <h2 className="text-4xl font-poppins font-semibold text-[#065084] dark:text-[#78B9B5]">{drugResult.result?.total_ulasan ?? 0}</h2>
                </div>
                <div className="p-6 rounded-lg flex justify-center gap-2 bg-gray-200 dark:bg-[#282c34] flex-col items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <TrendingUp size={18} className="text-[#065084] dark:text-[#78B9B5]" />
                        <p className="font-lato font-medium text-lg text-[#065084] dark:text-[#78B9B5]">Efek Paling Umum</p>
                    </div>
                    <h2 className="text-3xl font-poppins font-semibold text-[#065084] dark:text-[#78B9B5]">{drugResult.result?.data_efek?.[0]?.text ?? '-'}</h2>
                </div>
            </div>

            {/* wordcloud & chart */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex flex-col mt-6">
                    <h2 className="text-lg font-semibold mb-4">Word Cloud Efek Samping</h2>
                    <WordCloud data={drugResult.result.data_efek || []} width={720} height={350} />
                </div>
                <div className="flex flex-col mt-6">
                    <h2 className="text-lg font-semibold mb-4">Top 10 Efek Samping</h2>
                    <BarChart data={drugResult.result.data_efek || []} width={720} height={420} />
                </div>
            </div>

            {/* daftar efek samping */}
            <EfekSampingCollapse dataEfek={drugResult.result?.data_efek ?? []} />

            {/* contoh ulasan */}
            <ReviewList reviews={drugResult.result?.data_ulasan ?? []} />


        </div>
    )
}