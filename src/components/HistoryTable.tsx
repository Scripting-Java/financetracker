import type { HistoryRecord } from "../types/history";
import { formatPrice, formatBigNum } from "../utils/formatters";
import { useState } from "react";

interface HistoryTableProps {
    records: HistoryRecord[];
}

export default function HistoryTable({ records, }: HistoryTableProps) {
    const [visibleCount, setVisibleCount] = useState(10);

    const [visibleColumns, setVisibleColumns] = useState({
        open: true,
        high: true,
        low: true,
        close: true,
    });

    const displayedRecords = records.slice(0, visibleCount);
    const remaining = records.length - displayedRecords.length;
    return (
        <>
            <fieldset className="history-column-controls">
                <legend>Visible columns</legend>

                {(["open", "high", "low", "close"] as const).map((column) => (
                    <label key={column}>
                        <input
                            type="checkbox"
                            checked={visibleColumns[column]}
                            onChange={() =>
                                setVisibleColumns((previous) => ({
                                    ...previous,
                                    [column]: !previous[column],
                                }))
                            }
                        />
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                    </label>
                ))}
            </fieldset>
            <div className="history-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {visibleColumns.open && <th>Open</th>}
                            {visibleColumns.high && <th>High</th>}
                            {visibleColumns.low && <th>Low</th>}
                            {visibleColumns.close && <th>Close</th>}
                            <th>Volume</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayedRecords.map((record) => (
                            <tr key={record.date}>
                                <td>{record.date.slice(0, 10)}</td>

                                {visibleColumns.open && (
                                    <td>{formatPrice(record.open) ?? "-"}</td>
                                )}
                                {visibleColumns.high && (
                                    <td>{formatPrice(record.high) ?? "-"}</td>
                                )}
                                {visibleColumns.low && (
                                    <td>{formatPrice(record.low) ?? "-"}</td>
                                )}
                                {visibleColumns.close && (
                                    <td>{formatPrice(record.close) ?? "-"}</td>
                                )}

                                <td>{formatBigNum(record.volume)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {remaining > 0 && (
                <div className="history-table-footer">
                    <button
                        type="button"
                        onClick={() =>
                            setVisibleCount((count) =>
                                Math.min(count + 10, records.length)
                            )
                        }
                    >
                        Load 10 more ({remaining} remaining)
                    </button>
                </div>
            )}

            {records.length > 10 && remaining === 0 && (
                <div className="history-table-footer">
                    <button
                        type="button"
                        onClick={() => setVisibleCount(10)}
                    >
                        Show fewer
                    </button>
                </div>
            )}
        </>
    );
}