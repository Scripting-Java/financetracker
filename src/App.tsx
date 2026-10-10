import { useState } from 'react'
import type {SubmitEvent} from 'react'
import type {Stock} from './types/stock'
import { formatMarketCap, formatPrice, formatPercents } from './utils/formatters'
import { findPriceChange, findPercentChange } from './utils/priceChanges'
import HistoryTable from './components/HistoryTable'
import type { HistoryRecord, HistoryResponse } from './types/history'

function App() {
  const [ticker, setTicker] = useState('')
  const [stock, setStock] = useState<Stock | null>(null)
  const [error, setError] = useState<string|null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [historyError, setHistoryError] = useState<string|null>(null)

  async function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>){
    setError(null)
    event.preventDefault()

    const symbol = ticker.trim().toUpperCase()
    if(!symbol) {
      setStock(null)
      setError("Enter a stock ticker to search.")
      setHistory([])
      setHistoryError(null)
      return 
    }
 
    try {
      setStock(null)
      const response = await fetch(
        `http://127.0.0.1:8001/api/stock/${encodeURIComponent(symbol)}`
      )
     if (!response.ok){
      const result = await response.json()
      throw new Error(
        result.detail ?? `Request failed (${response.status})`
      )
     }

     const result: Stock = await response.json()
     setStock(result)
     await fetchHistory(symbol)
    }
    catch(error){
      setStock(null)

      if(error instanceof Error)
        setError(error.message)
      else
        setError("Something went wrong. Please try again.")
    }
  } 
  
  async function fetchHistory(symbol: string)
  {
    setHistory([])
    setHistoryError(null)

    try{
      const response = await fetch(
        `http://127.0.0.1:8001/api/stock/${encodeURIComponent(symbol)}/history?start=2026-10-01&end=2026-10-06&interval=1d`
      )

      const result: HistoryResponse = await response.json()

      if(!response.ok){
        throw new Error(
          (result as unknown as {detail?: string}).detail ??
          `Request failed (${response.status})`
        )
      }
    setHistory(result.data)
    }
    catch(error)
    {
      if(error instanceof Error)
        setHistoryError(error.message)
    
      else
        setHistoryError("Unable to load historical data.")
    }
  }

  return (
    <><h1> Finance Tracker</h1>
    <h2>Welcome to the Tracker</h2>
    <form onSubmit={handleSearchSubmit}>
        <label inputMode='text'>
          Search for a ticker
          <input type="text" name="Ticker" id="searchButton" value={ticker} onChange={(event)=>setTicker(event.target.value)} />
        </label>
        <button>Search</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {stock &&(
      <div>
        <p>Ticker: {stock.ticker}</p>
        <p>Name: {stock.name}</p>
        <p>Sector: {stock.sector}</p>
        <p>Price: {formatPrice(stock.price)}</p>
        <p>Previous Close: {formatPrice(stock.prevClose)}</p>
        <p>Market Cap: {formatMarketCap(stock.marketCap)}</p>
        <p>Year High: {formatPrice(stock.yearHigh)}</p>
        <p>Year Low: {formatPrice(stock.yearLow)}</p>
        <p>Price Change: {formatPrice(findPriceChange(stock.price, stock.prevClose))}</p>
        <p>Daily% Change: {formatPercents(findPercentChange(stock.price, stock.prevClose))}</p>
        {historyError && <p role='alert'>{historyError}</p>}

        {history.length>0&&(
          <section>
            <h2>Historical Data</h2>
            <HistoryTable records={history}></HistoryTable>
          </section>
        )}
      </div>
    )}
  </>) 
}

export default App 
