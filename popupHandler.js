document.addEventListener("DOMContentLoaded", function() {
    console.log("Popup handler script loaded.");

    setTimeout(function() {
        var mapElement = document.getElementById('map');
        var map;
        var mapInitialized = false;

        if (mapElement && !mapElement._leaflet_id && !mapInitialized) {
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

            function showPopupPanel() {
                popupPanel.style.display = 'block';
            }

            function hidePopupPanel() {
                popupPanel.style.display = 'none';
            }

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

            function addClickHandlerToLayer(layer) {
                layer.on('click', function (e) {
                    showPopupPanel();
                    updatePopupPanelContent(e.layer.feature.properties);
                });
            }

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
    }, 500); // Fördröj initialiseringen med 500 ms för att säkerställa att DOM är redo
});
