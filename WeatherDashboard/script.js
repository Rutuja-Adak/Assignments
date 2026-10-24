
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const weatherSection = document.getElementById("weatherSection");
const unitToggle = document.getElementById("unitToggle");

let isCelsius = true;
let currentWeather = null;
let dailyWeather = null;

// Convert weather codes into readable conditions
function getWeatherInfo(code) {
    if (code === 0) return { text: "Clear sky", icon: "☀️" };
    if (code === 1) return { text: "Mainly clear", icon: "🌤️" };
    if (code === 2) return { text: "Partly cloudy", icon: "⛅" };
    if (code === 3) return { text: "Overcast", icon: "☁️" };

    if ([45, 48].includes(code)) {
        return { text: "Foggy", icon: "🌫️" };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return { text: "Drizzle", icon: "🌦️" };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return { text: "Rainy", icon: "🌧️" };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { text: "Snowy", icon: "❄️" };
    }

    if ([95, 96, 99].includes(code)) {
        return { text: "Thunderstorm", icon: "⛈️" };
    }

    return { text: "Unknown conditions", icon: "🌡️" };
}

// Format temperatures according to the selected unit
function formatTemperature(celsius) {
    const temperature = isCelsius
        ? celsius
        : (celsius * 9 / 5) + 32;

    return `${Math.round(temperature)}°${isCelsius ? "C" : "F"}`;
}

// Get the city's coordinates using the geocoding API
async function getCoordinates(city) {
    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for the city. Please try again.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please enter a valid city name.");
    }

    return data.results[0];
}

// Fetch the current weather and three-day forecast
async function getWeather(city) {
    message.textContent = "Loading weather...";
    message.className = "loading";
    weatherSection.hidden = true;
    searchForm.querySelector("button").disabled = true;

    try {
        const location = await getCoordinates(city);

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch weather data. Please try again.");
        }

        const data = await response.json();

        if (!data.current || !data.daily) {
            throw new Error("Weather data is unavailable for this city.");
        }

        currentWeather = data.current;
        dailyWeather = data.daily;

        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("currentDate").textContent =
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long"
            });

        // Save the most recently searched city
        localStorage.setItem("lastCity", city);

        isCelsius = true;
        renderWeather();

        message.textContent = "";
        message.className = "";
        weatherSection.hidden = false;

    } catch (error) {
        message.textContent =
            error instanceof TypeError
                ? "Network error. Please check your internet connection and try again."
                : error.message;

        message.className = "";
    } finally {
        searchForm.querySelector("button").disabled = false;
    }
}

// Display current weather and the forecast
function renderWeather() {
    if (!currentWeather || !dailyWeather) return;

    const currentInfo = getWeatherInfo(currentWeather.weather_code);

    document.getElementById("temperature").textContent =
        formatTemperature(currentWeather.temperature_2m);

    document.getElementById("weatherIcon").textContent =
        currentInfo.icon;

    document.getElementById("condition").textContent =
        currentInfo.text;

    document.getElementById("feelsLike").textContent =
        formatTemperature(currentWeather.apparent_temperature);

    document.getElementById("humidity").textContent =
        `${currentWeather.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `${currentWeather.wind_speed_10m} km/h`;

    unitToggle.textContent = isCelsius
        ? "Switch to °F"
        : "Switch to °C";

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    dailyWeather.time.forEach((date, index) => {
        const info = getWeatherInfo(dailyWeather.weather_code[index]);

        const dateLabel = new Date(
            `${date}T12:00:00`
        ).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        const card = document.createElement("div");
        card.className = "forecast-card";

        const heading = document.createElement("h3");
        heading.textContent = dateLabel;

        const icon = document.createElement("div");
        icon.className = "forecast-icon";
        icon.textContent = info.icon;

        const condition = document.createElement("p");
        condition.className = "forecast-condition";
        condition.textContent = info.text;

        const temperatures = document.createElement("p");
        temperatures.className = "forecast-temps";

        const high = document.createElement("span");
        high.textContent = formatTemperature(
            dailyWeather.temperature_2m_max[index]
        );

        const low = document.createElement("span");
        low.textContent = formatTemperature(
            dailyWeather.temperature_2m_min[index]
        );

        temperatures.append(high, " / ", low);
        card.append(heading, icon, condition, temperatures);
        forecastContainer.appendChild(card);
    });
}

// Handle the search form
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Switch between Celsius and Fahrenheit
unitToggle.addEventListener("click", function () {
    isCelsius = !isCelsius;
    renderWeather();
});

// Restore the last searched city when the page opens
const lastCity = localStorage.getItem("lastCity");

if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
}
