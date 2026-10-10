import type { HistoryRecord } from "../types/history";
import { formatPrice, formatBigNum } from "../utils/formatters";

interface HistoryTableProps{
    records: HistoryRecord[];
}

export default function HistoryTable({records,}:HistoryTableProps){
    return(
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Volume</th>
                </tr>
            </thead>

            <tbody>
                {
                records.map((record)=>(<tr key={record.date}>
                <td>{record.date.slice(0,10)}</td>
                <td>{formatPrice(record.open) ?? "-"}</td>
                <td>{formatPrice(record.high) ?? "-"}</td>
                <td>{formatPrice(record.low) ?? "-"}</td>
                <td>{formatPrice(record.close) ?? "-"}</td>
                <td>{formatBigNum(record.volume)}</td>
                </tr>
            ))}
            </tbody>
        </table> 
    ); 
}