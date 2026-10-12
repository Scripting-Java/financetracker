# FinanceTracker

**A simple, interactive tool for researching and tracking stock prices.**

FinanceTracker is a web application that lets you look up stocks, explore historical price data, and visualize market movements through interactive graphs and data tables. It combines a React(w/ Typescript) frontend with a Python(using FastAPI) backend to retreive and display historical stock information.

## Features

- **Stock Lookup** — Search for a stock using its ticker symbol.
- **Historical Price Data** — Retrieve historical stock prices for supported tickers.
- **Interactive Charts** — Visualize price movements with selectable chart views(Open price, Close price, Low price, High Price).
- **Readable Data Tables** — Browse historical market data in a structured table.
- **Incremental Loading** — Load additional rows as you explore historical records.
- **Web-Based Interface** — Access the application through a modern browser without installing a desktop application.
- **Line/Candle Graphs** - Access the type of graph you want.

## How to use it:
- **Search using a ticker** - Search for any valid ticker to retrieve that specific stock's data for the last weekday(usually the day of for weekdays and Friday, or last weekday with data provided, for weekends).
- **Save that stock to a watchlist** - Save that stock to a watchlist using your browser's local storage.
- **See how the stock has done** - Both line and candlestick graphs are available to visualize the stock's numerical performance over time. Available data includes open price, close price, high price for that day, and low price for that day.
- **Use the table** - Use the table for an easy to copy tabular format to store and track in spreadsheets or just to read as a written description of how a stock has done over time.
- **Use the simulator** - Use the simulator to simulate what would have happened if you bought stock X some time in the past(e.g. 3/14/2015). You can add multiple stocks to the simulator and each stock can have a different buy date. The simulator will tell you total gains/losses along with percentage change and shares of stock. 
- **Reset your data** - If you're done with searching or you want to clear all the data, press the reset button to clear your browser's local storage and free up resources. Some browsers automatically clear their local storage periodically to free up resources.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Stock Data | `yfinance` |
| Frontend Hosting | GitHub Pages |
| Backend Hosting | Render |

## Live Demo

**Frontend:** https://scripting-java.github.io/financetracker/

The frontend communicates with the hosted FastAPI backend to retrieve stock data.

## Getting Started

### Prerequisites

Install the following tools before running the project locally:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Scripting-Java/financetracker.git
cd financetracker
```

### 2. Start the Backend

Open a terminal in the project directory.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

The backend should now be available at:

- **API:** http://YourIP:8001
- **Interactive API documentation:** http://YourIP:8001/docs

Keep this terminal running.

### 3. Start the Frontend

Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

The frontend must be configured to communicate with the local backend at `http://YourIP:8001`. 
Sometimes, the default port might not be 5173, especially if you have other node processes running.

## Project Structure

```text
financetracker/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

This is subject to change.

## Deployment

FinanceTracker uses separate hosting for its frontend and backend:

- **Frontend:** Built with Vite and deployed to GitHub Pages.
- **Backend:** Runs as a FastAPI service on Render.

GitHub Pages hosts the static frontend; it does not run the Python backend.

## Data and Limitations

- Stock data availability depends on the data provider(yfinanceAPI).
- Historical data may be delayed, incomplete, or unavailable for certain tickers.
- Backend availability and response times depend on the hosting service(Render's free plan limitations).
- FinanceTracker is intended for informational and research purposes. It does not execute trades or provide personalized financial advice.
- Stock market data and calculations should be independently verified before being used in financial decisions. The data is sourced as accurately as possible from yfinance's API, but this project does not gurantee the source's validity.




This project is built as a simple, browser-based tool for exploring stock market data for HackClub Terra!
