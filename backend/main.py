from fastapi import FastAPI, HTTPException, Query
from datetime import date, datetime, timedelta
import yfinance as yf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/api/stock/{ticker}")
def get_stock(ticker: str):

    symbol = ticker.upper()
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period = "1d")
        info = stock.info
        if data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No market data found for ticker '{symbol}'. Check the ticker and try again"
            )
    except HTTPException:
        raise 
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Some other error occurred. This could mean the data provider is temporarily unavailable. Please try again."
        )
    name = info.get("longName", "Unknown") 
    sector = info.get("sector", "Unknown")
    price = float(data["Close"].iloc[-1])
    prevClose = info.get("previousClose", None)
    marketCap = info.get("marketCap", None)
    yearHigh = info.get("fiftyTwoWeekHigh", None)
    yearLow = info.get("fiftyTwoWeekLow", None)
    


    return{
        "ticker": symbol,
        "price": price,
        "name": name, 
        "sector": sector,
        "prevClose": prevClose, 
        "marketCap": marketCap,
        "yearHigh": yearHigh,
        "yearLow": yearLow,
    }

@app.get("/api/stock/{ticker}/history")
def get_stock_history(
    ticker: str,
    start: date = Query(..., description= "Start Date, YYYY-MM-DD"),
    end: date = Query(..., description= "End Date, YYYY-MM-DD"),
    interval: str = Query("1d", description="1d, 1m, 5m, or 15m")
):

    symbol = ticker.upper()
    intervals = {"1d", "1m", "5m", "15m"}

    if interval not in intervals:
        raise HTTPException(
            status_code=400,
            detail=f"Interval must be one of: {','.join(sorted(intervals))}"
        )

    if start>end:
        raise HTTPException(
            status_code=400,
            detail="Start date must be on or before the end date."
        )
    if interval != "1d" and start != end:
        raise HTTPException(
            status_code=400,
            detail="Intraday requests must be made for the same day. They must use the same start date and end date."
        )

    if interval !="1d":
        from zoneinfo import ZoneInfo
        today = datetime.now(ZoneInfo("America/New_York")).date()
        if start != today:
            raise HTTPException(
                status_code=400,
                detail="Intraday data is only available for today's markets."
            )
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(
            start = start.isoformat(),
            end = (end + timedelta(days=1)).isoformat(),
            interval = interval,
            auto_adjust=False
        )

        if data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for ticker '{symbol}' for the requested dates."
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="The request for past archived data failed Please try again."
        )

    records =[]

    for timestamp, row in data.iterrows():
        if row["Open"] != row["Open"]:
            open_price = None
        else:
            open_price= float(row["Open"])
        
        if row["High"] != row["High"]:
            high_price = None
        else:
            high_price = float(row["High"])
        
        if row["Low"] != row["Low"]:
            low_price = None
        else:
            low_price = float(row["Low"])
        
        if row["Close"] != row["Close"]:
            close_price = None
        else:
            close_price = float(row["Close"])
          
        if "Adj Close" not in data.columns:
            adjusted_close = None
        elif row["Adj Close"] != row["Adj Close"]:
            adjusted_close = None 
        else:
            adjusted_close = float(row["Adj Close"])
        
        if row["Volume"] != row["Volume"]:
            volume = None
        else:
            volume = int(row["Volume"])
        records.append({
             "date": timestamp.isoformat(),
             "open": open_price,
             "high": high_price,
             "low": low_price,
             "close": close_price,
            "adjustedClose": adjusted_close,
            "volume": volume
        })
    
    return{
        "ticker": symbol,
        "interval": interval,
        "start": start.isoformat(),
        "end": end.isoformat(),
        "count": len(records),
        "data": records
    }        
