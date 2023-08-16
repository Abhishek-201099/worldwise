import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const flagemojiToPNG = (flag) => {
    const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('');
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}

export default function CityItem({city}){
  return (
    <li>
      <Link to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`} className={styles.cityItem}>
        <span className={styles.emoji}>{flagemojiToPNG(city.emoji)}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>({formatDate(city.date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}