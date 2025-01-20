import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: 41.0082,
  lng: 28.9784
};

export const MapContainer = () => {
  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey="AIzaSyBH8xdBQGQ6TJMTz8MuD63-C5--bMCLC40">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
        </GoogleMap>
      </LoadScript>
    </div>
  );
}; 