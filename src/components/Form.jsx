// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from './Button';
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from "../contexts/CitiesContext";

const BASE_URL=`https://api.bigdatacloud.net/data/reverse-geocode-client`;

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate=useNavigate();
  const {createCity,isLoading}=useCities();
  const [lat,lng]=useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding,setIsLoadingGeocoding]=useState(false);
  const [errorGeocoding,setErrorGeocoding]=useState('');
  const [emoji,setEmoji]=useState('');

  useEffect(function(){
    async function fetchCityData(){
      if(!lat&!lng) return;
      try{
        setIsLoadingGeocoding(true);
        setErrorGeocoding('');
        const response= await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data= await response.json();
        if(!data.countryCode) throw new Error("That doesn't seem like a city, click on a city next time 😉")
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      }catch(err){
        setErrorGeocoding(err.message);
      }finally{
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  },[lat,lng]);

  async function handleSubmit(e){
    e.preventDefault() 
    if(!cityName || !date) return;

    // id in newCity is going to be taken care of by json-server, so need not to be included.
    const newCity={
      country,
      cityName,
      notes,
      date,
      emoji,
      position:{lat,lng}
    }

    await createCity(newCity);
    navigate('/app/cities');
  }

  if(isLoadingGeocoding) return <Spinner/>;

  if(!lat&!lng) return <Message message='Start by clicking somewhere on the map 🗺️'/>

  if(errorGeocoding) return <Message message={errorGeocoding} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker onChange={date=>setDate(date)} selected={date} id='date' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        
        <Button type='back' onClick={(e)=>{e.preventDefault(); navigate('..')}}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
