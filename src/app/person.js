"use client"
import React, { useEffect, useState } from 'react';
import './Person.css';  // Import the CSS file for animations

export const Person = ({ person, isVisible }) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 1000); // Duration should match the fade-out animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    visible && (
      <div style={{ ...personStyle, animation: `${isVisible ? 'fadeIn' : 'fadeOut'} 1s` }}>
        <p style={nameStyle}>{`${person.title} ${person.name}`}</p>
        <p style={locationStyle}>{`${person.city}, ${person.country}`}</p>
      </div>
    )
  );
};

const personStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: '10%',
  backgroundColor: 'rgb(64, 92, 121)',
  color: 'white',
  padding: '10px',
  fontSize: '18px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // Align items to the left
  justifyContent: 'center',
};

const nameStyle = {
  margin: 0,
  padding: 0,
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'left',
  width: '100%'
};

const locationStyle = {
  margin: 0,
  padding: 0,
  fontSize: '18px',
  textAlign: 'left',
  width: '100%'
};

export default Person;
