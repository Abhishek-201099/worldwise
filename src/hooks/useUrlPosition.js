import { useSearchParams } from "react-router-dom";

export function useUrlPosition(){
  // to get the lat and lng from the url query string.
  const [searchParams]=useSearchParams();
  const lat=searchParams.get('lat');
  const lng=searchParams.get('lng');
  return [lat,lng];
}