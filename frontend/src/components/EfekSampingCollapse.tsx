import { useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export default function EfekSampingCollapse({ dataEfek }: { dataEfek: any[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const show_num = dataEfek.length < 50 ? dataEfek.length : 50;

    // tampilkan hanya 10 item kalau belum expanded
    const visibleEfek = isExpanded ? dataEfek : dataEfek.slice(0, show_num);

    return (
        <div className="flex flex-col gap-5 mt-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    <List />
                    <h2 className="text-xl font-semibold">Daftar Lengkap Efek Samping</h2>
                </div>

                {/* Tombol collapse */}
                {dataEfek.length > 10 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-[#065084] dark:text-[#78B9B5] hover:underline transition-all ease-in-out duration-300"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={16} /> Sembunyikan
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} /> Lihat semua
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Daftar efek samping */}
            <div className="flex flex-wrap gap-2">
                {visibleEfek.length > 0 ? (
                    visibleEfek.map((efek, index) => (
                        <div
                            key={index}
                            className="shadow-md p-2 rounded-xl bg-gray-200 dark:bg-[#282c34] text-[#065084] dark:text-[#78B9B5] text-sm transition-all ease-in-out duration-300 cursor-default hover:scale-110"
                        >
                            {efek.text}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">Tidak ada efek samping ditemukan.</p>
                )}
            </div>

            {/* Info tambahan jika efek disembunyikan */}
            {!isExpanded && dataEfek.length > 10 && (
                <p className="text-gray-500 italic text-sm">
                    Menampilkan {dataEfek.length < show_num ? dataEfek.length : show_num} dari {dataEfek.length} efek samping
                </p>
            )}
        </div>
    );
}
