'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

// Function to set up WebSocket event handlers
const setupWebSocketHandlers = (ws, setIsConnected) => {
  ws.current.onopen = () => {
    console.log('WebSocket Connected');
    setIsConnected(true);
  };

  ws.current.onmessage = (e) => {
    console.log('onMessage', e);
    // Handle incoming messages if needed
  };

  ws.current.onerror = (error) => {
    console.error('WebSocket Error: ', error);
  };

  ws.current.onclose = () => {
    console.log('WebSocket Disconnected');
    setIsConnected(false);
    // Attempt to reconnect if the connection is closed
    setTimeout(() => {
      if (ws.current.readyState !== WebSocket.OPEN && ws.current.readyState !== WebSocket.CONNECTING) {
        ws.current = new WebSocket('wss://geke.hermannstadtpfarrkirche.online/ws');
        setupWebSocketHandlers(ws, setIsConnected);
      }
    }, 300); // Reconnect after 300ms
  };
};

const CameraComponent = () => {
  const [data, setData] = useState('No result');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(new WebSocket('wss://geke.hermannstadtpfarrkirche.online/ws'));

  // Initialize WebSocket on component mount
  useEffect(() => { 
    setupWebSocketHandlers(ws, setIsConnected);

    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page is visible');
        alert('Reconnected');
        if (ws.current.readyState !== WebSocket.OPEN) {
          console.log('Reconnecting WebSocket due to visibility change');
          ws.current = new WebSocket('wss://geke.hermannstadtpfarrkirche.online/ws');
          setupWebSocketHandlers(ws, setIsConnected);
        }
      }
    };

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
        console.log('Error parsing or sending data', e);
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
