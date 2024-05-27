'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

const CameraComponent = () => {
  const [data, setData] = useState('No result');
  const ws = useRef(null); // Use useRef to keep the WebSocket reference

  useEffect(() => {
    ws.current = new WebSocket('ws://http://geke.hermannstadtpfarrkirche.online/ws');

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (e) => {
      const message = e.data;
      console.log('onMessage', e);
      // Assuming you have a setMessages function to update messages
      // setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleScan = useCallback((scannedData) => {
    if (scannedData) {
      try {
        const jsonData = JSON.parse(scannedData.text); // Access the `text` property of the scanned data
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(jsonData));
          setData(JSON.stringify(jsonData, null, 2)); // Convert JSON object to string for display
          console.log('DATA RECEIVED data', jsonData);
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
        delay={300}
        onResult={(result) => {
          if (result) {
            handleScan(result);
          }
        }}
        style={{ width: '100%' }}
      />
      <pre>Scanned Data: {data}</pre> {/* Use <pre> to display JSON nicely */}
    </div>
  );
};

export { CameraComponent };
