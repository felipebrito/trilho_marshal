#!/usr/bin/env python3
import socket
import time
import sys

def send_udp_data(port=8889):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    print(f"Enviando dados UDP para localhost:{port}")
    
    for i in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]:
        print(f"📡 Enviando UDP: {i}")
        sock.sendto(str(i).encode(), ('localhost', port))
        time.sleep(0.2)
    
    sock.close()
    print("✅ Teste concluído")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8889
    send_udp_data(port)
