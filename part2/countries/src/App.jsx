import axios from 'axios';
import React, { useState, useEffect } from 'react';

const baseApiURL = `https://studies.cs.helsinki.fi/restcountries/api`;
const iconsURL = `https://openweathermap.org/img/wn`;

const API_KEY = import.meta.env.VITE_API_KEY;

const Languages = ({ languages }) => (
  <>
    <div>
      <h4>Languages: </h4>
      {
        <ul>
          {Object.values(languages).map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
      }
    </div>
  </>
);

const Country = ({ countryName }) => {
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryResponse = await axios.get(
          `${baseApiURL}/name/${countryName}`
        );
        setCountry(countryResponse.data);

        if (countryResponse.data) {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${countryResponse.data.capital}&appId=${API_KEY}`
          );
          setWeather(weatherResponse.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [countryName]);

  if (!country || !weather.weather) {
    return null;
  }

  const weatherIcon = `${iconsURL}/${weather.weather[0].icon}@2x.png`;
  const tempInCelsius = `${Number(weather.main.temp - 273.15).toFixed(2)}`;

  return (
    <>
      <div>
        <h1>{countryName}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
      </div>

      <Languages languages={country.languages} />
      <div>
        <img src={country.flags.png} alt={country.flags.alt} />
      </div>
      <div>
        <h2>Weather in {country.capital}</h2>

        <p>temperature {tempInCelsius} Celsius</p>
        <img src={weatherIcon} alt='' />
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    </>
  );
};

const App = () => {
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      await axios.get(`${baseApiURL}/all`).then(res => {
        setCountries(res.data.map(c => c.name.common));
      });
    };
    fetchCountryData();
  }, [value]);

  const handleSearchCountries = e => {
    setValue(e.target.value.toLowerCase());
  };

  const filterCountries = countries.filter(country =>
    country.toLowerCase().includes(value)
  );

  const handleSelectedCountry = country => {
    setValue(country.toLowerCase());
  };

  return (
    <>
      <div>
        <label>find countries</label>{' '}
        <input value={value} onChange={handleSearchCountries} />
        {filterCountries?.length > 1 ? (
          <div className='countries-output'>
            {value === ''
              ? 'Please start typing to search for countries'
              : filterCountries.length > 10
              ? 'Too many matches, specify another filter'
              : filterCountries.map((country, index) => (
                  <p key={index}>
                    {country}
                    <button onClick={() => handleSelectedCountry(country)}>
                      show
                    </button>
                  </p>
                ))}
          </div>
        ) : (
          filterCountries.length == 1 && (
            <div>
              <Country countryName={filterCountries.toString()} />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default App;
