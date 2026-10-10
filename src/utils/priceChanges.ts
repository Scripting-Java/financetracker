

export function findPriceChange(price: number|null, lastPrice: number|null): number|null{
    if((price === null|| !Number.isFinite(price))||(lastPrice === null|| !Number.isFinite(lastPrice))) return null
    
    return price-lastPrice
}

export function findPercentChange(price: number|null, lastPrice: number|null): number|null{
    if((price === null|| !Number.isFinite(price))||(lastPrice === null|| !Number.isFinite(lastPrice))) return null
    if(lastPrice === 0) return null
    return (price-lastPrice)/lastPrice 
}

