interface Entity {
    entity: string;
    text: string;
    value: number;
    start: number;
    end: number;
}

interface HighlightedReviewProps {
    review: string;
    entities: Entity[];
}

export default function HighlightReview({ review, entities }: HighlightedReviewProps) {
    if (!entities || entities.length === 0) return <p>{review}</p>;
    // Urutkan berdasarkan posisi mulai agar tidak tumpang tindih
    const sorted = [...entities].sort((a, b) => a.start - b.start);

    const fragments: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((e, i) => {
        // Tambahkan teks sebelum efek samping
        if (e.start > lastIndex) {
            fragments.push(<span key={`text-${i}`}>{review.slice(lastIndex, e.start)}</span>);
        }

        // Tambahkan teks efek samping yang di-highlight
        fragments.push(
            <span
                key={`highlight-${i}`}
                className="bg-[#78B9B5]/30 text-[#065084] dark:bg-[#065084]/40 dark:text-[#78B9B5] font-semibold px-1 rounded transition-all duration-200"
                title={`Confidence: ${(e.value * 100).toFixed(1)}%`}
            >
                {review.slice(e.start, e.end)}
            </span>
        );

        lastIndex = e.end;
    });

    // Tambahkan sisa teks di akhir
    if (lastIndex < review.length) {
        fragments.push(<span key="end">{review.slice(lastIndex)}</span>);
    }

    return <div className="p-4 rounded-xl bg-gray-200 dark:bg-[#282c34] text-[#065084] dark:text-[#78B9B5] shadow-md mt-10">
        <p className="leading-relaxed text-justify">{fragments}</p>;
    </div>

}