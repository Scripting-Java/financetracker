import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { Stock } from './types/stock'
import { formatMarketCap, formatPrice, formatPercents } from './utils/formatters'
import { findPriceChange, findPercentChange } from './utils/priceChanges'
import HistoryTable from './components/HistoryTable'
import type { HistoryRecord, HistoryResponse } from './types/history'
import DateRangePicker from './components/DateRangePicker'
import HistoryChart from './components/HistoryChart'
import { useEffect } from 'react'
import CandleChart from './components/CandleChart'
import Watchlist from './components/Watchlist'
import Simulator from './components/Simulator'

function getMostRecentWeekday(): string {
  const date = new Date()
  const day = date.getDay()
  if (day === 0)
    date.setDate(date.getDate() - 2)
  if (day === 6)
    date.setDate(date.getDate() - 1)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const dayOfMonth = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${dayOfMonth}`;
}


function App() {
  const [ticker, setTicker] = useState('')
  const [stock, setStock] = useState<Stock | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState(getMostRecentWeekday)
  const [endDate, setEndDate] = useState(getMostRecentWeekday)
  const [interval, setInterval] = useState('1d')
  const [chartType, setChartType] = useState<'line' | 'candle'>('line')
  const [watchlist, setWatchlist] = useState<string[]>(()=>{
    try{
      const saved = localStorage.getItem('financeTrackerWatchlist')
      return saved? JSON.parse(saved) as string[] : []
    }catch{
      return []
    }
  })

  function saveWatchlist(next: string[]){
    setWatchlist(next)
    localStorage.setItem('financeTrackerWatchlist', JSON.stringify(next))
  }

  function addTicker(symbol:string){
    if(watchlist.includes(symbol)) return
    saveWatchlist([...watchlist, symbol])
  }

  function removeTicker(symbol: string){
    saveWatchlist(watchlist.filter((ticker)=> ticker !== symbol))
  }

  async function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>) {
    setError(null)
    event.preventDefault()

    const symbol = ticker.trim().toUpperCase()
    if (!symbol) {
      setStock(null)
      setError("Enter a stock ticker to search.")
      setHistory([])
      setHistoryError(null)
      return
    }
    if (startDate > endDate) {
      setError("End date must be on or after start date")
      return
    }
    await searchTicker(symbol)
    
  }

  function selectTicker(symbol:string){
    setTicker(symbol)
    void searchTicker(symbol)
  }

  async function searchTicker(symbol: string){
    setError(null)
    try {
      setStock(null)
      const response = await fetch(
        `http://127.0.0.1:8001/api/stock/${encodeURIComponent(symbol)}`
      )
      if (!response.ok) {
        const result = await response.json()
        throw new Error(
          result.detail ?? `Request failed (${response.status})`
        )
      }

      const result: Stock = await response.json()
      setStock(result)
    }
    catch (error) {
      setStock(null)

      if (error instanceof Error)
        setError(error.message)
      else
        setError("Something went wrong. Please try again.")
    }
  }

  async function fetchHistory(symbol: string, start: string, end: string, selectedInterval: string) {
    setHistory([])
    setHistoryError(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/stock/${encodeURIComponent(symbol)}/history?start=${start}&end=${end}&interval=${selectedInterval}`
      )

      const result: HistoryResponse = await response.json()

      if (!response.ok) {
        throw new Error(
          (result as unknown as { detail?: string }).detail ??
          `Request failed (${response.status})`
        )
      }
      setHistory(result.data)
    }
    catch (error) {
      if (error instanceof Error)
        setHistoryError(error.message)

      else
        setHistoryError("Unable to load historical data.")
    }
  }

  useEffect(()=> {
    if(!stock) return
    if(interval !=='1d'){
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth()+1).padStart(2,'0')
      const day = String(today.getDate()).padStart(2,'0')
      const todayString = `${year}-${month}-${day}`

      setStartDate(todayString)
      setEndDate(todayString)

      void fetchHistory(stock.ticker, todayString, todayString, interval)
    }
    else{
      void fetchHistory(stock.ticker, startDate, endDate, interval)
    }
  }, [interval,stock])

  async function handleRefreshHistory() {
    if (!stock) return
    if (startDate > endDate) {
      setHistoryError('End date must be on or after your start date.')
      return
    }

    await fetchHistory(stock.ticker, startDate, endDate, interval)
  }

  function reset(){
    localStorage.removeItem('financeTrackerWatchlist')
    localStorage.removeItem('financeTrackerPurchases')
    window.location.reload()
  }

  
  return (
    <><h1> Finance Tracker
    <button type = "button" onClick={reset}>
      Reset All Data!
    </button>
    </h1>
      <form onSubmit={handleSearchSubmit}>
        <label inputMode='text'>
          Search for a ticker
          <input type="text" name="Ticker" id="searchButton" value={ticker} onChange={(event) => setTicker(event.target.value)} />
        </label>
        <button>Search</button>
      </form>
      <Watchlist
      tickers={watchlist}
      onAdd={addTicker}
      onRemove={removeTicker}
      onSelect={selectTicker}
      />
      <Simulator />
      {error && <p role="alert">{error}</p>}
      {stock && (
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

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          >
          </DateRangePicker>

            <section>
              <h2>Historical Data</h2>
              <label>
                Chart Type:
                <select
                  value={chartType}
                  onChange={(event) => setChartType(event.target.value as 'line' | 'candle')}
                >
                  <option value="line">Line</option>
                  <option value="candle">Candlestick</option>
                </select>
              </label>
              <label>
                Interval
                <select
                  value={interval}
                  onChange={(event) => setInterval(event.target.value)}
                >
                  <option value="1d">Daily</option>
                  <option value="1m">Every Minute</option>
                  <option value="5m">Every 5 Minutes</option>
                  <option value="15m">Every 15 Minutes</option>
                </select>
              </label>
              <button type='button' onClick={handleRefreshHistory}>
                Refresh
              </button>
              {chartType === 'line'?(
                <HistoryChart records={history} />
              ):(
                <CandleChart records = {history} />
              )}
              <HistoryTable records={history}></HistoryTable>
            </section>
        </div>
      )}
    </>)
}

export default App 
