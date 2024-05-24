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

            timeseries.forEach((forecast, index) => {
                // Kontrollera om 'forecast' är definierat och har 'time' egenskapen
                if (!forecast || !forecast.time) {
                    return; // Hoppa över denna iteration om 'forecast' saknar 'time'
                }

                const startTime = new Date(forecast.time);
                console.log('Forecast startTime:', startTime);

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

                // Om det inte är sista prognosen, lägg till väderprognos
                if (index !== timeseries.length - 1) {
                    endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Lägg till 1 timme till startTime
                    weatherForecast += `${formatTime(prevTime)}-${formatTime(endTime)}: ${weather}<br>`;
                } else {
                    // Uppdatera slutiden för det aktuella vädret
                    if (index + 1 < timeseries.length) {
                        endTime = new Date(new Date(timeseries[index + 1].time).getTime() - 1); // Nästa tidsstämpel minus 1 millisekund
                    } else {
                        endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Lägg till 1 timme till startTime
                    }
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
        console.log('User position:', latitude, longitude);
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
