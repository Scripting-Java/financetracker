export interface HistoryRecord{
    date: string,
    open: number| null, 
    high: number| null,
    low: number|null,
    close: number|null,
    adjustedClose: number|null,
    volume: number|null
}

export interface HistoryResponse{
    ticker: string,
    interval: string,
    start: string,
    end: string,
    count: number,
    data: HistoryRecord[]
}