const apiKey = "d6468d122fcbe3d193a2d5f045d22b0a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");
const loadingIndicator = document.querySelector(".loading");

async function fetchWeather(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("City not found");
    }
    return response.json();
}

function displayWeather(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".feels-like").textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";
    document.querySelector(".weather-description").textContent = `Weather: ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    const weatherCondition = data.weather[0].main.toLowerCase();
    weatherIcon.src = `images/${weatherCondition}.png`;

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
    loadingIndicator.style.display = "none";
}

function showError(message) {
    document.querySelector(".error").textContent = message;
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    loadingIndicator.style.display = "none";
}

async function getWeatherByCity(city) {
    try {
        loadingIndicator.style.display = "block";
        const data = await fetchWeather(apiUrl + city + `&appid=${apiKey}`);
        displayWeather(data);
    } catch (error) {
        showError("Invalid City Name");
    }
}

async function getWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;
    try {
        loadingIndicator.style.display = "block";
        const data = await fetchWeather(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
        displayWeather(data);
    } catch (error) {
        showError("Unable to fetch weather data");
    }
}

function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, () => showError("Unable to access location"));
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError("Please enter a city name");
    }
});

locationBtn.addEventListener("click", requestLocation);
