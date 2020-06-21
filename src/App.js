import React, { useState } from 'react';
import Map from './components/Map';
import PlaceSearch from './components/PlaceSearch';
import './App.css';

import { useLoadScript } from '@react-google-maps/api';
import { DatePicker, TimePicker, Checkbox, InputNumber, Slider, Button } from 'antd';
import moment from 'moment';

const libraries = ['places']

function App() {
    const [origin, setOrigin] = useState('Origin');
    const [destination, setDestination] = useState('Destination');
    const [geocodeOrigin, setGeocodeOrigin] = useState({});
    const [geocodeDestination, setGeocodeDestination] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [luggage, setLuggage] = useState(false);
    const [seatingCapacity, setSeatingCapacity] = useState('1');
    const [price, setPrice] = useState([30, 500]);
  
    // ------------- required google places setting -----------
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
  
    if(loadError) return 'Error loading maps';
    if(!isLoaded) return 'Loading Maps';
  
    const getOrigin = (ref) => {
      console.log('ref origin', ref)
      if (ref) {
        setGeocodeOrigin(ref);
      }
    }
  
    const getDestination = (ref) => {
      console.log('ref Destination', ref)
      if(ref) {
        setGeocodeDestination(ref);
      }
    }
  
    // --------------  input function  --------------------------
    function onDateChange(date, dateString) {
      console.log(date, dateString);
      setDate(dateString);
    }
  
    function onTimeChange(time, timeString) {
      console.log(time, timeString);
      setTime(timeString)
    }
  
    function onLuggageChange(e) {
      console.log(`checked = ${e.target.checked}`);
      setLuggage(e.target.checked)
    }
  
    function onSeatingChange(value) {
      console.log('seating', value);
      setSeatingCapacity(value)
    }
  
    const onMinPriceChange = value => {
      if (isNaN(value)) {
        return;
      }
      if(value < price[1]) {
        setPrice([value, price[1]]);
      }
    };
  
    const onMaxPriceChange = value => {
      if (isNaN(value)) {
        return;
      }
      if(value > price[0]) {
        setPrice([price[0], value])
      }
    };
  
    const onAfterPriceChange = value => {
      setPrice(value);
    }
  
    const getRoute = () => {
      if (origin !== '' && destination !== '') {
        setOrigin(origin);
        setDestination(destination);
      }
    };
  
  
    return (
      <div className='route'>
        <h2>Google Map Direction API</h2>
        <PlaceSearch place={origin} setPlace={setOrigin} getPlace={getOrigin} />
        <PlaceSearch place={destination} setPlace={setDestination} getPlace={getDestination} />
  
        <div className='route__datetime'>
          <DatePicker onChange={onDateChange} format={'Do MMMM YYYY, dddd'} />
          <TimePicker onChange={onTimeChange} defaultValue={moment('00:00:00', 'HH:mm:ss')} />
        </div>
  
        <InputNumber min={1} max={13} defaultValue={1} onChange={onSeatingChange} />
        <Checkbox onChange={onLuggageChange}>Luggage</Checkbox>
  
        {/* Price Range Slider & inputNumber */}
        <div>
          <Slider 
            range 
            defaultValue={[30, 500]} 
            value={
              [ 
                typeof price[0] === 'number' ? price[0] : 0, 
                typeof price[1] === 'number' ? price[1] : 0 
              ]
            }
            min={0} 
            max={1000} 
            onChange={onAfterPriceChange}
          />
          <InputNumber
            min={0}
            max={1000}
            style={{ margin: '0 16px' }}
            step={10.00}
            value={price[0]}
            onChange={onMinPriceChange}
          />
          <InputNumber
            min={0}
            max={1000}
            style={{ margin: '0 16px' }}
            step={10.00}
            value={price[1]}
            onChange={onMaxPriceChange}
          />
        </div>
  
        <Button type="primary" onClick={getRoute}>Post</Button>
            {console.log('ori des', origin, destination)}
            {console.log('geo ori des', geocodeOrigin, geocodeDestination)}
        <Map 
          origin={origin} 
          destination={destination}
        />
      </div>
    )
  }


export default App;
