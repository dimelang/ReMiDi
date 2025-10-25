import { useNavigate } from "react-router-dom";
import { PillBottle, Tablets, Pill } from 'lucide-react';
import hero from '../assets/Laboratory-amico.svg';
import { useEffect, useState } from "react";
import { number } from "framer-motion";
import { stat } from "fs";
import Toastify from "toastify-js";

type StatisticType = {
    jumlah_efek_samping: number,
    jumlah_obat: number,
    jumlah_ulasan: number,
    model: string
}

export default function Homepage() {
    const navigate = useNavigate();
    const [statistic, setStatistic] = useState<StatisticType>();
    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/description-apps`);
                const result = await response.json();
                if (result.status === 'success') {
                    const data = result.data;
                    console.log(data);
                    if (!data || Object.keys(data).length === 0) {
                        setStatistic({
                            jumlah_efek_samping: 0,
                            jumlah_obat: 0,
                            jumlah_ulasan: 0,
                            model: ""
                        });
                    }
                    setStatistic(data)
                    return;
                } else {
                    setStatistic({
                        jumlah_efek_samping: 0,
                        jumlah_obat: 0,
                        jumlah_ulasan: 0,
                        model: ""
                    });
                }
            } catch (error) {
                Toastify({
                    text: "Terjadi kesalahan. Gagal mendapatkan data",
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
            }
        };
        getInfo();
        console.log(statistic)
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-20 py-12 w-full my-auto">
            <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
                {/* ===== LEFT SIDE ===== */}
                <div className="flex-1 space-y-6 max-w-xl text-center md:text-left">
                    {/* Title with icons */}
                    <div className="flex justify-center md:justify-start items-center gap-2">
                        <PillBottle
                            strokeWidth={1.5}
                            size={60}
                            className="rotate-90 text-[#065084] dark:text-[#78B9B5] drop-shadow-md"
                        />
                        <div className="flex gap-1">
                            <Tablets
                                strokeWidth={2}
                                size={36}
                                className="-rotate-45 text-[#065084] dark:text-[#78B9B5]"
                            />
                            <Pill
                                strokeWidth={2}
                                size={32}
                                className="text-[#065084] dark:text-[#78B9B5]"
                            />
                        </div>
                        <h1 className="ml-3 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#065084] dark:text-[#78B9B5] font-poppins drop-shadow-sm">
                            SideEffect Analyzer
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mt-4">
                        Ungkap insight tersembunyi dari ulasan obat melalui analisis berbasis AI, dari deteksi efek samping hingga visualisasi yang memudahkan pengambilan keputusan.
                    </p>

                    {/* Call-to-action */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate("/main-page")}
                            className="px-8 py-3 rounded-full font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-transform transform hover:scale-105"
                        >
                            🚀 Mulai Analisis
                        </button>
                    </div>

                    {/* Badges / stats */}
                    <div className="flex gap-3 mt-8 flex-wrap justify-center md:justify-start">
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm border border-blue-100 dark:border-white/10 hover:shadow-md transition">
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                Jumlah Obat
                            </span>
                            <span className="font-semibold text-blue-700 dark:text-cyan-300">
                                {statistic?.jumlah_obat}
                            </span>
                        </div>
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm border border-blue-100 dark:border-white/10 hover:shadow-md transition">
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                Ulasan Terproses
                            </span>
                            <span className="font-semibold text-blue-700 dark:text-cyan-300">
                                {statistic?.jumlah_ulasan}
                            </span>
                        </div>
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm border border-blue-100 dark:border-white/10 hover:shadow-md transition">
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                Efek Samping Unik
                            </span>
                            <span className="font-semibold text-blue-700 dark:text-cyan-300">
                                {statistic?.jumlah_efek_samping}
                            </span>
                        </div>
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm border border-blue-100 dark:border-white/10 hover:shadow-md transition">
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                Model AI
                            </span>
                            <span className="font-semibold text-blue-700 dark:text-cyan-300">
                                {statistic?.model}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT SIDE (Illustration) ===== */}
                <div className="flex-1 mt-12 md:mt-0 flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-3xl rounded-full scale-125 -z-10" />
                    <img
                        src={hero}
                        alt="Hero illustration"
                        className="w-80 md:w-[420px] drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </section>
        </div>
    );
}