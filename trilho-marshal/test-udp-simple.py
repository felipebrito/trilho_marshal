#!/usr/bin/env python3
import socket
import time

def send_udp_data():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    print("Enviando dados UDP para localhost:8888")
    
    # Enviar apenas um valor para teste
    print("📡 Enviando UDP: 0.5")
    sock.sendto("0.5".encode(), ('localhost', 8888))
    time.sleep(1)
    
    print("📡 Enviando UDP: 0.8")
    sock.sendto("0.8".encode(), ('localhost', 8888))
    time.sleep(1)
    
    sock.close()
    print("✅ Teste concluído")

if __name__ == "__main__":
    send_udp_data()
