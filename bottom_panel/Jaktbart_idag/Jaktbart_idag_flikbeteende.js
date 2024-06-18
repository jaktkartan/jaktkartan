// Funktionsdeklaration för att hämta jaktbart idag information
function fetchJaktbartIdagData(lan) {
    // Här skriver vi kod för att hämta och visa jaktbart idag information baserat på län
    console.log(`Fetching jaktbart idag data for ${lan}`);
    // Exempel: använd axios för att hämta data från Google Sheet eller annan källa
    axios.get('URL_TILL_DITT_GOOGLE_SHEET_API', {
        params: {
            lan: lan
        }
    })
    .then(function(response) {
        // Bearbeta och visa data i din applikation
        console.log(response.data);
    })
    .catch(function(error) {
        console.error('Error fetching jaktbart idag data:', error);
    });
}

// Funktionsdeklaration för att få användarens län baserat på position
function getUserCounty(lat, lon) {
    return axios.get('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
        .then(function(response) {
            var geojson = response.data;
            var userCounty = null;

            L.geoJSON(geojson, {
                onEachFeature: function(feature, layer) {
                    var polygon = L.geoJSON(feature.geometry);
                    if (polygon.getBounds().contains([lat, lon])) {
                        userCounty = feature.properties.LÄN; // Använd rätt fältnamn
                    }
                }
            });

            if (userCounty) {
                return userCounty;
            } else {
                throw new Error('User is not located within any county polygon.');
            }
        })
        .catch(function(error) {
            console.error('Error determining user county:', error);
            return null;
        });
}

// Funktion för att hantera användarens position
function handleUserPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(`User position: ${lat}, ${lon}`);

    getUserCounty(lat, lon)
        .then(function(lan) {
            if (lan) {
                console.log(`User is located in ${lan}`);
                fetchJaktbartIdagData(lan);
            } else {
                console.error('Could not determine user county.');
            }
        });
}

// Starta process för att få användarens position
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleUserPosition, function(error) {
        console.error('Geolocation error:', error);
    }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
} else {
    console.error('Geolocation is not supported by this browser.');
}
