// Funktion som översätter vädersymbolkoder till förståeliga strängar på svenska.
const translateWeatherSymbol = (symbolCode) => {
    switch(symbolCode) {
        case 'clearsky_day':
            return 'klart väder';
        case 'clearsky_night':
            return 'klart väder';
        case 'partlycloudy_day':
            return 'delvis molnigt';
        case 'partlycloudy_night':
            return 'delvis molnigt';
        case 'cloudy':
            return 'molnigt';
        case 'fair_day':
            return 'växlande molnighet';
        case 'fair_night':
            return 'växlande molnighet';
        case 'rain':
            return 'regn';
        case 'lightrain':
            return 'lätt regn';
        case 'lightrain_showers_day':
            return 'lätt regnskurar';
        case 'lightrain_showers_night':
            return 'lätt regnskurar';
        case 'rain_showers_day':
            return 'regnskurar';
        case 'rain_showers_night':
            return 'regnskurar';
        case 'heavyrain':
            return 'kraftigt regn';
        case 'thunderstorm':
            return 'åska';
        case 'sleet':
            return 'snöblandat regn';
        case 'snow':
            return 'snö';
        case 'sleet_showers_day':
            return 'snöblandade regnskurar';
        case 'sleet_showers_night':
            return 'snöblandade regnskurar';
        case 'snow_showers_day':
            return 'snöskurar';
        case 'snow_showers_night':
            return 'snöskurar';
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
            const now = new Date();
            const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 timmar senare
            timeseries.forEach((forecast, index) => {
                // Kontrollera om 'forecast' är definierat och har 'time' egenskapen
                if (!forecast || !forecast.time) {
                    return; // Hoppa över denna iteration om 'forecast' saknar 'time'
                }
                const forecastTime = new Date(forecast.time);
                if (forecastTime <= twentyFourHoursLater) {
                    const weather = translateWeatherSymbol(forecast.data.next_1_hours?.summary?.symbol_code);
                    weatherForecast += `${forecastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${weather}<br>`;
                }
            });
            document.getElementById('weather-text').innerHTML = weatherForecast;
        })
        .catch(error => {
            console.error('Fel vid hämtning av väderprognos:', error);
            document.getElementById('weather-text').innerHTML = 'Misslyckades att hämta väderprognos.';
        });
}

console.log("Weather forecast initialized.");
