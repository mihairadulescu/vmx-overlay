'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {QrReader} from 'react-qr-reader';

const CameraComponent = () => {
  const [data, setData] = useState('No result');
  let ws = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000/ws');
    ws = websocket

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (e) => {
      const message = e.data;
      console.log('onMessage', e);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    return () => {
      websocket.close();
    };
  }, []);


  const handleScan = useCallback((scannedData) => {
      console.log('SCANNING', ws);
      if (scannedData) {
       // setData(scannedData);
        // If WebSocket is connected then send the data
        try {
          if(ws) ws.send(scannedData);
  
         console.log('DATA RECEIVED data', scannedData);
        }
        catch (e){
          console.log('Error sending data', e);
        }
      }
  }, [ws]); 

  return (
    <div>
      <h1>Scan QR Code</h1>
      <QrReader
        delay={100}
        onResult={handleScan}
        style={{ width: '100%' }}
      />
      <p>Scanned Data: {data}</p>
    </div>
  );
};

export { CameraComponent };
