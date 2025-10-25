import React from "react";
import { MessageCircleCode } from "lucide-react";

interface Effect {
    effect: string;
    start: number;
    end: number;
}

interface ReviewListProps {
    reviews: [string, Effect[]][];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    // Batasi hanya 10 review pertama
    const sliced = reviews.slice(0, 10);

    // Fungsi untuk menandai efek samping berdasarkan start-end
    const highlightText = (text: string, effects: Effect[]) => {
        if (!effects || effects.length === 0) return text;

        // Urutkan berdasarkan posisi awal
        effects.sort((a, b) => a.start - b.start);

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        effects.forEach((ef, i) => {
            // ambil teks sebelum efek
            if (ef.start > lastIndex) {
                parts.push(<span key={`t-${i}-${lastIndex}`}>{text.slice(lastIndex, ef.start)}</span>);
            }

            // ambil teks efek yang diberi highlight
            parts.push(
                <mark
                    key={`m-${i}-${ef.start}`}
                    className="bg-[#78B9B5]/30 text-[#065084] dark:bg-[#065084]/40 dark:text-[#78B9B5] font-semibold px-1 rounded transition-all duration-200"
                >
                    {text.slice(ef.start, ef.end)}
                </mark>
            );

            lastIndex = ef.end;
        });

        // tambahkan sisa teks
        if (lastIndex < text.length) {
            parts.push(<span key={`end-${lastIndex}`}>{text.slice(lastIndex)}</span>);
        }

        return parts;
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-row gap-2 mt-6">
                <MessageCircleCode />

                <h2 className="text-xl font-semibold mb-4">Contoh ulasan</h2>
            </div>
            {sliced.map(([text, effects], index) => (
                <div
                    key={index}
                    className="p-4 rounded-xl bg-gray-200 dark:bg-[#282c34] text-[#065084] dark:text-[#78B9B5] shadow-md"
                >
                    <p className="leading-relaxed">{highlightText(text, effects)}</p>
                </div>
            ))}
        </div>
    );
}
