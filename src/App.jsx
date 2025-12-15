import { useEffect, useState } from "react";
import weatherConfig from "./config";
import "./App.css";

const App = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysInWeek] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [timestamp, setTimestamp] = useState(null);
  const [modalText, setModalText] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const getRainChance = (value) => {
    const percent = value * 100;
    return percent;
  };

  const getDate = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today;
  };

  const openDialog = (value, day) => {
    const dialog = document.getElementById("forecast-dialog");
    dialog.showModal();
    setSelectedDay(day);
    setModalText(value);
  };

  const closeDialog = () => {
    const dialog = document.getElementById("forecast-dialog");
    setModalText("");
    dialog.close();
  };

  useEffect(() => {
    const getForecast = async () => {
      const openWeatherCall = `https://api.openweathermap.org/data/3.0/onecall?lat=38.61593458031881&lon=-90.24595036070286&cnt=7&units=imperial&exclude=day_summary,hourly,minutely,alerts&appid=${
        import.meta.env.VITE_API_KEY
      }`;
      try {
        const response = await fetch(openWeatherCall);
        if (!response.ok) {
          setForecast(null);
          setLoading(true);
        } else {
          let json = await response.json();
          console.log(json);
          json.current.min = json.daily[0].temp.min;
          json.current.max = json.daily[0].temp.max;
          json.current.pop = json.daily[0].pop;
          json.current.summary = json.daily[0].summary;
          const removeUneededDays = json.daily.slice(1, 6);
          json.daily = removeUneededDays;
          setForecast(json);
        }
      } catch (error) {
        console.log(error);
        setLoading(true);
      } finally {
        setLoading(false);
        const now = new Date();
        setTimestamp(
          now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    };
    getForecast();

    const intervalId = setInterval(() => {
      getForecast();
    }, 10 * 60 * 1000); // 10 minutes * 60 seconds * 1000 milliseconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const calendarInterval = setInterval(() => {
      document.getElementById("calendar-iframe").src =
        "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&showTitle=0&showTz=0&src=amVzc2Uud2hpdGU2QGdtYWlsLmNvbQ&src=M2VjNjJkMDE2NDhmZmU1YTU2NjMyN2U4YzYwYmMxZmIzN2E2YWRiMDU5MTMwMGQ1NGEyNGM0NGE3NzM0NTlmNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=MmM2ZDE3M2QwODM1MjExOWRkZmRmODljN2JjNWVhZTBlNjQyOWZjOTAzOWM0OWNjOWU5Mjk4NTdiNDI2YmExZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23f09300&color=%238e24aa&color=%23a79b8e&color=%23009688";
    }, 10 * 60 * 1000); // 10 minutes * 60 seconds * 1000 milliseconds

    return () => clearInterval(calendarInterval);
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&showTitle=0&showTz=0&src=amVzc2Uud2hpdGU2QGdtYWlsLmNvbQ&src=M2VjNjJkMDE2NDhmZmU1YTU2NjMyN2U4YzYwYmMxZmIzN2E2YWRiMDU5MTMwMGQ1NGEyNGM0NGE3NzM0NTlmNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=MmM2ZDE3M2QwODM1MjExOWRkZmRmODljN2JjNWVhZTBlNjQyOWZjOTAzOWM0OWNjOWU5Mjk4NTdiNDI2YmExZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23f09300&color=%238e24aa&color=%23a79b8e&color=%23009688"
            style={{ borderWidth: 0, borderRadius: "20px" }}
            width="600"
            height="720"
            id="calendar-iframe"
          ></iframe>
          <div className="container-lg weather-app">
            <div className="row current-location">
              <div className="col current-city" id="current-city">
                <div className="search-city">
                  <span className="city">St. Louis</span>
                </div>
                <div>
                  <img
                    className="current-weather"
                    onClick={() =>
                      openDialog(forecast.current.summary, "Today")
                    }
                    src={
                      weatherConfig[forecast.current.weather[0].icon][
                        forecast.current.weather[0].id
                      ]
                    }
                    alt={forecast.current.weather[0].description}
                  />
                </div>
                <div>
                  <span className="temp">
                    {" "}
                    {forecast.current.temp.toFixed(0)}{" "}
                  </span>
                  <span className="units">°F</span>
                </div>
                <div className="current-date">
                  <span className="day" id="day">
                    {" "}
                    {daysInWeek[new Date().getDay()]}{" "}
                  </span>
                  <span className="high-low" id="high-low">
                    hi <strong>{forecast.current.max.toFixed(0)}° </strong>low{" "}
                    <strong>{forecast.current.min.toFixed(0)}°</strong>
                  </span>
                </div>
              </div>

              <div className="col-4 current-location-details">
                <div className="col-12">
                  <span className="precipitation">
                    <strong>
                      {forecast.current.weather[0].description.replace(
                        /\w\S*/g,
                        function (txt) {
                          return (
                            txt.charAt(0).toUpperCase() +
                            txt.substr(1).toLowerCase()
                          );
                        }
                      )}
                    </strong>
                  </span>
                </div>
                <div className="col-12">
                  Clouds{" "}
                  <span className="humidity">
                    <strong>{forecast.current.clouds.toFixed(0)}%</strong>
                  </span>
                </div>
                <div className="col-12">
                  Rain{" "}
                  <span className="wind-speed">
                    <strong>{getRainChance(forecast.current.pop)}%</strong>
                  </span>
                </div>
                <div className="col-12">
                  Humidity{" "}
                  <span className="wind-speed">
                    <strong>{forecast.current.humidity.toFixed(0)}%</strong>
                  </span>
                </div>
                <div className="col-12">
                  Updated{" "}
                  <span className="timestamp">
                    <strong>{timestamp}</strong>
                  </span>
                </div>
              </div>
            </div>
            {/* <!--five days forecast--> */}
            <div className="container-lg text-center five-days-forecast">
              <div className="row">
                {forecast.daily.map((day, idx) => {
                  return (
                    <div className="col five-day" key={idx}>
                      <div className="row">
                        <div className="col-12">
                          {daysInWeek[new Date(getDate(idx + 1)).getDay()]}
                        </div>
                        <div className="col-12 weather-icon">
                          <img
                            onClick={() =>
                              openDialog(
                                day.summary,
                                daysInWeek[new Date(getDate(idx + 1)).getDay()]
                              )
                            }
                            src={
                              weatherConfig[day.weather[0].icon][
                                day.weather[0].id
                              ]
                            }
                            alt={day.weather[0].description}
                            width="85px"
                            height="85px"
                          />
                        </div>
                        <div className="col-12">
                          <span className="day-temp">
                            {" "}
                            {day.temp.max.toFixed(0)}° /{" "}
                          </span>
                          <span className="night-temp">
                            {day.temp.min.toFixed(0)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <dialog id="forecast-dialog">
            <p className="modal-day">{selectedDay}</p>
            <hr />
            <p className="modal-text">{modalText}</p>
            <button
              className="btn btn-dark col-6"
              onClick={() => closeDialog()}
            >
              Close
            </button>
          </dialog>
        </>
      ) : (
        <div className="loading-screen">
          <iframe
            src="https://giphy.com/embed/BcuLq7kvQWuftTzBh4"
            width="480"
            height="480"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );
};

export default App;
