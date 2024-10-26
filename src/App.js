import { useEffect, useMemo, useState } from "react";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { TbMapSearch, TbMoon, TbSearch, TbSun } from "react-icons/tb";
import "./App.css";
import Select from "react-select"; // Import react-select
import DetailsCard from "./Components/DetailsCard";
import SummaryCard from "./Components/SummaryCard";
import Astronaut from "./asset/not-found.svg";
import SearchPlace from "./asset/search.svg";
import BackgroundColor from "./Components/BackgroundColor";
import Animation from "./Components/Animation";


function App() {
  // Variable declarations
  const API_KEY = process.env.API_URL;
  const [noData, setNoData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectcity, setselectcity] = useState("Delhi");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState();
  const [weatherIcon, setWeatherIcon] = useState(`https://openweathermap.org/img/wn/10n@2x.png`);
  const [loading, setLoading] = useState(false);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const degreeSymbol = useMemo(() => (isFahrenheitMode ? "\u00b0F" : "\u00b0C"), [isFahrenheitMode]);
  const [isDark, setIsDark] = useState(false);

  // List of Indian cities
  const indianCities = [
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Pune", label: "Pune" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Surat", label: "Surat" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Vadodara", label: "Vadodara" },
    { value: "Indore", label: "Indore" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Kochi", label: "Kochi" },
    { value: "Agra", label: "Agra" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Patna", label: "Patna" },
    { value: "Visakhapatnam", label: "Visakhapatnam" }
  ];

  // Load weather data for the default city on mount
  useEffect(() => {
    getWeather(selectcity); // Set default city to Delhi
    document.body.classList.toggle("dark", isDark); // Apply dark mode class based on state
  }, [selectcity, isDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getWeather(searchTerm);
    setselectcity(searchTerm);
  };

  const getWeather = async (location) => {
    setLoading(true);
    setWeatherData([]);
    const url = "https://api.openweathermap.org/data/2.5/forecast?";
    try {
      const res = await fetch(`${url}q=${location}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`);
      const data = await res.json();
      if (data.cod !== "200") {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setLoading(false);
        return;
      }
      setWeatherData(data);
      setCity(`${data.city.name}, ${data.city.country}`);
      setWeatherIcon(`https://openweathermap.org/img/wn/${data.list[0].weather[0]["icon"]}@4x.png`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = (input) => {
    setSearchTerm(input.value); // React-select returns an object, so we access `value`
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', paddingTop: 20 }}>{selectcity}</h1>
      <div
        className="blur"
        style={{
          background: `${weatherData ? BackgroundColor(weatherData) : "#a6ddf0"}`,
          top: "-10%",
          right: "0",
        }}
      ></div>
      <div
        className="blur"
        style={{
          background: `${weatherData ? BackgroundColor(weatherData) : "#a6ddf0"}`,
          top: "36%",
          left: "-6rem",
        }}
      ></div>

      <div className="content">
        <div className="form-container">
          <div className="name">
            <Animation />
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />
              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>
            </div>
            <div className="city">
              <TbMapSearch />
            </div>
          </div>

          <div className="search">
            <form className="search-bar" noValidate onSubmit={submitHandler}>
              <Select
                options={indianCities}
                placeholder="Explore cities weather"
                onChange={searchCities}
                className="input_search"
              />
              <button className="s-icon" type="submit">
                <TbSearch />
              </button>
            </form>
          </div>
        </div>

        {/* Display Selected City Name */}
        {weatherData.length > 0 && (
          <h2 className="city-name">
            Weather Forecast for {city}
          </h2>
        )}

        <div className="info-container">
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span>
              {weatherData.length === 0 ? (
                <div className="nodata">
                  {noData === "Location Not Found" ? (
                    <>
                      <img src={Astronaut} alt="an astronaut lost in space" />
                      <p>Oh oh! We're lost in space finding that place.</p>
                    </>
                  ) : (
                    <>
                      <img src={SearchPlace} alt="a person thinking about what place to find" />
                      <p style={{ padding: "20px" }}>
                        Don't worry, if you don't know what to search for, try: India or maybe USA.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <DetailsCard
                    weather_icon={weatherIcon}
                    data={weatherData}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />
                  <ul className="summary">
                    {weatherData.list.map((days, index) => (
                      <SummaryCard
                        key={index}
                        day={days}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                      />
                    ))}
                  </ul>
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
