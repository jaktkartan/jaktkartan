document.addEventListener("DOMContentLoaded", function() {
    console.log("Popup handler script loaded.");

    var mapElement = document.getElementById('map');
    var map;

    // Stilar för popup-panelen
    var popupPanel = document.getElementById('popup-panel');
    popupPanel.style.position = 'fixed';
    popupPanel.style.bottom = '0px';
    popupPanel.style.left = '0px';
    popupPanel.style.width = '100%'; // Ändrat från calc(100%)
    popupPanel.style.maxHeight = '40%';
    popupPanel.style.backgroundColor = '#fff';
    popupPanel.style.borderTop = '5px solid rgb(50, 94, 88)';
    popupPanel.style.padding = '10px';
    popupPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    popupPanel.style.zIndex = '1000';
    popupPanel.style.display = 'none';
    popupPanel.style.overflowY = 'auto'; // Lägger till scrollbar vid behov
    popupPanel.style.wordWrap = 'break-word'; // Bryter text vid behov

    if (mapElement) {
        if (!mapElement._leaflet_id) { // Kontrollera om kartan redan är initialiserad
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
        } else {
            console.error("Kartan är redan initialiserad.");
        }
    } else {
        console.error("Kart-elementet 'map' kunde inte hittas.");
    }
});
