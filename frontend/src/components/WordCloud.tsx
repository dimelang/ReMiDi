import * as d3 from "d3";
import cloud from "d3-cloud";
import { useEffect, useRef } from "react";

interface WordCloudData {
    text: string;
    value: number;
}

interface WordCloudProps {
    data: WordCloudData[];
    width?: number;
    height?: number;
    maxWords?: number;
}

export default function WordCloud({
    data,
    width = 500,
    height = 300,
    maxWords = 80, // ← batasi jumlah kata
}: WordCloudProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        // 🔹 Ambil top N kata dengan frekuensi tertinggi
        const limitedData = data
            .sort((a, b) => b.value - a.value)
            .slice(0, maxWords);

        // 🔹 Skala ukuran font agar proporsional dan memenuhi area
        const sizeScale = d3
            .scaleLinear()
            .domain([d3.min(limitedData, (d) => d.value) || 1, d3.max(limitedData, (d) => d.value) || 10])
            .range([18, 80]); // ukuran font min–max

        const layout = cloud<WordCloudData>()
            .size([width, height])
            .words(
                limitedData.map((d) => ({
                    text: d.text,
                    value: d.value,
                }))
            )
            .padding(4)
            .rotate(() => (Math.random() > 0.85 ? 90 : 0)) // sedikit variasi rotasi
            .font("Impact")
            .fontSize((d) => sizeScale(d.value))
            .on("end", draw);

        layout.start();

        function draw(words: cloud.Word[]) {
            const svg = d3
                .select(svgRef.current)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("text-anchor", "middle");

            svg.selectAll("*").remove();

            svg
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`)
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", (_, i) => d3.schemeSet2[i % 8])
                .style("font-size", (d: any) => `${d.size}px`)
                .attr("text-anchor", "middle")
                .attr("transform", (d: any) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                .style("cursor", "pointer")
                .style("transition", "all 0.2s ease-in-out")
                .text((d: any) => d.text)
                .on("mouseover", function () {
                    d3.select(this)
                        .style("fill", "#065084")
                        .style("font-size", (d: any) => `${d.size * 1.2}px`);
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("fill", (_, i) => d3.schemeSet2[i % 8])
                        .style("font-size", (d: any) => `${d.size}px`);
                });
        }
    }, [data, width, height, maxWords]);

    return (
        <div className="flex justify-center rounded-xl transition-colors duration-300 bg-gray-200 dark:bg-[#1c1f24] p-4">
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
}
