document.addEventListener('DOMContentLoaded', () => {
    populateStates();
    document.getElementById('compare-button').addEventListener('click', fetchWeather);
});

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

function populateStates() {
    const stateSelect1 = document.getElementById('state1');
    const stateSelect2 = document.getElementById('state2');

    states.forEach(state => {
        const option1 = document.createElement('option');
        option1.value = state.toUpperCase();
        option1.textContent = state;
        stateSelect1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = state.toUpperCase();
        option2.textContent = state;
        stateSelect2.appendChild(option2);
    });
}

async function fetchWeather() {
    const city1 = document.getElementById('city1').value.trim();
    const state1 = document.getElementById('state1').value;
    const city2 = document.getElementById('city2').value.trim();
    const state2 = document.getElementById('state2').value;
    const units = document.querySelector('input[name="units"]:checked').value;

    let isValid = true;

    if (!city1) {
        document.getElementById('error-city1').textContent = 'Enter a city';
        isValid = false;
    } else {
        document.getElementById('error-city1').textContent = '';
    }

    if (!city2) {
        document.getElementById('error-city2').textContent = 'Enter a city';
        isValid = false;
    } else {
        document.getElementById('error-city2').textContent = '';
    }

    if (!isValid) return;

    const apiKey = 'your_weather_api_key_here';
    const url1 = `https://api.openweathermap.org/data/2.5/forecast?q=${city1},${state1},US&units=${units}&appid=${apiKey}`;
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city2},${state2},US&units=${units}&appid=${apiKey}`;

    try {
        const responses = await Promise.all([fetch(url1), fetch(url2)]);
        const data = await Promise.all(responses.map(response => response.json()));
        
        let errorOccurred = false;
        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '';

        if (data[0].cod === "404") {
            document.getElementById('error-city1').textContent = `Unable to locate ${city1}, ${state1}.`;
            errorOccurred = true;
        } else {
            document.getElementById('error-city1').textContent = '';
            const table1 = createWeatherTable(data[0], city1);
            forecastDiv.appendChild(table1);
        }

        if (data[1].cod === "404") {
            document.getElementById('error-city2').textContent = `Unable to locate ${city2}, ${state2}.`;
            errorOccurred = true;
        } else {
            document.getElementById('error-city2').textContent = '';
            const table2 = createWeatherTable(data[1], city2);
            forecastDiv.appendChild(table2);
        }

        if (errorOccurred) {
            forecastDiv.innerHTML += `<p style="color: red;">Please correct the errors and try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function createWeatherTable(cityData, cityName) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();

    const headers = ['Day', 'High', 'Low', 'Outlook', 'Rain'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    for (let i = 0; i < 5; i++) {
        const row = table.insertRow();
        const dayCell = row.insertCell();
        const highCell = row.insertCell();
        const lowCell = row.insertCell();
        const outlookCell = row.insertCell();
        const rainCell = row.insertCell();

        dayCell.textContent = new Date(cityData.list[i * 8].dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        highCell.textContent = `${Math.round(cityData.list[i * 8].main.temp_max)}°`;
        lowCell.textContent = `${Math.round(cityData.list[i * 8].main.temp_min)}°`;
        outlookCell.innerHTML = `<img src="images/${cityData.list[i * 8].weather[0].icon}.png" alt="${cityData.list[i * 8].weather[0].description}">`;
        rainCell.textContent = `${cityData.list[i * 8].pop * 100}%`;
    }

    const cityHeader = document.createElement('h3');
    cityHeader.textContent = cityName;
    const container = document.createElement('div');
    container.appendChild(cityHeader);
    container.appendChild(table);

    return container;
}
