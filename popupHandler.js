document.addEventListener("DOMContentLoaded", function() {
    console.log("Popup handler script loaded.");

    var mapElement = document.getElementById('map');
    var map;
    var mapInitialized = false;

    if (mapElement && !mapElement._leaflet_id) { // Kontrollera om kartan redan finns
        console.log("Initializing map...");

        map = L.map(mapElement, {
            zoomControl: false
        }).setView([62.0, 15.0], 5);

        L.control.zoom({
            position: 'topleft'
        }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var popupPanel = document.getElementById('popup-panel');

        // Funktion för att visa panelen när användaren trycker på ett geojson-objekt
        function showPopupPanel() {
            popupPanel.style.display = 'block';
        }

        // Funktion för att dölja panelen
        function hidePopupPanel() {
            popupPanel.style.display = 'none';
        }

        // Funktion för att uppdatera panelens innehåll baserat på geojson-objektets egenskaper
        function updatePopupPanelContent(properties) {
            var panelContent = document.getElementById('popup-panel-content');
            var content = '';

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var value = properties[key];
                    content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
                }
            }

            panelContent.innerHTML = content;
        }

        // Exempel på anrop till funktionen (anpassa efter behov)
        function addClickHandlerToLayer(layer) {
            layer.on('click', function (e) {
                showPopupPanel();
                updatePopupPanelContent(e.layer.feature.properties);
            });
        }

        // Exempel på användning med en geojson-layer
        var geojsonFeature = {
            "type": "Feature",
            "properties": {
                "name": "Exempelobjekt",
                "description": "Detta är ett exempel på ett geojson-objekt."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [15.0, 62.0]
            }
        };

        var geojsonLayer = L.geoJSON(geojsonFeature).addTo(map);
        addClickHandlerToLayer(geojsonLayer);

        // Lägg till händelselyssnare för att dölja panelen vid klick utanför
        map.on('click', function(event) {
            if (popupPanel.style.display === 'block') {
                var isClickInside = popupPanel.contains(event.originalEvent.target);

                if (!isClickInside) {
                    hidePopupPanel();
                }
            }
        });

        // Markera att kartan är initialiserad
        mapInitialized = true;
    } else {
        console.error("Kart-elementet 'map' kunde inte hittas eller kartan är redan initialiserad.");
    }
});
