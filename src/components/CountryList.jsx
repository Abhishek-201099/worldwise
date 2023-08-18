import Spinner from './Spinner';
import styles from './CountryList.module.css';
import Message from './Message';
import CountryItem from './CountryItem';
import { useCities } from '../contexts/CitiesContext';

export default function CountryList(){
  const {cities,isLoading}=useCities();

  if(isLoading) return <Spinner/>

  if(!cities.length) return <Message message='Add a city by clicking a city on the map' />

  const countries=cities.reduce((acc,city)=>{
    if(!acc.map(city=>city.country).includes(city.country))
    return [...acc,{country:city.country,emoji:city.emoji}];
    return acc;
  },[])

  return (
    <ul className={styles.countryList}>
      {countries.map(country=><CountryItem country={country} key={country.country} />)}
    </ul>
  );
}