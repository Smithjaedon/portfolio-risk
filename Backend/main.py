from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import requests

app = FastAPI()

app.add_middleware(
  CORSMiddleware, allow_origins=['http://localhost:5173'],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get('/price/{symbol}')
def get_price(symbol: str):
  try:
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d")
    if data.empty:
      return {"error": "Symbol not found"}
    current_price = data['Close'].iloc[-1]
    return {"symbol": symbol, "price": round(float(current_price),2)}
  except Exception as e:
    return {"error": str(e)}


@app.get('/stocks/{query}')
def get_stocks(query: str):
    try:
        res = requests.get(f'https://query1.finance.yahoo.com/v1/finance/search?q={query}')
        res.raise_for_status()
        data = res.json()

        quotes = data.get('quotes', [])
        stocks = [
            {
                'symbol': quote.get('symbol'),
                'name': quote.get('shortname') or quote.get('longname') or 'N/A',
                'price': get_price_sync(quote.get('symbol', '')),
                'exchange': quote.get('exchange')
            }
            for quote in quotes
        ]

        return {'stocks': stocks}

    except requests.exceptions.HTTPError as err:
        return {"error": f"HTTP error occurred: {err}"}
    except Exception as e:
        return {"error": f"Other error: {e}"}

def get_price_sync(symbol: str):
    """Helper function to get price and return just the price value"""
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")
        if data.empty:
            return 0
        current_price = data['Close'].iloc[-1]
        return round(float(current_price), 2)
    except Exception as e:
        return 0

