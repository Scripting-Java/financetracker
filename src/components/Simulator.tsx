import { useState, useEffect } from "react";
import type { HistoryRecord, HistoryResponse } from '../types/history'

interface Purchase {
    id: string
    ticker: string
    amount: number
    purchaseDate: string
}

interface PurchaseResult extends Purchase {
    shares: number
    purchasePrice: number
    currentPrice: number
    currentValue: number
    gainLoss: number
}

const STORAGE_KEY = 'financeTrackerPurchases'

function loadPurchases(): Purchase[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) as Purchase[] : []
    }
    catch {
        return []
    }
}

export default function Simulator() {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [purchases, setPurchases] = useState<Purchase[]>(loadPurchases)
    const [ticker, setTicker] = useState('')
    const [amount, setAmount] = useState('20')
    const [purchaseDate, setPurchaseDate] = useState('')
    const [results, setResults] = useState<PurchaseResult[]>([])
    const [loading, setLoading] = useState(false)
    const [calculationError, setCalculationError] = useState<string | null>(null)

    function savePurchases(next: Purchase[]) {
        setPurchases(next)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        const symbol = ticker.trim().toUpperCase()
        const dollars = Number(amount)

        if (!symbol) {
            setError('Enter a stock ticker.')
            return
        }

        if (!Number.isFinite(dollars) || dollars <= 0) {
            setError('Enter a dollar amount greater than 0')
            return
        }
        if (!purchaseDate || purchaseDate > new Date().toISOString().slice(0, 10)) {
            setError('Choose a valid purchase date that is not in the future.')
            return
        }

        const purchase: Purchase = {
            id: crypto.randomUUID(),
            ticker: symbol,
            amount: dollars,
            purchaseDate
        }

        savePurchases([...purchases, purchase])
        setTicker('')
        setAmount('20')
        setError(null)
    }

    function removePurchase(id: string) {
        savePurchases(purchases.filter((purchase) => purchase.id !== id))
    }

    async function calculatePortfolio() {
        if (purchases.length === 0) {
            setResults([])
            return
        }


        setLoading(true)
        setCalculationError(null)

        try {
            const tickers = [...new Set(purchases.map(p => p.ticker))]
            const historyByTicker = new Map<string, HistoryRecord[]>()

            await Promise.all(
                tickers.map(async (ticker) => {
                    const earliestDate = purchases
                        .filter(p => p.ticker === ticker)
                        .reduce(
                            (earliest, p) =>
                                p.purchaseDate < earliest ? p.purchaseDate : earliest,
                            purchases.find(p => p.ticker === ticker)!.purchaseDate
                        )

                    const startDate = new Date(`${earliestDate}T00:00:00Z`)
                    startDate.setUTCDate(startDate.getUTCDate() - 7)
                    const historyStart = startDate.toISOString().slice(0, 10)

                    const response = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/stock/${encodeURIComponent(ticker)}/history?start=${historyStart}&end=${new Date().toISOString().slice(0, 10)}&interval=1d`
                    )

                    if (!response.ok)
                        throw new Error(`Could not fetch historical price for ${ticker}`)

                    const data: HistoryResponse = await response.json()
                    historyByTicker.set(ticker, data.data)
                }))
            const calculated: PurchaseResult[] = purchases.map(purchase => {
                const history = historyByTicker.get(purchase.ticker) ?? []

                function priceAtDate(date: string): number | null {
                    const eligible = history
                        .filter(record => record.date.slice(0, 10) <= date)
                        .sort((a, b) => b.date.localeCompare(a.date))

                    for (const record of eligible) {
                        const price = record.adjustedClose ?? record.close

                        if (price !== null && price > 0) {
                            return price
                        }
                    }

                    return null
                }

                const purchasePrice = priceAtDate(purchase.purchaseDate)
                const currentPrice = priceAtDate(
                    new Date().toISOString().slice(0, 10)
                )

                if (purchasePrice === null || currentPrice == null)
                    throw new Error(`Price data for ${purchase.ticker} not available for ${purchase.purchaseDate}`)
                const shares = purchase.amount / purchasePrice
                const currentValue = shares * currentPrice

                return {
                    ...purchase,
                    shares,
                    purchasePrice,
                    currentPrice,
                    currentValue,
                    gainLoss: currentValue - purchase.amount
                }
            })
            setResults(calculated)
        }
        catch (error) {
            setCalculationError(error instanceof Error ? error.message : 'Simulator calculation failed.')
            setResults([])
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        void calculatePortfolio()
    }, [purchases])


    return (
        <section>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                Simulator {isOpen ? '▲' : '▼'}
            </button>
            {isOpen && (
                <>
                    <p>Add purchases to build your historical portfolio.</p>

                    <form onSubmit={handleAdd}>
                        <label>
                            Ticker
                            <input
                                value={ticker}
                                onChange={(event) => setTicker(event.target.value)}
                                placeholder="AAPL"
                                required
                            />
                        </label>

                        <label>
                            Purchase Amount (in $)
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Purchase Date
                            <input
                                type="date"
                                value={purchaseDate ?? ''}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(event) => setPurchaseDate(event.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Add Purchase</button>
                    </form>
                    {error && <p role="alert">{error}</p>}

                    {purchases.length === 0 ? (
                        <p>Nothing to simulate. Add a purchase.</p>
                    ) : (
                        <ul>
                            {purchases.map((purchase) => (
                                <li key={purchase.id}>
                                    <b>{purchase.ticker}</b>
                                    {' - '}
                                    ${purchase.amount.toFixed(2)}
                                    {' - '}
                                    {purchase.purchaseDate}
                                    <button
                                        type="button"
                                        onClick={() => removePurchase(purchase.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {loading && <p>Simulating...</p>}

                    {calculationError && (
                        <p role="alert">{calculationError}</p>
                    )}

                    {results.length > 0 && (
                        <section>
                            <h3>Simulation Results</h3>

                            <p>
                                Total invested: $
                                {results.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                            </p>

                            <p>
                                Current value: $
                                {results.reduce((sum, p) => sum + p.currentValue, 0).toFixed(2)}
                            </p>

                            <p>
                                Total gain/loss: $
                                {results.reduce((sum, p) => sum + p.gainLoss, 0).toFixed(2)}
                            </p>

                            <p>
                                Total return: {
                                    (
                                        results.reduce((sum, p) => sum + p.gainLoss, 0) /
                                        results.reduce((sum, p) => sum + p.amount, 0) *
                                        100
                                    ).toFixed(2)
                                }%
                            </p>

                            <ul>
                                {results.map(p => (
                                    <li key={p.id}>
                                        <b>{p.ticker}</b> — {p.shares.toFixed(4)} shares,
                                        current value ${p.currentValue.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                </>)}
        </section>
    )
}