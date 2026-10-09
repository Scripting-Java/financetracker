import { useState } from 'react'
import type {SubmitEvent} from 'react'
import type {Stock} from './types/stock'
import { formatMarketCap, formatPrice } from './utils/formatters'

function App() {
  const [ticker, setTicker] = useState('')
  const [stock, setStock] = useState<Stock | null>(null)


  async function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>){
    event.preventDefault()

    const symbol = ticker.trim().toUpperCase()
    if(!symbol) return
 
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/stock/${encodeURIComponent(symbol)}`
      )
     if (!response.ok){
      throw new Error('Stock request failed')
     }

     const result: Stock = await response.json()
     setStock(result)
    }
    catch(error){
      console.error("Could not load stock data")
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
      </div>
    )}
  </>)
}

export default App 
