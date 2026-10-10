from fastapi import FastAPI, HTTPException
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
        if data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No market data found for ticker '{symbol}'. Check the ticker and try again"
        )
    except HTTPException:
        raise HTTPException
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Some other error occurred. This could mean the data provider is temporarily unavailable. Please try again."
        )
    info = stock.info
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
