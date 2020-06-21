import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import PlaceSearch from './PlaceSearch';

const libraries = ['places']
const containerStyle = {
  width: '40vw',
  height: '40vh'
};

function Map(props) {

  const { origin, destination } = props;
  const [response, setResponse] = useState(null);

  const center = {
    lat: 13.7563,
    lng: 100.5018
  };
  
  const options = {
    // styles: mapStyle,
    disableDefaultUI: true
  }

  const mapRef = useRef();
  const onMapLoad = useCallback(map => {
    mapRef.current = map;
  }, []);


  const directionsCallback = (response) => {
    console.log('callback response', response)
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(() => response)
      } else {
        console.log('response: ', response);
      }
    }
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        options={options}
        onLoad={onMapLoad}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>
          {destination !== '' && origin !== '' && (
            <DirectionsService 
              options={{
                origin,
                destination,
                travelMode: 'DRIVING'
              }}
              callback={directionsCallback}
            />
          )}

          {response !== null && (
            <DirectionsRenderer 
              options={{
                directions: response
              }}
            />
          )}
        </>
      </GoogleMap>
    </div>
  );
}


export default Map;