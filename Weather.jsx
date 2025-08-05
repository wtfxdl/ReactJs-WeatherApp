import { useEffect, useRef, useState } from 'react';
import SunIcon from '../assets/sun.png';
import SearchIcon from '../assets/search.png';
import LocationIcon from '../assets/location.png';
import HumidityIcon from '../assets/humidity.png';
import WindIcon from '../assets/wind.png';

export default function Weather() {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  // City Weather Search Function (with Input Validation)
  const search = async (city) => { // You're declaring an asynchronous arrow function named search that takes one argument: city.
    if (!city) { // This checks if the city variable is empty, null, or undefined.
      alert('Please enter a city name'); //f no city was entered, this will pop up an alert message to the user.
      return; //This line stops the function.
    }
    // Fetching Weather Data from OpenWeatherMap API
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=21480a903c2000021d6fd98e6b5ca6f4&units=metric`;
      const response = await fetch(url); // This line makes an HTTP request to the API URL you created above.
      const data = await response.json();// Reads the body of the response and parses it as JSON.

      if (data.cod !== 200) { // 👉 If the response code is not 200, something went wrong — maybe the city name was invalid.
        alert('City not found'); // If the Code is not === 200, it will alert us City Not Found
        setWeatherData(null); //setWeatherData(null) resets the state to null, so nothing will be shown in the UI until valid data is fetched.
        return;
      }

      setWeatherData(data); //Stores the valid weather data into the weatherData state using setWeatherData().
      console.log(data);// Logs the full API response to the browser console.
    } catch (error) { //This starts the catch block of a try...catch statement.
      console.error('Error fetching weather:', error);
      alert('Something went wrong while fetching weather');    // Shows a user-friendly alert message to the user.
    }
  };

  const getCurrentLocationWeather = () => {   // Defines a function named getCurrentLocationWeather.
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');  /// Checks if the browser supports geolocation If not, it shows an alert and exits the function early.
      return;
    }

    navigator.geolocation.getCurrentPosition( //  Calls the Geolocation API to get the user's current position.
      async (position) => { //This is the success callback function If the user's location is found, this function will run and receive the position object.
        const { latitude, longitude } = position.coords; //Extracts the latitude and longitude values from the position object.
        console.log('Coordinates:', latitude, longitude);
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=21480a903c2000021d6fd98e6b5ca6f4&units=metric`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.cod !== 200) {
            alert('Location weather not found');
            setWeatherData(null);
            return;
          }

          setWeatherData(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching location weather:', error);
          alert('Something went wrong while fetching your location weather');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Permission denied or location unavailable');
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const handleSearchClick = () => {
    const city = inputRef.current?.value.trim();
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
          className="icon"
        />
        <img
          src={LocationIcon}
          alt="Location Icon"
          onClick={getCurrentLocationWeather}
          className="icon"
          style={{ marginLeft: '8px' }}
        />
      </div>

      <img src={SunIcon} alt="Weather Icon" className="weather-icon" />

      <p className="temperature">
        {weatherData?.main?.temp !== undefined ? `${Math.round(weatherData.main.temp)}°` : '--'}
      </p>

      <p className="location">
        {weatherData?.name ?? 'Search a city'}
      </p>

      <div className="weather-data">
        <div className="col">
          <img src={HumidityIcon} alt="Humidity Icon" />
          <div>
            <p>{weatherData?.main?.humidity !== undefined ? `${weatherData.main.humidity}%` : '--%'}</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <img src={WindIcon} alt="Wind Icon" />
          <div>
            <p>{weatherData?.wind?.speed !== undefined ? `${weatherData.wind.speed} km/h` : '-- km/h'}</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}



