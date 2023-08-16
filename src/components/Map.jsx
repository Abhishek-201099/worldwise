import {useNavigate, useSearchParams} from 'react-router-dom';
import styles from './Map.module.css';


export default function Map(){
  const [searchParams,setSearchParams]=useSearchParams();
  const navigate=useNavigate();

  return (
    <div className={styles.mapContainer} onClick={()=>navigate('form')}>
      <p>lat : {searchParams.get('lat')}</p>
      <p>lng : {searchParams.get('lng')}</p>
    </div>
  );
}