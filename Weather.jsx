// ✅ Importing React hooks and image assets
import { useEffect, useRef, useState } from 'react';
import SunIcon from '../assets/sun.png';
import SearchIcon from '../assets/search.png';
import LocationIcon from '../assets/location.png';
import HumidityIcon from '../assets/humidity.png';
import WindIcon from '../assets/wind.png';

// ✅ Weather Component
export default function Weather() {
  // 🧠 Reference to access the input field directly
  const inputRef = useRef(null);

  // 🌦 State to store weather data fetched from the API
  const [weatherData, setWeatherData] = useState(null);

  // 🔍 Function to fetch weather based on city name
  const search = async (city) => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }

    try {
      // 🌐 API request using city name
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=21480a903c2000021d6fd98e6b5ca6f4&units=metric`;
      const response = await fetch(url); // 🔄 Fetch data
      const data = await response.json(); // 📦 Convert response to JSON

      // ❗ Handle invalid city response
      if (data.cod !== 200) {
        alert('City not found');
        setWeatherData(null); // 🧹 Clear old data
        return;
      }

      setWeatherData(data); // ✅ Set data to state
      console.log(data); // 🛠️ Log for debugging
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Something went wrong while fetching weather');
    }
  };

  // 📍 Function to fetch weather using current location (geolocation)
  const getCurrentLocationWeather = () => {
    // ❌ If browser doesn't support location
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    // 📡 Get current coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Coordinates:', latitude, longitude);

        try {
          // 🌐 API request using latitude and longitude
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=21480a903c2000021d6fd98e6b5ca6f4&units=metric`;
          const response = await fetch(url);
          const data = await response.json();

          // ❗ If API didn't return valid weather
          if (data.cod !== 200) {
            alert('Location weather not found');
            setWeatherData(null);
            return;
          }

          setWeatherData(data); // ✅ Save location-based weather data
          console.log(data);
        } catch (error) {
          console.error('Error fetching location weather:', error);
          alert('Something went wrong while fetching your location weather');
        }
      },
      // ❗ If user denies or error occurs
      (error) => {
        console.error('Geolocation error:', error);
        alert('Permission denied or location unavailable');
      },
      {
        enableHighAccuracy: true, // 📍 Use high-accuracy GPS if available
      }
    );
  };

  // 🔄 Automatically run once when component loads (to get location)
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  // 👆 Called when the search icon is clicked
  const handleSearchClick = () => {
    const city = inputRef.current?.value.trim(); // ✂️ Trim whitespace
    if (city) {
      search(city); // 🔍 Call the search function
    } else {
      alert('Please enter a city name');
    }
  };

  // 🧱 UI for weather component
  return (
    <div className="weather">
      {/* 🔍 Search Input and Icons */}
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

      {/* 🌞 Static Weather Icon (can be dynamic later) */}
      <img src={SunIcon} alt="Weather Icon" className="weather-icon" />

      {/* 🌡️ Temperature */}
      <p className="temperature">
        {weatherData?.main?.temp !== undefined
          ? `${Math.round(weatherData.main.temp)}°`
          : '--'}
      </p>

      {/* 🏙️ City Name */}
      <p className="location">
        {weatherData?.name ?? 'Search a city'}
      </p>

      {/* 💧 Humidity and Wind Info */}
      <div className="weather-data">
        {/* 💧 Humidity */}
        <div className="col">
          <img src={HumidityIcon} alt="Humidity Icon" />
          <div>
            <p>
              {weatherData?.main?.humidity !== undefined
                ? `${weatherData.main.humidity}%`
                : '--%'}
            </p>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
              Humidity
            </span>
          </div>
        </div>

        {/* 🌬️ Wind Speed */}
        <div className="col">
          <img src={WindIcon} alt="Wind Icon" />
          <div>
            <p>
              {weatherData?.wind?.speed !== undefined
                ? `${weatherData.wind.speed} km/h`
                : '-- km/h'}
            </p>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
              Wind Speed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


