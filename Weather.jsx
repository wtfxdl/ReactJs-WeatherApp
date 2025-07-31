import { useEffect, useRef, useState } from 'react';
import SunIcon from '../assets/sun.png';
import SearchIcon from '../assets/search.png';
import HumidityIcon from '../assets/humidity.png';
import WindIcon from '../assets/wind.png';

export default function Weather() {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  const search = async (city) => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=21480a903c2000021d6fd98e6b5ca6f4&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert('City not found');
        setWeatherData(null);
        return;
      }

      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Something went wrong while fetching weather');
    }
  };

  useEffect(() => {
    search('Kerala');
  }, []);

  const handleSearchClick = () => {
    const city = inputRef.current.value.trim();
    if (city) {
      search(city);
    } else {
      alert('Please enter a city name');
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
        />
        <img
          src={SearchIcon}
          alt="Search Icon"
          onClick={handleSearchClick}
        />
      </div>

      <img src={SunIcon} alt="Weather Icon" className="weather-icon" />

      <p className="temperature">
        {weatherData?.main?.temp ? Math.round(weatherData.main.temp) + '°' : '--'}
      </p>

      <p className="location">
        {weatherData?.name ?? 'Search a city'}
      </p>

      <div className="weather-data">
        <div className="col">
          <img src={HumidityIcon} alt="Humidity Icon" />
          <div>
            <p>{weatherData?.main?.humidity ?? '--'}%</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <img src={WindIcon} alt="Wind Icon" />
          <div>
            <p>{weatherData?.wind?.speed ?? '--'} km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
