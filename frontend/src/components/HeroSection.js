import React, { useState, useEffect } from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import {useLocation } from 'react-router-dom';


function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, [location]);

  return (
    <div className='hero-container'>
      {/*<video src='/videos/video-1.mp4' autoPlay loop muted />*/} 
      <p>What are you waiting for?</p>
      <div className='hero-btns'>
        {!isAuthenticated && (

        
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        )}
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
        >
          WATCH TRAILER <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;