const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = document.querySelector(".info-txt"),
    inputField = document.querySelector("input"),
    searchIcon = document.querySelector(".searchIcon"),
    locationBtn = document.querySelector("button"),
    wIcon = document.querySelector(".weather-part img"),
    backArrow = wrapper.querySelector("header i");

let api;

// Event listener for when the Enter key is pressed in the input field
inputField.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

// Event listener for when the search icon is clicked
searchIcon.addEventListener("click", () => {
    if (inputField.value != "") {
        requestApi(inputField.value);
    }
});

// Event listener for when the "Get Device Location" button is clicked
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API.");
    }
});

// Function to handle successful geolocation
function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
    fetchData();
}

// Function to handle errors during geolocation
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

// Function to make an API request using the city name
function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
    fetchData();
}

// Function to fetch data from the API
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then(response => response.json())
        .then(result => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

// Function to display weather details after fetching from the API
function weatherDetails(info) {
    if (info.cod === "404") {
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
        infoTxt.classList.replace("pending", "error");
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        // Updating the weather icon based on weather condition ID
        if (id === 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "icons/rain.svg";
        }

        // Update weather details in the UI
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".feels .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

// Event listener for the back arrow to return to the input field
backArrow.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
