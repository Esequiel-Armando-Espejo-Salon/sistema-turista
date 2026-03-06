import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = { lat: 32.5149, lng: -117.0382 };

function Home() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (loadError) return <div>Error loading maps: Check your API key and permissions.</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
      >
        <Marker position={center} title="iVisit Tijuana" />
      </GoogleMap>
      
      {}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 300, 
        background: 'white', 
        padding: '15px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1 
      }}>
        <h2 style={{ margin: 0, color: '#6a1b9a' }}>iVisit - Tourist</h2>
        <p>Exploring Tijuana</p>
      </div>
    </div>
  );
}

export default Home;