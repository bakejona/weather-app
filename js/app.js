document.getElementById('get-weather-btn').addEventListener('click', () => {
    const location = document.getElementById('location-input').value;
    const days = document.getElementById('days-select').value;
    
    if (location && days) {
        getWeatherData(location, days);
    }
});

async function getWeatherData(location, days) {
    const apiKey = 'e45514bdf702448fa2d211720250809'; 
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}&aqi=yes&alerts=no`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Could not get weather data for this location.');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('weather-details').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeatherData(data) {
    const detailsDiv = document.getElementById('weather-details');
    detailsDiv.innerHTML = ''; 

    // Current Weather Section
    const currentWeather = data.current;
    const locationInfo = data.location;
    const precip_in = currentWeather.precip_in;

    const currentWeatherHtml = `
        <div class="current-weather-card">
            <h2>${locationInfo.name}, ${locationInfo.region}</h2>
            <img src="https:${currentWeather.condition.icon}" alt="${currentWeather.condition.text}" class="weather-icon">
            <p class="condition-text">${currentWeather.condition.text}</p>
            <p class="temp">${currentWeather.temp_f}°F</p>
            <p class="feels-like">Feels like ${currentWeather.feelslike_f}°F</p>
            <div class="weather-info-grid">
                <div><i class="fa-solid fa-wind"></i>&nbsp;<span>Wind:</span> ${currentWeather.wind_mph} mph</div>
                <div><i class="fa-solid fa-droplet"></i>&nbsp;<span>Humidity:</span> ${currentWeather.humidity}%</div>
                <div><i class="fa-solid fa-cloud-showers-heavy"></i>&nbsp;<span>Precipitation:</span> ${precip_in} in</div>
                <div><i class="fa-solid fa-sun"></i>&nbsp;<span>UV Index:</span> ${currentWeather.uv}</div>
            </div>
        </div>
    `;

    detailsDiv.innerHTML += currentWeatherHtml;
    
    // Forecast Grid Section
    const forecastGridDiv = document.createElement('div');
    forecastGridDiv.className = 'forecast-grid';
    
    const forecastDays = data.forecast.forecastday;
    
    forecastDays.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const maxTemp = day.day.maxtemp_f;
        const minTemp = day.day.mintemp_f;
        const condition = day.day.condition.text;
        const icon = day.day.condition.icon;
        
        const dayHtml = `
            <div class="forecast-day-card">
                <h3>${date}</h3>
                <img src="https:${icon}" alt="${condition}">
                <p class="forecast-condition">${condition}</p>
                <p class="forecast-temp">High: ${maxTemp}°F</p>
                <p class="forecast-temp">Low: ${minTemp}°F</p>
            </div>
        `;
        forecastGridDiv.innerHTML += dayHtml;
    });

    detailsDiv.appendChild(forecastGridDiv);
}