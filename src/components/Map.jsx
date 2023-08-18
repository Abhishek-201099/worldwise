import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Map.module.css';
import { MapContainer, Marker, TileLayer,Popup, useMap, useMapEvents } from 'react-leaflet';
import {useCities} from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';


const flagemojiToPNG = (flag) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('');
  return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}


export default function Map(){
  const [mapPosition,setMapPosition]=useState([40,0]);
  const {cities}=useCities();
  const {isLoading:isLoadingPosition, position:geoLocationPosition, getPosition}=useGeolocation();
  const [mapLat,mapLng]=useUrlPosition();
  

  // Needed to persist the location after user hit back button in <City/>. So, storing that in mapPosition. Hence the need for mapLocation.
  useEffect(function(){
    if(mapLat&&mapLng)
    setMapPosition([mapLat,mapLng]);
  },[mapLat,mapLng]);

  useEffect(function(){
    if(geoLocationPosition)
    setMapPosition(geoLocationPosition);
  },[geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && 
      <Button type='position' onClick={getPosition}>
        {isLoadingPosition ? 'Loading...' : 'Use your position'}
      </Button>
      }
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {/* Looping over the cities to mark location on the map. */}
        {cities.map(city=>{
          return (
          <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
            <Popup>
              <span>{flagemojiToPNG(city.emoji)}</span><span>{city.cityName}</span>
            </Popup>
          </Marker>);
        })}
        {/* Need to create a component to change the center value. Center is not reactive to mapLocation change. */}
        <ChangeCenter position={mapPosition}/>
        <DetectClick/>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({position}){
 const map= useMap();
//  setting the center for the map. Even if user hits back btn the mapLocation will persist.
 map.setView(position);
 return null;
}

// TO detect click on map. Upon click navigating to form but also storing the lat and lng in the url for the form to use.
function DetectClick(){
  const navigate=useNavigate();
  useMapEvents({
    click:(e)=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  });
}