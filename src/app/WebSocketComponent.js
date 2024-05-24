"use client"
import React, { useState, useEffect } from 'react';
import { Person } from './person';  // Adjust the import path as needed
import './person.css';  // Import the CSS file for animations

const WebSocketComponent = ({ wsUrl }) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [showPerson, setShowPerson] = useState(false);
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (e) => {
      console.log('onMessage', e);

      // Read the Blob and convert it to a string
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const message = JSON.parse(reader.result);

          // Trigger fade-out before updating the person data
          setShowPerson(false);

          // Wait for the fade-out animation to complete
          setTimeout(() => {
            setPerson(message); // Update the person data with the received message
            setShowPerson(true); // Show Person component with the new data
          }, 1000); // Match this duration with the fade-out duration
          
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

    return () => {
      websocket.close();
    };
  }, [wsUrl]);

  console.log('messages', messages);

  return (
    <div className='bg-transparent'>
      {person && <Person person={person} isVisible={showPerson} />}
    </div>
  );
};

export default WebSocketComponent;
