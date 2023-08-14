import Spinner from './Spinner';
import styles from './cityList.module.css';
import CityItem from './CityItem';
import Message from './Message';

export default function CityList({cities,isLoading}){

  if(isLoading) return <Spinner/>

  if(!cities.length) return <Message message='Add a city by clicking a city on the map' />

  return (
    <ul className={styles.cityList}>
      {cities.map(city=><CityItem key={city.id} city={city} />)}
    </ul>
  );
}