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

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
          style={{marginLeft:'8px' }}
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


