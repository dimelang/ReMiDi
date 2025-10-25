import { useState } from "react";
import { useAnalysis } from "../context/AnalysisContext";

export default function Tabs({ tabs }: any) {
    const [active, setActive] = useState(Object.keys(tabs)[0]);
    const { drugResult, sentenceResult, setDrugResult, setSentenceResult } = useAnalysis();

    const showResult = (active === "Analisis Obat" && drugResult) || (active === "Analisis Review" && sentenceResult);

    return (
        <div className="w-full max-w-5xl mx-auto mt-14">
            {/* Tab Header */}
            <div className="flex border-b border-[#065084] dark:border-[#78B9B5] mb-4">
                {Object.keys(tabs).map((key) => (
                    <button
                        key={key}
                        onClick={() => { setActive(key); setDrugResult(null); setSentenceResult(null) }}
                        className={`flex-1 py-3 text-center font-medium transition-all duration-300 ease-in-out ${active === key
                            ? "text-[#065084] dark:text-[#78B9B5] border-b-2 border-[#065084] dark:border-[#78B9B5] "
                            : "text-gray-400 dark:text-gray-500 hover:text-[#065084] hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-[#78B9B5]"
                            }`}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-900 shadow-card rounded-xl p-6 transition-all duration-500 mt-10">
                {tabs[active][0]}
            </div>

            {/* result */}
            {showResult && (
                <div className="bg-white dark:bg-gray-900 shadow-card rounded-xl p-6 transition-all duration-500 mt-10">
                    {tabs[active][1]}
                </div>
            )}

        </div>
    );
}