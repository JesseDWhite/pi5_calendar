import { useEffect, useState } from 'react'
import './App.css'

const App = () => {

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysInWeek] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

  const getWeatherIcon = (code) => {
    const url = `https://openweathermap.org/img/wn/${code}@2x.png`;
    return url;
  }

  const getDate = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today;
  }

  useEffect(() => {
    const getForecast = async () => {
      const openWeatherCall = `https://api.openweathermap.org/data/3.0/onecall?lat=38.61593458031881&lon=-90.24595036070286&cnt=7&units=imperial&exclude=hourly,minutely,alerts&appid=${import.meta.env.VITE_API_KEY}`;
      try {
        const response = await fetch(openWeatherCall);
        if (!response.ok) {
          setForecast(null);
          setLoading(true);
        } else {
          let json = await response.json();
          const removeUneededDays = json.daily.slice(1, 6);
          json.daily = removeUneededDays;
          console.log(json)
          setForecast(json)
        }
      } catch (error) {
        console.log(error)
        setLoading(true);
      } finally {
        setLoading(false);
      }
    }

    getForecast();
  }, []);

  return (
    <>
      {!loading ?
        (<div id='calendar'>
          <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&title=Family%20Calendar&showTz=0&showPrint=0&src=amVzc2Uud2hpdGU2QGdtYWlsLmNvbQ&src=ZmFtaWx5MTIwMDM0ODMxNzY0MjgxMjczODdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230030a5&color=%23616161&color=%230B8043" style={{ borderWidth: 0, borderRadius: '20px' }} width="600" height="600"></iframe>
          <div className="outer">
            <div className="middle">
              <div className="inner">
                <div className="container weather-app">
                  <div className="row current-location">
                    <div className="col current-city" id="current-city">
                      <div className="search-city">
                        <span className="city"> St. Louis </span>
                        <span className="current-weather">
                          <img src={getWeatherIcon(forecast.current.weather[0].icon)} alt={forecast.current.weather[0].description} width="50px" />
                        </span>
                      </div>
                      <div>
                        <span className="temp"> {forecast.current.temp.toFixed(0)} </span>
                        <span className="units">
                          °F
                        </span>
                      </div>
                      <div className="current-date">
                        <span className="day" id="day"> {daysInWeek[new Date().getDay()]} </span>
                        <span className="time" id="time"></span>
                      </div>
                    </div>

                    <div className="col-4 current-location-details">
                      <div className="col-12">
                        <span className="precipitation">{forecast.current.weather[0].description}</span>
                      </div>
                      <div className="col-12">
                        Humidity: <span className="humidity">{forecast.current.humidity}%</span>
                      </div>
                      <div className="col-12">
                        Wind: <span className="wind-speed">{forecast.current.wind_speed.toFixed(0)}mph</span>
                      </div>
                    </div>
                  </div>
                  {/* <!--five days forecast--> */}
                  <div className="container text-center five-days-forecast">
                    <div className="row">
                      {forecast.daily.map((day, idx) => {
                        return (
                          <div className="col" key={idx}>
                            <div className="row">
                              <div className="col-12">{daysInWeek[new Date(getDate(idx + 1)).getDay()]}</div>
                              <div className="col-12 weather-icon">
                                <img src={getWeatherIcon(day.weather[0].icon)} alt="rain" width="40px" />
                              </div>
                              <div className="col-12">
                                <span className="day-temp"> {day.temp.max.toFixed(0)}°/ </span>
                                <span className="night-temp">{day.temp.min.toFixed(0)}°</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)
        : (<div><iframe src="https://giphy.com/embed/BcuLq7kvQWuftTzBh4" width="480" height="480" className="giphy-embed" allowFullScreen></iframe></div>)
      }
    </>
  )
}

export default App;
