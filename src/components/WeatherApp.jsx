import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";
import searchIcon from "/search.png";
import humidityIcon from "/humidity.png";
import windIcon from "/wind.png";
function calculateAQI(pm25) {
    if (pm25 >= 0 && pm25 <= 12) return Math.floor(pm25 * (50 / 12));
    if (pm25 > 12 && pm25 <= 35.4) return Math.floor(((pm25 - 12) * (49 / 23)) + 51);
    if (pm25 > 35.4 && pm25 <= 55.4) return Math.floor(((pm25 - 35.4) * (49 / 20)) + 101);
    if (pm25 > 55.4 && pm25 <= 150.4) return Math.floor(((pm25 - 55.4) * (49 / 95)) + 151);
    if (pm25 > 150.4 && pm25 <= 250.4) return Math.floor(((pm25 - 150.4) * (49 / 100)) + 201);
    if (pm25 > 250.4 && pm25 <= 500.4) return Math.floor(((pm25 - 250.4) * (99 / 250)) + 301);
    return 'Unknown';
  }
  
function getIcon(iconName) {
  let iconUrl = "";
  switch (iconName) {
    case "Clouds":
      iconUrl = "/cloud.png";
      break;
    case "Thunderstorm":
      iconUrl = "/Thunderstorm.png";
      break;
    case "Drizzle":
      iconUrl = "/drizzle.png";
      break;
    case "Rain":
      iconUrl = "/rain.png";
      break;
    case "Snow":
      iconUrl = "/snow.png";
      break;
    case "Clear":
      iconUrl = "/clear.png";
      break;
    default:
      iconUrl = "/cloud.png";
  }
  return iconUrl;
}
function getAQIres(aqi) {
    switch (aqi) {
        case 1:return'Good' 
        case 2:return'Fair'
        case 3:return'Mild'
        case 4:return'Poor'
        case 5:return'Severe'
    }
}
function WeatherApp() {
  const apiKey = "5f3f529a6fb306dc80aa1d528faf1c04";
  const [defaultCity, setDefaultCity] = useState("London");
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState();
  const [windSpeed, setWindSpeed] = useState();
  const [humidity, setHumidity] = useState();
  const [iconurl, setIconurl] = useState("");
  const [aqi, setAqi] = useState("");
  useEffect(() => {
    async function defaultData() {
      try {
        const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=metric&APPID=${apiKey}`;
        let response = await axios.get(apiURL);
        let data = response.data;
        let iconName = data.weather[0].main;
        let iconUrl = getIcon(iconName);
        let lat=data.coord.lat;
        let lon=data.coord.lon;
        setIconurl(iconUrl);
        setTemp(data.main.temp);
        setWindSpeed(data.wind.speed);
        setHumidity(data.main.humidity);
        const aqiURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        response = await axios.get(aqiURL);
        data = response.data;
        let aqiVal = data.list[0].main.aqi;
        let AQIlevel = getAQIres(aqiVal);

        // Calculate AQI for PM2.5
        let pm25Concentration = data.list[0].components.pm2_5;
        let AQIValue = calculateAQI(pm25Concentration);
        
        setAqi(`${AQIValue} (${AQIlevel})`);
      } catch (error) {
        console.error("Error fetching default data:", error.message);
      }
    }
    defaultData();
  }, [defaultCity]);
  const handleSearch = async () => {
    if (city === "") {
      return;
    }
    const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
    let response = await axios.get(apiURL);
    let data = response.data;
    let iconName = data.weather[0].main;
    let iconUrl = getIcon(iconName);
    setIconurl(iconUrl);
    setTemp(data.main.temp);
    setWindSpeed(data.wind.speed);
    setHumidity(data.main.humidity);
    setDefaultCity(city);
    const aqiURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        response = await axios.get(aqiURL);
        data = response.data;
        let aqiVal = data.list[0].main.aqi;
        let AQIlevel = getAQIres(aqiVal);

        // Calculate AQI for PM2.5
        let pm25Concentration = data.list[0].components.pm2_5;
        let AQIValue = calculateAQI(pm25Concentration);
        
        setAqi(`${AQIValue} (${AQIlevel})`);
  };
  const handleChange = (e) => {
    setCity(e.target.value);
  };
  return (
    <div className="container">
      <div className="topbar">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          onChange={handleChange}
        />
        <div className="searchIcon" onClick={handleSearch}>
          <img src={searchIcon} />
        </div>
      </div>
      <div className="weatherImage">
        <img src={iconurl} />
      </div>
      <div className="weatherTemp">{temp}°c</div>
      <div className="weatherLocation">{defaultCity}</div>
      <div className="dataContainer">
        <div className="element">
          <img src={humidityIcon} className="icon" />
          <div className="data">
            <div className="humidityPercent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} className="icon" />
          <div className="data">
            <div className="humidityPercent">{windSpeed} km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
        <div className="element">
          <img src="/airQuality.png" className="icon" />
          <div className="data">
            <div className="weatherAQI">{aqi}</div>
            <div className="text">AQI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
