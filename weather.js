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
 
    const apiKey = 'c3bedf58e027becd738ffc70e92c4e09';  // Replace with your actual API key
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

    const iconURLs = {
        '01': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Weather-few-clouds.svg/2048px-Weather-few-clouds.svg.png',
        '02': 'https://cdn1.iconfinder.com/data/icons/weather-forecast-meteorology-color-1/128/weather-rain-light-512.png',
        '03': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
        '04': 'https://i.pngimg.me/thumb/f/720/freesvgorg18955.jpg',
        '05': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
        '06': 'https://cdn1.iconfinder.com/data/icons/weather-flat-26/64/weather_cloud_forecast_thunder_storm-512.png',
        '07': 'https://cdn1.iconfinder.com/data/icons/weather-2-colored/512/heavy_snowfall-512.png',
    };
 
    for (let i = 0; i < 5; i++) {
        const row = table.insertRow();
        const dayCell = row.insertCell();
        const highCell = row.insertCell();
        const lowCell = row.insertCell();
        const outlookCell = row.insertCell();
        const rainCell = row.insertCell();

        console.log(new Date(cityData.list[i * 8].dt_txt).toLocaleDateString('en-US', { weekday: 'short' }))
        console.log(new Date)

        let dailyHigh = -Infinity;
        let dailyLow = Infinity;
        let pop = 0;
        
        for (let j = i * 8; j < (i + 1) * 8; j++) {
            const temp = cityData.list[j].main.temp;
            dailyHigh = Math.max(dailyHigh, temp);
            dailyLow = Math.min(dailyLow, temp);
            pop += cityData.list[j].pop;
        }
        pop /= 8 
 
        dayCell.textContent = new Date(cityData.list[i * 8].dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        highCell.textContent = `${Math.round(dailyHigh)}°`;
        lowCell.textContent = `${Math.round(dailyLow)}°`;
        outlookCell.innerHTML = `<img src="${iconURLs}" alt="${cityData.list[i * 8].weather[0].description}" style="width:50px;height:50px;">`;
        rainCell.textContent = `${Math.round(pop * 100)}%`;
    }
 
    const cityHeader = document.createElement('h3');
    cityHeader.textContent = cityName;
    const container = document.createElement('div');
    container.appendChild(cityHeader);
    container.appendChild(table);
 
    return container;
 }
 