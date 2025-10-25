import { ClipboardList } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import BarChart from "./BarChart";
import HighlightReview from "./HighlightReview";

interface AnalysisResult {
    entity: string;
    text: string;
    value: number;
    start: number;
    end: number;
}

export default function ResultSentenceAnalysis() {
    const { sentenceResult, setSentenceResult } = useAnalysis();

    const result = sentenceResult?.result as AnalysisResult[] | undefined;

    if (result) {
        const isEmpty = result.length == 0;
        return (
            <div>
                <div className="flex flex-row gap-2">
                    <ClipboardList />
                    <h2 className="text-xl font-semibold mb-4">Hasil Analisis:</h2>
                </div>
                {!isEmpty ? (
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-semibold mb-4">Confidence Score</h2>
                            <BarChart data={result.map(({ entity, start, end, ...rest }) => rest) || []} />
                        </div>
                        <HighlightReview review={sentenceResult.review} entities={result} />
                    </div>
                ) : (
                    <div className="text-gray-500 italic mt-4">Tidak ditemukan efek samping.</div>
                )}

            </div>
        )
    } else {
        // 🧩 Jika belum ada data, jangan render komponen yang bergantung pada data_efek
        return (
            <div className="mt-10 text-center text-gray-500 italic">
                Belum ada hasil analisis. Masukkan review anda
            </div>
        );
    }
}