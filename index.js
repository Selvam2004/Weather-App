const API_KEY = "e8504189eb52af4453b8fbaafdc3adc9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const toggleUnitsBtn = document.getElementById("toggle-units");
const weatherIcon = document.querySelector(".weather-icon");

let units = localStorage.getItem("weatherUnits") || "metric";

function updateUnitToggleText() {
  const unitLabel = units === "metric" ? "°C" : "°F";
  toggleUnitsBtn.textContent = `${unitLabel}`;
}

toggleUnitsBtn.addEventListener("click", () => {
  units = units === "metric" ? "imperial" : "metric";
  localStorage.setItem("weatherUnits", units);
  updateUnitToggleText();

  if (searchBox.value.trim()) {
    checkWeatherByCity(searchBox.value.trim());
  } else {
    getLocationAndWeather();
  }
});

async function checkWeatherByCity(city) {
  const response = await fetch(
    `${apiUrl}q=${city}&units=${units}&appid=${API_KEY}`
  );
  displayWeather(response);
}

async function checkWeatherByLocation(lat, lon) {
  const response = await fetch(
    `${apiUrl}lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  displayWeather(response);
}

async function displayWeather(response) {
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + (units === "metric" ? "°C" : "°F");
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent =
      data.wind.speed + (units === "metric" ? " km/hr" : " mph");

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

window.onload = () => {
  updateUnitToggleText();
  getLocationAndWeather();
};
