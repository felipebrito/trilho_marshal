#!/usr/bin/env python3
import websocket
import json
import time

def on_message(ws, message):
    data = json.loads(message)
    print(f"📨 WebSocket recebido: {data}")

def on_error(ws, error):
    print(f"❌ Erro WebSocket: {error}")

def on_close(ws, close_status_code, close_msg):
    print("🔌 WebSocket fechado")

def on_open(ws):
    print("✅ WebSocket conectado")

if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://localhost:8081",
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)
    
    print("Conectando ao WebSocket...")
    ws.run_forever()
