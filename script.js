const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const statusBar = document.getElementById('statusBar');
const cityName = document.getElementById('cityName');
const temperatureValue = document.getElementById('temperatureValue');
const feelsLikeValue = document.getElementById('feelsLikeValue');
const windSpeedValue = document.getElementById('windSpeedValue');
const windDirectionValue = document.getElementById('windDirectionValue');
const pressureValue = document.getElementById('pressureValue');
const cloudsValue = document.getElementById('cloudsValue');
const humidityValue = document.getElementById('humidityValue');

getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

const API_KEY = 'd2bec087956e8688201d9a16813f38c0';

const directionLabels = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
];

function updateField(element, value) {
    element.textContent = value;
}

function clearFields() {
    updateField(cityName, '—');
    updateField(temperatureValue, '—');
    updateField(feelsLikeValue, '—');
    updateField(windSpeedValue, '—');
    updateField(windDirectionValue, '—');
    updateField(pressureValue, '—');
    updateField(cloudsValue, '—');
    updateField(humidityValue, '—');
}

function setStatus(message, type = 'info') {
    statusBar.textContent = message;
    statusBar.classList.toggle('error', type === 'error');
}

function getWindDirection(degrees) {
    const index = Math.round(degrees / 22.5) % 16;
    return `${directionLabels[index]} (${degrees}°)`;
}

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        setStatus('Please enter a city name!', 'error');
        return;
    }

    setStatus('Fetching weather for ' + city + '...');
    clearFields();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 404 || data.cod === '404') {
            setStatus(`City "${city}" not found. Please check the spelling and try again.`, 'error');
            return;
        }

        if (!response.ok || data.cod !== 200) {
            setStatus(data.message || 'Unable to fetch weather data. Please try again.', 'error');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Weather API Error:', error);
        setStatus('Network error! Please check your internet connection.', 'error');
    }
}

function displayWeather(data) {
    const { main, weather, wind, sys, name, clouds } = data;
    const feelsLike = Math.round(main.feels_like);
    const temperature = Math.round(main.temp);
    const windSpeed = (wind.speed * 3.6).toFixed(1);
    const windDirection = getWindDirection(Math.round(wind.deg));

    updateField(cityName, `${name}, ${sys.country}`);
    updateField(temperatureValue, `${temperature}°C`);
    updateField(feelsLikeValue, `${feelsLike}°C`);
    updateField(windSpeedValue, `${windSpeed} km/h`);
    updateField(windDirectionValue, windDirection);
    updateField(pressureValue, `${main.pressure} mb`);
    updateField(cloudsValue, `${clouds.all}%`);
    updateField(humidityValue, `${main.humidity}%`);

    const description = weather[0].description
        .charAt(0)
        .toUpperCase() + weather[0].description.slice(1);

    setStatus(`${description} — updated successfully.`);
}

clearFields();
setStatus('Enter a city name and press Search.');
