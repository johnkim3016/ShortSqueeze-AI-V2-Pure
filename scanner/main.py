import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import concurrent.futures
import time
import os
from tickers import get_all_tickers

app = FastAPI(title="US Stock Volume Surge Scanner")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 글로벌 상태 저장소
scan_status = {
    "is_scanning": False,
    "progress": 0,
    "total_tickers": 0,
    "current_index": 0,
    "last_update": None,
    "results": [],
    "stats": {
        "total": 0,
        "passed": 0,
        "avg_rvol": 0,
        "duration": 0
    }
}

def calculate_score(rvol, price_change, volume, close_price, high_52w):
    """
    점수 산정 로직 (0~100점)
    - RVOL 기여: 40점 (RVOL 5x = 만점)
    - 가격변화율 기여: 30점 (±5% = 만점)
    - 거래량 절대값 기여: 20점 (1000만주 = 만점)
    - 52주 고점 근접도 기여: 10점 (고점 내 5% = 만점)
    """
    # 1. RVOL (40점)
    rvol_score = min(40, (rvol / 5.0) * 40)
    
    # 2. 가격 변화율 (30점)
    change_score = min(30, (abs(price_change) / 5.0) * 30)
    
    # 3. 거래량 (20점)
    volume_score = min(20, (volume / 10_000_000) * 20)
    
    # 4. 52주 고점 (10점)
    dist_to_high = (high_52w - close_price) / high_52w if high_52w > 0 else 1.0
    high_score = min(10, max(0, (1.0 - (dist_to_high / 0.05)) * 10))
    
    return round(rvol_score + change_score + volume_score + high_score, 1)

def scan_ticker(ticker, squeeze_list):
    try:
        # 최근 30일 데이터 가져오기 (20일 평균 거래량 계산용)
        stock = yf.Ticker(ticker)
        hist = stock.history(period="30d")
        
        if hist.empty or len(hist) < 20:
            return None
            
        today = hist.iloc[-1]
        prev_close = hist.iloc[-2]['Close']
        
        current_price = today['Close']
        price_change = ((current_price - prev_close) / prev_close) * 100
        current_volume = today['Volume']
        
        # 20일 평균 거래량 (오늘 제외)
        avg_volume = hist.iloc[-21:-1]['Volume'].mean()
        
        # RVOL 계산 (오늘 현재까지의 가중치 적용 - 단순화해서 1.0으로 보거나 시간 반영)
        # 미국 시장 시간: 9:30 ~ 16:00 (390분)
        # 여기서는 단순화를 위해 오늘 전체 거래량을 20일 평균과 비교
        rvol = current_volume / avg_volume if avg_volume > 0 else 0
        
        # 필터링 조건
        # 1. 가격 > $5
        # 2. 절대 거래량 > 500,000
        # 3. 가격 변화율 > 1.5% or < -1.5%
        # 4. RVOL > 2.0 (실제 로직에는 포함되나 결과 테이블용으로만 남길 수도 있음)
        
        if current_price < 5 or current_volume < 500_000 or abs(price_change) < 1.5:
            return None
            
        # 52주 고점 가져오기 (FastAPI 성능을 위해 info보다는 history 1y 사용)
        hist_1y = stock.history(period="1y")
        high_52w = hist_1y['High'].max()
        
        score = calculate_score(rvol, price_change, current_volume, current_price, high_52w)
        
        return {
            "ticker": ticker,
            "name": ticker, # yfinance info는 느리므로 티커로 대체
            "price": round(current_price, 2),
            "change": round(price_change, 2),
            "rvol": round(rvol, 2),
            "volume": int(current_volume),
            "avg_volume": int(avg_volume),
            "score": score,
            "is_squeeze": ticker in squeeze_list
        }
    except Exception as e:
        # print(f"Error scanning {ticker}: {e}")
        return None

def run_scanner_task():
    global scan_status
    start_time = time.time()
    
    scan_status["is_scanning"] = True
    scan_status["progress"] = 0
    scan_status["results"] = []
    
    ticker_data = get_all_tickers()
    all_tickers = ticker_data["all"]
    squeeze_list = ticker_data["squeeze"]
    
    scan_status["total_tickers"] = len(all_tickers)
    
    results = []
    
    # 병렬 처리
    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
        future_to_ticker = {executor.submit(scan_ticker, t, squeeze_list): t for t in all_tickers}
        
        for i, future in enumerate(concurrent.futures.as_completed(future_to_ticker)):
            scan_status["current_index"] = i + 1
            scan_status["progress"] = int(((i + 1) / len(all_tickers)) * 100)
            
            res = future.result()
            if res:
                results.append(res)
    
    # 정렬 (점수 내림차순)
    results.sort(key=lambda x: x['score'], reverse=True)
    
    end_time = time.time()
    duration = end_time - start_time
    
    # 통계 업데이트
    scan_status["results"] = results
    scan_status["is_scanning"] = False
    scan_status["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    scan_status["stats"] = {
        "total": len(all_tickers),
        "passed": len(results),
        "avg_rvol": round(sum(r['rvol'] for r in results) / len(results), 2) if results else 0,
        "duration": round(duration, 1)
    }

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/scan")
async def start_scan(background_tasks: BackgroundTasks):
    if scan_status["is_scanning"]:
        return {"message": "이미 스캔이 진행 중입니다."}
    
    background_tasks.add_task(run_scanner_task)
    return {"message": "스캔이 시작되었습니다."}

@app.get("/api/status")
async def get_status():
    return {
        "is_scanning": scan_status["is_scanning"],
        "progress": scan_status["progress"],
        "current_index": scan_status["current_index"],
        "total_tickers": scan_status["total_tickers"],
        "last_update": scan_status["last_update"],
        "stats": scan_status["stats"]
    }

@app.get("/api/results")
async def get_results():
    # 프론트엔드가 기대하는 구조로 반환
    return {
        "results": scan_status["results"],
        "summary": {
            "total_scanned": scan_status["stats"]["total"],
            "passed_filters": scan_status["stats"]["passed"],
            "avg_rvol": scan_status["stats"]["avg_rvol"],
            "scan_time": scan_status["stats"]["duration"]
        },
        "timestamp": time.time() if scan_status["last_update"] else None
    }

@app.get("/api/progress")
@app.get("/api/status")
async def get_status():
    return {
        "status": "scanning" if scan_status["is_scanning"] else "idle",
        "progress": scan_status["progress"],
        "current_ticker": f"Ticker {scan_status['current_index']}/{scan_status['total_tickers']}" if scan_status["is_scanning"] else "",
        "last_update": scan_status["last_update"],
        "stats": scan_status["stats"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
