const getWeatherForecast = (latitude, longitude) => {
    const forecastAPIURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;

    fetch(forecastAPIURL)
        .then(response => response.json())
        .then(data => {
            const timeseries = data.properties.timeseries;

            let weatherForecast = '';
            let currentWeather = '';
            let startTime = null;
            let endTime = null;
            const now = new Date();
            for (let i = 0; i < timeseries.length; i++) {
                const time = new Date(timeseries[i].time);
                if (time > now && time <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) { // Kontrollera att tiden är inom de närmaste 24 timmarna
                    const weather = translateWeatherSymbol(timeseries[i].data.next_1_hours?.summary?.symbol_code);
                    if (weather !== currentWeather) {
                        if (startTime !== null) {
                            endTime = time;
                            weatherForecast += `${formatTime(startTime)}-${formatTime(endTime)}: ${currentWeather}<br>`;
                        }
                        currentWeather = weather;
                        startTime = time;
                    }
                }
            }

            // Hantera det sista väderförhållandet separat
            if (startTime !== null) {
                endTime = new Date(timeseries[timeseries.length - 1].time);
                weatherForecast += `${formatTime(startTime)}-${formatTime(endTime)}: ${currentWeather}<br>`;
            }

            document.getElementById('weather-text').innerHTML = '24-timmars prognos: <br>' + weatherForecast;
        })
        .catch(error => {
            console.log('Fel vid hämtning av väderprognos:', error);
            document.getElementById('weather-text').textContent = 'Kunde inte hämta väderprognos.';
        });
}
