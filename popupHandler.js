<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet Map with Panel Example</title>
    <style>
        #map {
            height: 600px;
        }

        #panel {
            position: absolute;
            bottom: 10px;
            left: 10px;
            width: calc(100% - 20px);
            max-width: 300px;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="panel">
        <div id="panel-content">
            <!-- Innehåll i panelen uppdateras dynamiskt här -->
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        // Skapa Leaflet-kartan
        var map = L.map('map').setView([52.5, 13.4], 10); // Exempelkoordinater och zoomnivå

        // Lägg till en bas-karta (t.ex. OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Funktion för att skapa en markör och binda klickhändelse för att visa panelen
        function createMarkerWithPanel(map, feature) {
            var properties = feature.properties;

            var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
                .addTo(map);

            marker.on('click', function () {
                // Uppdatera panelens innehåll baserat på markörens egenskaper
                updatePanelContent(properties);

                // Visa panelen när användaren klickar på markören
                showPanel();
            });
        }

        // Funktion för att visa panelen
        function showPanel() {
            var panel = document.getElementById('panel');
            panel.style.display = 'block';
        }

        // Funktion för att dölja panelen
        function hidePanel() {
            var panel = document.getElementById('panel');
            panel.style.display = 'none';
        }

        // Funktion för att uppdatera panelens innehåll baserat på markerens egenskaper
        function updatePanelContent(properties) {
            var panelContent = document.getElementById('panel-content');
            var content = '';

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var value = properties[key];
                    content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
                }
            }

            panelContent.innerHTML = content;
        }

        // Exempel på hur du kan använda funktionen med din GeoJSON-data
        var sampleGeoJsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [13.4, 52.5] // Exempelkoordinater
                    },
                    "properties": {
                        "name": "Example Marker",
                        "description": "This is a sample panel"
                        // Add more properties as needed
                    }
                }
                // Add more features as needed
            ]
        };

        L.geoJSON(sampleGeoJsonData, {
            onEachFeature: function (feature, layer) {
                createMarkerWithPanel(map, feature);
            }
        }).addTo(map);
    </script>
</body>
</html>
