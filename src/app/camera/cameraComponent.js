'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

const CameraComponent = () => {
  const [data, setData] = useState('No result');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket('wss://geke.hermannstadtpfarrkirche.online/ws');

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
      };

      ws.current.onmessage = (e) => {
        const message = e.data;
        console.log('onMessage', e);
        // Handle incoming messages if needed
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error: ', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        // Try to reconnect after a delay
        setTimeout(() => {
          connectWebSocket();
        }, 400); // Reconnect after 3 seconds
      };
    };

    connectWebSocket();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page is visible');
        if (!isConnected) {
          console.log('Attempting to reconnect WebSocket');
          connectWebSocket();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected]);

  const handleScan = useCallback((scannedData) => {
    if (scannedData) {
      try {
        const jsonData = JSON.parse(scannedData.text);
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(jsonData));
          setData(JSON.stringify(jsonData, null, 2));
          console.log('Data sent:', jsonData);
        } else {
          console.log('WebSocket is not open');
        }
      } catch (e) {
        console.log('Error sending data', e);
      }
    }
  }, []);

  return (
    <div>
      <h1>Scan QR Code</h1>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        delay={300}
        onResult={(result) => {
          if (result) {
            handleScan(result);
          }
        }}
        style={{ width: '100%' }}
      />
      <pre>Scanned Data: {data}</pre>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
};

export { CameraComponent };
