import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { HistoryRecord } from "../types/history";
import { formatPrice, formatAxisDate, formatDate } from "../utils/formatters";

interface HistoryChartProps{
    records: HistoryRecord[]
}

export default function HistoryChart({records}: HistoryChartProps){
    const chartData = records.filter(
        (record) => record.close !== null
    )
    return(
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"
                tickFormatter={formatAxisDate}
                interval="preserveStartEnd"
                minTickGap={40}/>
                <YAxis tickFormatter={formatPrice}/>
                <Tooltip 
                labelFormatter={(label)=>formatDate(String(label))}
                formatter={(value)=> formatPrice(Number(value))}
                />
                <Line
                type="monotone"
                dataKey="close"
                stroke="#2563eb"
                name="Closing Price" />
            </LineChart>
        </ResponsiveContainer>
    )
}