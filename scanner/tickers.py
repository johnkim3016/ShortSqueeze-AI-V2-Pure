import json
import os

# 캐시 파일 경로
CACHE_FILE = "ticker_cache.json"

def get_sp500_tickers():
    # Wikipedia 스크래핑 문제 해결 전까지 안정적인 우량주 리스트 제공
    return [
        "AAPL", "MSFT", "GOOGL", "AMZN", "META", "BRK-B", "UNH", "JNJ", "XOM", "JPM",
        "TSLA", "V", "PG", "NVDA", "HD", "MA", "CVX", "ABBV", "LLY", "PEP",
        "BAC", "KO", "PFE", "TMO", "COST", "AVGO", "DIS", "ADBE", "WMT", "CSCO",
        "CRM", "ORCL", "ACN", "ABT", "DHR", "LIN", "VZ", "NEE", "TXN", "PM",
        "WFC", "MS", "RTX", "HON", "AMGN", "COP", "LOW", "NKE", "IBM", "T"
    ]

def get_nasdaq100_tickers():
    return [
        "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "PEP", "AVGO", "COST",
        "CSCO", "ADBE", "CMCSA", "TXN", "QCOM", "AMGN", "INTC", "HON", "INTU", "SBUX",
        "AMD", "AMAT", "ISRG", "MDLZ", "GILD", "BKNG", "ADI", "VRTX", "ADP", "REGN"
    ]

def get_squeeze_tickers():
    return ["GME", "AMC", "SPCE", "BB", "NKLA", "CVNA", "UPST", "AI", "SOUN", "CAR", "MARA", "RIOT", "COIN"]

def get_all_tickers():
    # 실제 운영 시에는 여기에 위키피디아 스크래핑 로직을 다시 활성화할 수 있습니다.
    sp500 = get_sp500_tickers()
    nasdaq100 = get_nasdaq100_tickers()
    squeeze = get_squeeze_tickers()
    
    all_tickers = sorted(list(set(sp500 + nasdaq100 + squeeze)))
    
    data = {
        "sp500": sp500,
        "nasdaq100": nasdaq100,
        "squeeze": squeeze,
        "all": all_tickers
    }
    
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    return data

if __name__ == "__main__":
    data = get_all_tickers()
    print(f"Total Unique Tickers: {len(data['all'])}")
    print(f"Sample Tickers: {data['all'][:10]}")
