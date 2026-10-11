import { useState } from "react";
import type { FormEvent } from "react";

interface WatchlistProps {
    tickers: string[]
    onSelect: (ticker: string) => void
    onRemove: (ticker: string) => void
    onAdd: (ticker: string) => void
}

export default function Watchlist({tickers, onSelect, onRemove, onAdd}: WatchlistProps) {
    const [newTicker, setNewTicker] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    function handleAdd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const symbol = newTicker.trim().toUpperCase()

        if (!symbol) return

        onAdd(symbol)
        setNewTicker('')
    }

    return (
        <section>
            <button
            type="button"
            className="watchlist-toggle"
            onClick={()=>setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            >
                Watchlist {isOpen? '▲': '▼'}
            </button>
            {isOpen&&(<>

            <form onSubmit={handleAdd}>
                <label>
                    Add Ticker
                    <input 
                    value={newTicker}
                    onChange={(event)=>setNewTicker(event.target.value)}
                    placeholder = "AAPL"
                    />
                </label>
                <button type="submit">+</button>
            </form>
            {tickers.length ===0?(
                <p>There are no stocks in your Watchlist</p>
        ):(
            <ul>
                {tickers.map((symbol)=>(
                    <li key={symbol}>
                        <button type="button" onClick={()=>onSelect(symbol)}>
                            {symbol}
                        </button>
                        <button type ="button" onClick={()=> onRemove(symbol)}>
                            -
                        </button>
                    </li>
                ))}
            </ul>
        )} 
        </>)}
        </section>

    )
}