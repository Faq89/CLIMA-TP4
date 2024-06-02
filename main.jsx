const { useState } = React;

const API_KEY = "1586248c3937369faa3442ed8f947769";
const DEFAULT_CITIES = ["Tucumán", "Salta", "Buenos Aires"];
const URL = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Estado para el mensaje de error

  const getWeather = async (city) => {
    setIsLoading(true);
    setError(""); // Reiniciar el mensaje de error antes de hacer la solicitud
    try {
      const response = await fetch(
        `${URL}?q=${city.trim()}&units=metric&appid=${API_KEY}&lang=es`
      );
      if (!response.ok) {
        throw new Error("Error al buscar ciudad");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(error.message); // Capturar el error y actualizar el estado del mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getWeather(cityName);
  };

  return (
    <div className="container">
      <Navbar getWeather={getWeather} />
      <div className="search-container">
        <form role="search" onSubmit={handleSubmit}>
          <input
            type="search"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Buscar ciudad"
            aria-label="Search"
            aria-describedby="search-helper"
            required
          />
        </form>
      </div>
      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage error={error} />} {/* Mostrar mensaje de error si hay un error */}
        {weatherData && !error && <Card data={weatherData} />}
      </main>
    </div>
  );
}

const Navbar = ({ getWeather }) => (
  <nav>
    <h1>Clima</h1>
    <ul>
      {DEFAULT_CITIES.map((cityName) => (
        <li key={cityName}>
          <a href="#" onClick={() => getWeather(cityName)}>
            {cityName}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const Loader = () => <article aria-busy={true}></article>;

const Card = ({ data }) => (
  <article className="card">
    <header>
      <h2>{data.name}</h2>
    </header>

    <div className="imgCont">
      <img
        src={`./openweathermap/${data.weather[0].icon}.svg`}
        alt={data.weather[0].description}
      />
    </div>
    <footer>
      <h3>Temperatura: {data.main.temp}°C</h3>
      <p>
        Mínima: {data.main.temp_min}°C / Máxima: {data.main.temp_max}°C
      </p>
      <p>Humedad: {data.main.humidity}%</p>
    </footer>
  </article>
);

const ErrorMessage = ({ error }) => (
  <div className="error-message" role="alert">
    {error}
  </div>
);
