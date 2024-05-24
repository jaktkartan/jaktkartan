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
            for (let i = 0; i < timeseries.length; i++) {
                const time = new Date(timeseries[i].time);
                const weather = translateWeatherSymbol(timeseries[i].data.next_1_hours?.summary?.symbol_code);

                if (weather !== currentWeather) {
                    if (startTime !== null) {
                        // Hämta nästa väder för att beräkna tiden tills nästa väder
                        const nextWeatherTime = new Date(timeseries[i].time);
                        const timeDiff = nextWeatherTime - endTime;
                        const hoursDiff = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                        const minutesDiff = Math.floor((timeDiff / (1000 * 60)) % 60);
                        const duration = `${hoursDiff}h ${minutesDiff}m`;

                        weatherForecast += `${formatTime(startTime)}-${formatTime(endTime)}: ${currentWeather} (${duration})<br>`;
                    }
                    currentWeather = weather;
                    startTime = time;
                }
                // Spara den aktuella tidsstämpeln som slutet
                endTime = time;
            }

            // Hantera det sista väderförhållandet
            if (startTime !== null) {
                // Kontrollera om det är den sista tidsstämpeln
                if (endTime === null) {
                    endTime = new Date(timeseries[timeseries.length - 1].time);
                }
                weatherForecast += `${formatTime(startTime)}-${formatTime(endTime)}: ${currentWeather}<br>`;
            }

            document.getElementById('weather-text').innerHTML = '24-timmars prognos: <br>' + weatherForecast;
        })
        .catch(error => {
            console.log('Fel vid hämtning av väderprognos:', error);
            document.getElementById('weather-text').textContent = 'Kunde inte hämta väderprognos.';
        });
}
