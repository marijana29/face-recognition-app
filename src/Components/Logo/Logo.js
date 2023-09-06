import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
		<Tilt className='Tilt br2 shadow-2 h4 w4' options={{ max: 35 }}>
      <div className='Tilt-inner pa3'>
        <img style={{paddingTop: '3px'}}alt='logo' src={brain}/>
      </div>
    </Tilt>
		</div>
		);
}

export default Logo;