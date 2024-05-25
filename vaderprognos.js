<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jaktkartan.se</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="styles.css" /> <!-- Länkar till din styles.css-fil -->
    <script src="https://unpkg.com/suncalc/suncalc.js"></script> <!-- Lägg till SunCalc-biblioteket -->
    <script src="vaderprognos.js"></script> <!-- Länk till din JavaScript-fil -->
</head>
<body>
    <div id="info-panel">
        <div id="accuracy">Lägesnoggrannhet: Unknown</div>
        <div id="sunrise-sunset">
            <img id="sunrise-icon" src="https://raw.githubusercontent.com/timothylevin/Testmiljo/main/sunrise.png" alt="Sunrise Icon" style="height: 24px;">
            <span id="sunrise"></span>
            <img id="sunset-icon" src="https://raw.githubusercontent.com/timothylevin/Testmiljo/main/sunset.png" alt="Sunset Icon" style="height: 24px;">
            <span id="sunset"></span>
            <div class="expand-toggle" onclick="togglePanel()">Väderprognos <span class="arrow">&#9660;</span></div>
            <div id="weather-info" style="display: none;">
                <div id="weather-text">Laddar väder...</div>
            </div>
        </div>
    </div>
    <div id="map"></div>
    <div class="fab">
        <button onclick="toggleFABMenu()">FUNKTIONER</button>
        <div class="fab-menu" id="menu">
            <a href="https://timothylevin.github.io/Jaktkartan_Daggdjur/#5/62.989/17.564">Allmän jakt: Däggdjur</a>
            <a href="https://timothylevin.github.io/Jaktkartan_fagel/#5/62.989/17.564">Allmän jakt: Fågel</a>
            <a href="https://timothylevin.github.io/Algjaktskarta_jakttider/#5/63.005/18.325">Älgjaktskartan</a>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
        console.log("Initializing map...");

        var map = L.map('map').setView([62.0, 15.0], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var accuracyCircle;
        var userMarker;
        var pulsingDotMarker;
        var sunriseIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/sunrise.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, 0],
        });
        var sunsetIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/sunset.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, 0],
        });

        function createPulsingCircle(lat, lon) {
            var divIcon = L.divIcon({
                className: 'pulsing-circle',
                iconSize: [12, 12],
                html: `<div class="pulsing-dot" data-lat="${lat}" data-lon="${lon}"></div>` // Lägg till data-lat och data-lon attribut
            });
            return L.marker([lat, lon], { icon: divIcon }).addTo(map);
        }
        
        function updateUserPosition(lat, lon, accuracy) {
            console.log(`Updating user position: ${lat}, ${lon}, accuracy: ${accuracy}`);

            var accuracyInfo = document.getElementById('accuracy');
            accuracyInfo.innerHTML = "Lägesnoggrannhet: " + accuracy + " meters";

            if (!accuracyCircle) {
                accuracyCircle = L.circle([lat, lon], {
                    radius: accuracy,
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    stroke: false
                }).addTo(map);
            } else {
                accuracyCircle.setLatLng([lat, lon]).setRadius(accuracy).setStyle({fillColor: 'green'});
            }

            if (!userMarker) {
                userMarker = L.marker([lat, lon], { icon: L.divIcon({className: 'transparent-marker-icon'}) }).addTo(map);
            } else {
                userMarker.setLatLng([lat, lon]);
            }

            if (!pulsingDotMarker) {
                pulsingDotMarker = createPulsingCircle(lat, lon);
            } else {
                pulsingDotMarker.setLatLng([lat, lon]);
            }

            // Beräkna soltider och uppdatera tiderna
            var times = SunCalc.getTimes(new Date(), lat, lon);
            var sunrise = times.sunrise ? times.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown';
            var sunset = times.sunset ? times.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown';
            var sunriseSpan = document.getElementById('sunrise');
            var sunsetSpan = document.getElementById('sunset');

            // Uppdatera soluppgångstid
            sunriseSpan.innerHTML = sunrise;

            // Uppdatera solnedgångstid
            sunsetSpan.innerHTML = sunset;
        }

        function getPositionFromIP() {
            axios.get('https://ipinfo.io/json?token=c57bc38a5d7e2c')
                .then(function (response) {
                    var loc = response.data.loc.split(',');
                    var lat = parseFloat(loc[0]);
                    var lon = parseFloat(loc[1]);
                    updateUserPosition(lat, lon, "Unknown");
                })
                .catch(function (error) {
                    console.log("IP Geolocation failed: " + error.message);
                });
        }

        function handleGeolocation(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var accuracy = position.coords.accuracy;
            updateUserPosition(lat, lon, accuracy.toFixed(2));
        }

        function togglePanel() {
            console.log("Toggling weather panel...");
                        var weatherInfo = document.getElementById('weather-info');
            if (weatherInfo.style.display === 'none') {
                console.log("Showing weather panel...");
                weatherInfo.style.display = 'block';
                // Hämta väderprognosen när panelen öppnas
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log("Getting current position...");
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    console.log("Current position:", latitude, longitude);
                    getWeatherForecast(latitude, longitude);
                });
            } else {
                console.log("Hiding weather panel...");
                weatherInfo.style.display = 'none';
            }
        }

        function toggleFABMenu() {
            var menu = document.getElementById('menu');
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                    handleGeolocation(position);
                },
                function (error) {
                    console.log("Geolocation failed: " + error.message);
                    getPositionFromIP();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );

            navigator.geolocation.watchPosition(
                function (position) {
                    handleGeolocation(position);
                },
                function (error) {
                    console.log("Geolocation failed: " + error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            map.setView([62.0, 15.0], 5);
        }
    </script>
</body>
</html>

