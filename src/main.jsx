import React from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard/Lanyard';

import cardFront from '../assets/card-front.png';
import cardBack from '../assets/card-back.png';
import lanyardBand from '../assets/lanyard-band.png';

const rootElement = document.getElementById('lanyard-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Lanyard 
      position={[0, 0, 20]} 
      gravity={[0, -40, 0]} 
      frontImage={cardFront} 
      backImage={cardBack} 
      lanyardImage={lanyardBand}
      lanyardWidth={0.25}
    />
  );
}
