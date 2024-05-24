"use client"
import React, { useState, useEffect } from 'react';
import { Person } from './person';  // Adjust the import path as needed
import './Person.css';  // Import the CSS file for animations

const WebSocketComponent = ({ wsUrl }) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [showPerson, setShowPerson] = useState(true);

  useEffect(() => {
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (e) => {
      const message = e.data;
      console.log('onMessage', e);
      setMessages((prevMessages) => [...prevMessages, message]);
      setShowPerson(true); // Show Person component when a message is received
      setTimeout(() => setShowPerson(false), 5000); // Hide after 5 seconds
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    return () => {
      websocket.close();
    };
  }, [wsUrl]);

  console.log('messages', messages);

  const person = {
    title: "Mr",
    name: "Mihai Radulescu",
    city: "Sibiu",
    country: "Romania"
  }

  return (
    <div className='bg-transparent'>
      <Person person={person} isVisible={showPerson} />
    </div>
  );
};

export default WebSocketComponent;
