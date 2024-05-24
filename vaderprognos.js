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
    const forecastAPIURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;

    fetch(forecastAPIURL)
        .then(response => response.json())
        .then(data => {
            const timeseries = data.properties.timeseries;

            let weatherForecast = '';
            let prevWeather = null;
            let prevTime = null;

            timeseries.forEach((forecast, index) => {
                const startTime = new Date(forecast.time);
                const endTime = new Date(forecast.time + forecast.data.instant.details.duration);

                const weather = translateWeatherSymbol(forecast.data.next_1_hours?.summary?.symbol_code);

                // Kolla om det är första prognosen eller om vädret har ändrats
                if (prevWeather === null || weather !== prevWeather) {
                    if (prevTime !== null) {
                        weatherForecast += `${formatTime(prevTime)}-${formatTime(startTime)}: ${prevWeather}<br>`;
                    }
                    prevWeather = weather;
                    prevTime = endTime;
                }

                // Om det är sista prognosen, lägg till det sista vädret i prognosen
                if (index === timeseries.length - 1) {
                    weatherForecast += `${formatTime(prevTime)}-${formatTime(endTime)}: ${weather}<br>`;
                }
            });

            document.getElementById('weather-text').innerHTML = 'Väderprognos:<br>' + weatherForecast;
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

// Hämta användarens position och väderprognos när sidan laddas
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherForecast(latitude, longitude);
    },
    function (error) {
        console.log("Geolocation failed: " + error.message);
        getPositionFromIP();
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
} else {
    map.setView([62.0, 15.0], 5);
}
