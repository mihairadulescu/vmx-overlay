"use client"
import React, { useEffect, useState } from 'react';
import './Person.css';  // Import the CSS file for animations

export const Person = ({ person, isVisible }) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 1000); // Duration should match the slide-out animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    visible && (
      <div className={`person-container ${isVisible ? 'slideIn' : 'slideOut'}`}>
        <p style={nameStyle}>{`${person.title} ${person.firstName} ${person.lastName}`}</p>
        <p style={locationStyle}>{`${person.city}, ${person.country}`}</p>
      </div>
    )
  );
};

const nameStyle = {
  margin: 0,
  padding: 0,
  fontSize: '26px',  // Increased font size for readability
  fontWeight: 'bold',
  textAlign: 'left',
  width: '100%'
};

const locationStyle = {
  margin: 0,
  padding: 0,
  fontSize: '24px',  // Increased font size for readability
  textAlign: 'left',
  width: '100%'
};

export default Person;
