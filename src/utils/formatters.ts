export function formatMarketCap(value: number|null){
    if(value===null|| !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits:2,
        style:'currency',
        currency:'USD'
    }).format(value)
}

export function formatPrice(value: number|null){
    if(value===null|| !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US',{
        notation:'compact',
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits:2
    }
    ).format(value)
}

export function formatPercents(value: number|null){
    if(value===null || !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US',{
        style: 'percent',
        maximumFractionDigits: 2
    }).format(value)
}

