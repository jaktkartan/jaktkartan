console.log("Initializing weather forecast...");

// Funktion som översätter vädersymbolkoder till förståeliga strängar på svenska.
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
        case 'lightrain':
            return 'lätt regn';
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
        case 'fog':
            return 'dimma';
        default:
            return symbolCode ? `okänt väder (${symbolCode})` : 'okänt väder';
    }
}

// Funktion för att hämta väderprognosen från en väder-API baserat på givna latitud- och longitudvärden.
const getWeatherForecast = (latitude, longitude) => {
    console.log('Hämtar väderprognos för lat:', latitude, 'lon:', longitude);
    const forecastAPIURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
    fetch(forecastAPIURL)
        .then(response => {
            console.log('Svar mottagen från API');
            return response.json();
        })
        .then(data => {
            console.log('Data parsad');
            const timeseries = data.properties.timeseries;
            console.log('Timeseries:', timeseries);
            if (!timeseries || timeseries.length === 0) {
                throw new Error('Ingen väderprognos tillgänglig.');
            }
            let weatherForecast = '';
            let prevWeather = null;
            let prevTime = null;
            let endTime = null;
            // Hämta tid för 24 timmar framåt
            const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
            timeseries.forEach((forecast, index) => {
                // Kontrollera om 'forecast' är definierat och har 'time' egenskapen
                if (!forecast || !forecast.time) {
                    return; // Hoppa över denna iteration om 'forecast' saknar 'time'
                }
                const startTime = new Date(forecast.time);
                console.log('Forecast startTime:', startTime);
                // Kontrollera om prognosen är inom de kommande 24 timmarna
                if (startTime > twentyFourHoursFromNow) {
                    return; // Hoppa över prognoser som är längre än 24 timmar framåt
                }
                const weather = translateWeatherSymbol(forecast.data.next_1_hours?.summary?.symbol_code);
                console.log('Weather:', weather);
                // Kolla om det är första prognosen eller om vädret har ändrats
                if (prevWeather === null || weather !== prevWeather) {
                    if (prevTime !== null) {
                        // Lägg till slutiden för det föregående vädret
                        weatherForecast += `${formatTime(prevTime)}-${formatTime(endTime)}: ${prevWeather}<br>`;
                    }
                    prevWeather = weather;
                    prevTime = startTime;
                }
                // Uppdatera endast slutiden om vädret faktiskt förändras
                if (weather !== prevWeather) {
                    endTime = startTime;
                }
            });
            // Lägg till den sista väderprognosen om det finns data kvar
            if (prevWeather !== null) {
                weatherForecast += `${formatTime(prevTime)}-${formatTime(endTime)}: ${prevWeather}<br>`;
            }
            document.getElementById('weather-text').innerHTML = weatherForecast;
        })
        .catch(error => {
            console.error('Fel vid hämtning av väderprognos:', error);
            document.getElementById('weather-text').innerHTML = 'Misslyckades att hämta väderprognos.';
        });
}

// Funktion för att formatera tid till HH:MM-format
const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

console.log("Weather forecast initialized.");
