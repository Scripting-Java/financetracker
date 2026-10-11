import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Customized, useXAxisScale, useYAxisScale } from "recharts";
import type { HistoryRecord } from "../types/history";
import { formatPrice, formatAxisDate, formatDate } from '../utils/formatters'
import { useState } from "react"

interface CandleChartProps {
    records: HistoryRecord[]
}

function CandlestickLayer({ records }: { records: HistoryRecord[] }) {
    const xScale = useXAxisScale();
    const yScale = useYAxisScale();
    const [hoveredCandle, setHoveredCandle] = useState<{
        record: HistoryRecord
        x: number
        y: number
    } | null>(null)

    if (!xScale || !yScale) return null;

    const firstX =
        records.length > 0
            ? xScale(records[0].date, { position: "middle" })
            : undefined;

    const secondX =
        records.length > 1
            ? xScale(records[1].date, { position: "middle" })
            : undefined;


    const spacing = records.length > 1
        ? Math.abs(secondX! - firstX!)
        : 12;

    const candleWidth = Math.max(3, Math.min(12, spacing * 0.6));

    return (
        <g>
            {records.map((record) => {
                if (
                    record.open == null ||
                    record.high == null ||
                    record.low == null ||
                    record.close == null
                ) {
                    return null;
                }

                const centerX = xScale(record.date, { position: "middle" });
                const highY = yScale(record.high);
                const lowY = yScale(record.low);
                const openY = yScale(record.open);
                const closeY = yScale(record.close);

                if (
                    centerX == null ||
                    highY == null ||
                    lowY == null ||
                    openY == null ||
                    closeY == null
                ) {
                    return null;
                }

                const rising = record.close >= record.open;
                const color = rising ? "#22a06b" : "#e05252";

                return (
                    <g key={record.date}
                        onMouseEnter={() =>
                            setHoveredCandle({
                                record,
                                x: centerX,
                                y: Math.min(highY, lowY)
                            })}
                        onMouseLeave={() => setHoveredCandle(null)}
                        style={{ cursor: "crosshair" }}
                    >

                        <line
                            x1={centerX}
                            x2={centerX}
                            y1={highY}
                            y2={lowY}
                            stroke={color}
                            strokeWidth={1.5}
                        />
                        <rect
                            x={centerX - candleWidth / 2}
                            y={Math.min(openY, closeY)}
                            width={candleWidth}
                            height={Math.max(1, Math.abs(openY - closeY))}
                            fill={color}
                            stroke={color}
                        />
                        <rect
                            x={centerX - candleWidth}
                            y={Math.min(highY, lowY)-6}
                            width={candleWidth * 2}
                            height={Math.abs(lowY-highY)+24}
                            fill="transparent"
                            pointerEvents="all"
                        />
                    </g>
                );
            })}

            {hoveredCandle && (
                <g
                    transform={`translate(${hoveredCandle.x + 12}, ${hoveredCandle.y + 8})`}
                    pointerEvents="none">

                    <rect width={155} height={105} rx={6} fill="#1f2937" stroke="#64748b" />
                    <text x={10} y={18} fill="white" fontSize={12} fontWeight="bold">
                        {formatDate(hoveredCandle.record.date)}
                    </text>
                    <text x={10} y={36} fill="white" fontSize={11}>
                        Open: {formatPrice(hoveredCandle.record.open!)}
                    </text>
                    <text x={10} y={53} fill="white" fontSize={11}>
                        High: {formatPrice(hoveredCandle.record.high!)}
                    </text>
                    <text x={10} y={70} fill="white" fontSize={11}>
                        Low:  {formatPrice(hoveredCandle.record.low!)}
                    </text>
                    <text x={10} y={87} fill="white" fontSize={11}>
                        Close: {formatPrice(hoveredCandle.record.close!)}
                    </text>
                </g>

            )}
        </g>
    );
}

export default function CandleChart({ records }: CandleChartProps) {
    const chartData = records.filter(
        (record) =>
            record.open != null &&
            record.high != null &&
            record.low != null &&
            record.close != null
    )
    const minPrice = Math.min(...chartData.map((record) => record.low!));
    const maxPrice = Math.max(...chartData.map((record) => record.high!));
    const pricePadding = (maxPrice - minPrice) * 0.02;


    return (
        <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatAxisDate}
                    minTickGap={40}
                />
                <YAxis tickFormatter={formatPrice} domain={[minPrice - pricePadding, maxPrice + pricePadding]} />
                <Bar dataKey="close" isAnimationActive={false} fill="transparent" stroke="transparent"></Bar>
                <Customized component={<CandlestickLayer records={chartData} />} />
            </ComposedChart>
        </ResponsiveContainer>

    )
}