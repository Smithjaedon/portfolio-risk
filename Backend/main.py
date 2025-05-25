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
    return {"symbol": symbol, "price": round(float(current_price), 2)}
  except Exception as e:
    return {"error": str(e)}