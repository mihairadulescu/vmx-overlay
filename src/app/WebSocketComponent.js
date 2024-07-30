"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Person } from './person';  // Adjust the import path as needed
import './person.css';  // Import the CSS file for animations

const WebSocketComponent = ({ wsUrl }) => {
  const [messages, setMessages] = useState([]);
  const [showPerson, setShowPerson] = useState(false);
  const [person, setPerson] = useState(null);
  const ws = useRef(null); // Start with a null value

  const setupWebSocketHandlers = (websocket) => {
    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (e) => {
      console.log('onMessage', e);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const message = JSON.parse(reader.result);

          setShowPerson(false);

          setTimeout(() => {
            setPerson(message);
            setShowPerson(true);
          }, 1000);
          
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(e.data);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(() => {
        if (websocket.readyState !== WebSocket.OPEN && websocket.readyState !== WebSocket.CONNECTING) {
          ws.current = new WebSocket(wsUrl);
          setupWebSocketHandlers(ws.current);
        }
      }, 300); // Reconnect after 300ms
    };
  };

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(wsUrl);
      setupWebSocketHandlers(ws.current);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page is visible');
        if (ws.current.readyState !== WebSocket.OPEN) {
          console.log('Reconnecting WebSocket due to visibility change');
          ws.current = new WebSocket(wsUrl);
          setupWebSocketHandlers(ws.current);
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
  }, [wsUrl]);



  return (
    <div className='bg-transparent'>
      {person && <Person person={person} isVisible={showPerson} />}
    </div>
  );
};

export default WebSocketComponent;
