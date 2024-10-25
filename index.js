const API_KEY = "e8504189eb52af4453b8fbaafdc3adc9";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeatherByCity(city) {
  const response = await fetch(`${apiUrl}q=${city}&appid=${API_KEY}`);
  displayWeather(response);
}

async function checkWeatherByLocation(lat, lon) {
  const response = await fetch(
    `${apiUrl}lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  displayWeather(response);
}

async function displayWeather(response) {
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();
    console.log(data);

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/hr";

    const weatherType = data.weather[0].main;

    if (weatherType === "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (weatherType === "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (weatherType === "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (weatherType === "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (weatherType === "Mist") {
      weatherIcon.src = "images/mist.png";
    } else if (weatherType === "Snow") {
      weatherIcon.src = "images/snow.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  const cityName = searchBox.value.trim();
  checkWeatherByCity(cityName);
});

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        checkWeatherByLocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        document.querySelector(".error").textContent = "Location access denied";
        document.querySelector(".error").style.display = "block";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

window.onload = getLocationAndWeather;
