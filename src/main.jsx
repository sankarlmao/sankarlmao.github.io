import React from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard/Lanyard';
import PixelTrail from './components/PixelTrail/PixelTrail';

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

const trailRoot = document.getElementById('pixel-trail-root');
if (trailRoot) {
  ReactDOM.createRoot(trailRoot).render(
    <PixelTrail
      gridSize={46}
      trailSize={0.23}
      maxAge={450}
      interpolate={2.8}
      color="#d4a24e"
      gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
    />
  );
}
