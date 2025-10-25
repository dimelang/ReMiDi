import { Microscope } from "lucide-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import { useAnalysis } from "../context/AnalysisContext";

export default function DrugAnalysis() {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchDrug = async () => {
            try {
                const response = await fetch('http://localhost:8000/get-all-drugs');
                const result = await response.json();

                if (result.status === 'success') {
                    const data = result.data.map(function (d: []) {
                        return { value: d, label: d }
                    });

                    setDrugs(data);
                } else {
                    throw new Error(result.data);
                }
            } catch (err: any) {
                Toastify({
                    text: "Gagal mendapatkan daftar obat",
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
            } finally {
                setLoading(false);
            }
        }
        fetchDrug();
    }, []);

    const { setDrugResult } = useAnalysis();
    const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

    const handleAnalyze = () => {
        setDrugResult({
            nama_obat: selectedDrug
        })
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Pilih Merk Obat 💊</h2>

            <Select
                placeholder="Pilih obat"
                options={drugs}
                isSearchable
                value={selectedDrug}
                onChange={(value) => setSelectedDrug(value)} // ← update state
                className="w-full"
                classNames={{
                    control: (state) =>
                        `border border-gray-300 dark:border-gray-700 rounded-lg px-1 transition-all duration-200 mb-4
            ${state.isFocused
                            ? "ring-2 ring-[#065084] dark:ring-[#78B9B5]"
                            : ""}
            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`,
                    menu: () =>
                        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 overflow-hidden",
                    option: (state) =>
                        `px-3 py-2 cursor-pointer text-sm transition-colors duration-150
            ${state.isSelected
                            ? "bg-[#065084] dark:bg-[#78B9B5] text-white dark:text-gray-900"
                            : state.isFocused
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                : "text-gray-700 dark:text-gray-200"}
            `,
                    singleValue: () => "text-gray-900 dark:text-gray-100",
                    input: () => "text-gray-900 dark:text-gray-100",
                    placeholder: () =>
                        "text-gray-400 dark:text-gray-400 text-sm select-none",
                    dropdownIndicator: (state) =>
                        `text-gray-500 dark:text-gray-300 transition-transform ${state.selectProps.menuIsOpen ? "rotate-180" : ""
                        }`,
                    indicatorSeparator: () => "hidden",
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    colors: {
                        ...theme.colors,
                        primary: "#065084",
                        primary25: "#E0F2FE",
                        primary50: "#78B9B5",
                    },
                })}
            />

            <button
                disabled={!selectedDrug} // ← validasi
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out 
          ${selectedDrug
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
