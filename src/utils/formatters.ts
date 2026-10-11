export function formatMarketCap(value: number | null) {
    if (value === null || !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'USD'
    }).format(value)
}

export function formatAxisDate(value: string) {
    return new Date(value).toLocaleDateString('en-US',
        {
            month: 'short',
            day: 'numeric',
            timeZone: 'America/New_York'
        }
    )
}


export function formatDate(value: string) {
    return new Date(value).toLocaleDateString('en-US',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'America/New_York'
        })
}

export function formatBigNum(value: number | null) {
    if (value === null || !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US',
        {
            notation: 'compact',
            maximumFractionDigits: 3
        }).format(value)
}
export function formatPrice(value: number | null) {
    if (value === null || !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
    ).format(value)
}

export function formatPercents(value: number | null) {
    if (value === null || !Number.isFinite(value)) return 'Unavailable'

    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 2
    }).format(value)
}

