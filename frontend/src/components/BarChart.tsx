import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface BarDatum {
    text: string;
    value: number;
}

interface BarChartProps {
    data: BarDatum[];
    width?: number;
    height?: number;
}

export default function BarChart({
    data,
    width = 720,
    height = 480,
}: BarChartProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const topData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

        const margin = { top: 40, right: 30, bottom: 60, left: 70 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const isDark = document.documentElement.classList.contains("dark");
        const textColor = isDark ? "#f3f4f6" : "#111827";
        const background = isDark ? "#0f172a" : "#f9fafb";

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Background
        g.append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("fill", background)
            .attr("rx", 12);

        // Warna dinamis
        const colorScale = d3
            .scaleSequential(d3.interpolateCool)
            .domain([0, topData.length - 1]);

        // Skala
        const x = d3
            .scaleBand()
            .domain(topData.map((d) => d.text))
            .range([0, innerWidth])
            .padding(0.25);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(topData, (d) => d.value)!])
            .nice()
            .range([innerHeight, 0]);

        // Grid horizontal
        g.append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickSize(-innerWidth)
                    .tickFormat(() => "")
            )
            .selectAll("line")
            .attr("stroke", isDark ? "#334155" : "#e2e8f0")
            .attr("stroke-opacity", 0.4);

        // Axis
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", textColor)
            .attr("font-size", "14px")
            .attr("dy", "1.5em")
            .attr("transform", "rotate(-30)")
            .attr("text-anchor", "end");

        g.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .attr("fill", textColor)
            .attr("font-size", "12px");

        // Filter glow
        const defs = svg.append("defs");
        const glow = defs
            .append("filter")
            .attr("id", "glow")
            .attr("x", "-30%")
            .attr("y", "-30%")
            .attr("width", "160%")
            .attr("height", "160%");
        glow.append("feGaussianBlur").attr("stdDeviation", 4).attr("result", "coloredBlur");
        const feMerge = glow.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Tooltip
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "bar-tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("padding", "10px 14px")
            .style("border-radius", "10px")
            .style("backdrop-filter", "blur(10px)")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .style("opacity", "0")
            .style("box-shadow", "0 4px 25px rgba(0,0,0,0.35)")
            .style("background", isDark ? "rgba(23,23,33,0.9)" : "rgba(255,255,255,0.9)")
            .style("color", textColor)
            .style("z-index", "9999")
            .style("transition", "opacity 0.3s ease");

        // Bars
        g.selectAll<SVGRectElement, BarDatum>("rect.bar")
            .data(topData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.text)!)
            .attr("width", x.bandwidth())
            .attr("y", innerHeight)
            .attr("height", 0)
            .attr("rx", 8)
            .attr("fill", (_, i) => colorScale(i))
            .attr("filter", "url(#glow)")
            .transition()
            .delay((_, i) => i * 100)
            .duration(800)
            .ease(d3.easeElasticOut)
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => innerHeight - y(d.value));

        // Hover interaksi
        g.selectAll<SVGRectElement, BarDatum>("rect.bar")
            .on("mouseover", function (event, d) {
                const currentColor = d3.select(this).attr("fill");
                tooltip
                    .style("opacity", "1")
                    .html(
                        `<div style="font-weight:700;margin-bottom:4px;">${d.text}</div>
             <div>Value: <strong>${d.value}</strong></div>`
                    );
                d3.select(this)
                    .raise()
                    .transition()
                    .duration(200)
                    .attr("y", y(d.value) - 8)
                    .attr("height", innerHeight - y(d.value) + 8)
                    .attr("filter", "url(#glow)")
                    .attr("stroke", currentColor)
                    .attr("stroke-width", "2px")
                    .attr("transform", "scale(1.02)");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", event.pageX + 16 + "px")
                    .style("top", event.pageY - 45 + "px");
            })
            .on("mouseout", function (event, d) {
                tooltip.transition().duration(250).style("opacity", "0");
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("y", y(d.value))
                    .attr("height", innerHeight - y(d.value))
                    .attr("stroke-width", "0")
                    .attr("transform", "scale(1)");
            });

        return () => {
            tooltip.remove();
        };
    }, [data, width, height]);

    return (
        <div className="flex justify-center p-0">
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
}
