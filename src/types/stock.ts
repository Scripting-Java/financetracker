export interface Stock{
    ticker: string,
    name: string,
    sector: string,
    price: number,
    prevClose: number| null,
    marketCap:number| null,
    yearHigh: number| null,
    yearLow: number| null,
}

