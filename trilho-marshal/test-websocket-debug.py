#!/usr/bin/env python3
import socket
import time
import json

def test_websocket_connection():
    """Testa se o WebSocket está funcionando"""
    try:
        import websocket
        ws = websocket.create_connection("ws://localhost:8081")
        print("✅ WebSocket conectado com sucesso")
        
        # Aguardar mensagem
        result = ws.recv()
        print(f"📨 Mensagem recebida: {result}")
        
        ws.close()
        print("✅ Conexão WebSocket fechada")
        return True
    except Exception as e:
        print(f"❌ Erro ao conectar WebSocket: {e}")
        return False

def test_udp_server():
    """Testa se o servidor UDP está funcionando"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        print("📡 Enviando dados UDP para localhost:8888")
        sock.sendto("0.5".encode(), ('localhost', 8888))
        time.sleep(0.5)
        sock.close()
        print("✅ Dados UDP enviados")
        return True
    except Exception as e:
        print(f"❌ Erro ao enviar UDP: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testando conexões...")
    print("\n1. Testando WebSocket:")
    websocket_ok = test_websocket_connection()
    
    print("\n2. Testando UDP:")
    udp_ok = test_udp_server()
    
    print(f"\n📊 Resultado: WebSocket={'✅' if websocket_ok else '❌'}, UDP={'✅' if udp_ok else '❌'}")
