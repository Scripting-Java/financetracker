import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { HistoryRecord } from "../types/history";
import { formatPrice, formatAxisDate, formatDate } from "../utils/formatters";
import { useState } from "react";

interface HistoryChartProps {
    records: HistoryRecord[]
}

export default function HistoryChart({ records }: HistoryChartProps) {
    const chartData = records
    const [visibleLines, setVisibleLines] = useState({
        open: false,
        high: false,
        low: false,
        close: true,
    })

    return (
        <div>
            <div>
            {(["open","high","low","close"] as const).map((key)=>(
                <label key={key}>
                    <input
                    type="checkbox"
                    checked={visibleLines[key]}
                    onChange={()=>setVisibleLines((previous)=> ({
                        ...previous, [key]: !previous[key],
                    }))}/>
                    {key.charAt(0).toUpperCase()+key.slice(1)}
                </label>
            ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date"
                        tickFormatter={formatAxisDate}
                        interval="preserveStartEnd"
                        minTickGap={40} />
                    <YAxis tickFormatter={formatPrice} />
                    <Tooltip
                        labelFormatter={(label) => formatDate(String(label))}
                        formatter = {(value,name)=>[formatPrice(Number(value)),name]}
                        
                    />

                    {visibleLines.open &&(
                    <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#e26c6c"
                        name="Opening Price"
                        strokeOpacity={visibleLines.open ? 1 : 0}
                        dot={true}
                    />

                    )}
                    {visibleLines.low &&(
                    <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#f5ae5d"
                        name="Low Price"
                        strokeOpacity={visibleLines.low ? 1 : 0}
                        dot={true}
                    />

                    )}
                    {visibleLines.high &&(
                        <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#9474ee"
                        name="High Price"
                        strokeOpacity={visibleLines.high ? 1 : 0}
                        dot={true}
                    />
                    )}

                    {visibleLines.close &&(
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#7ca1f0"
                        name="Closing Price"
                        strokeOpacity={visibleLines.close ? 1 : 0}
                        dot={true}
                    />
                    )}
                </LineChart>
            </ResponsiveContainer>
            
        </div>
)}