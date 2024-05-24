// En funktion som översätter vädersymbolkoder till förståeliga strängar på svenska.
const translateWeatherSymbol = (symbolCode) => {
    switch(symbolCode) {
        case 'clearsky_day':
            return 'klart väder (dag)';
        case 'clearsky_night':
            return 'klart väder (natt)';
        case 'partlycloudy_day':
            return 'delvis molnigt (dag)';
        case 'partlycloudy_night':
            return 'delvis molnigt (natt)';
        case 'cloudy':
            return 'molnigt';
        case 'fair_day':
            return 'växlande molnighet (dag)';
        case 'fair_night':
            return 'växlande molnighet (natt)';
        case 'rain':
            return 'regn';
        case 'lightrain_showers_day':
            return 'lätt regnskurar (dag)';
        case 'lightrain_showers_night':
            return 'lätt regnskurar (natt)';
        case 'rain_showers_day':
            return 'regnskurar (dag)';
        case 'rain_showers_night':
            return 'regnskurar (natt)';
        case 'heavyrain':
            return 'kraftigt regn';
        case 'thunderstorm':
            return 'åska';
        case 'sleet':
            return 'snöblandat regn';
        case 'snow':
            return 'snö';
        case 'sleet_showers_day':
            return 'snöblandade regnskurar (dag)';
        case 'sleet_showers_night':
            return 'snöblandade regnskurar (natt)';
        case 'snow_showers_day':
            return 'snöskurar (dag)';
        case 'snow_showers_night':
            return 'snöskurar (natt)';
        default:
            return symbolCode ? `okänt väder (${symbolCode})` : 'okänt väder';
    }
}

// Funktion för att hämta väderprognosen från en väder-API baserat på givna latitud- och longitudvärden.
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
                        endTime = time;
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

// Hjälpfunktion för att formatera tiden i ett läsbart format.
const formatTime = (time) => {
    return time.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

