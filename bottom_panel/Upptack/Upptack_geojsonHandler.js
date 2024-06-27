var Upptack_geojsonHandler;

setTimeout(function() {
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
    };

    Upptack_geojsonHandler = (function(map) {
        var layerIsActive = {
            'Mässor': true,
            'Jaktkort': true,
            'Jaktskyttebanor': true
        };

        var geojsonLayers = {
            'Mässor': [],
            'Jaktkort': [],
            'Jaktskyttebanor': []
        };

        // Funktion för att hämta GeoJSON-data och skapa lagret med stil
        function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        var geojson = response.data;
                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                return L.marker(latlng, {
                                    icon: getMarkerIcon(layerName)
                                });
                            },
                            onEachFeature: function(feature, layer) {
                                var popupContent = generatePopupContent(feature);
                                layer.bindPopup(popupContent);
                            }
                        });

                        geojsonLayers[layerName].push(layer);

                        if (layerIsActive[layerName]) {
                            layer.addTo(map);
                        }
                    })
                    .catch(function(error) {
                        console.log("Error fetching GeoJSON data:", error.message);
                    });
            });
        }

        // Funktion för att toggla lagret
        function toggleLayer(layerName) {
            console.log("Toggling layer:", layerName); // Debug: Kontrollera vilken layer som togglas
            if (layerName === 'Visa_allt') {
                activateAllLayers();
            } else if (layerName === 'Rensa_allt') {
                deactivateAllLayers();
            } else {
                deactivateAllLayers();
                activateLayer(layerName);
            }
        }

        // Funktion för att aktivera ett lager
        function activateLayer(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                layer.addTo(map);
            });
            layerIsActive[layerName] = true;
            console.log("Activated layer:", layerName); // Debug: Bekräfta aktivering
        }

        // Funktion för att aktivera alla lager
        function activateAllLayers() {
            Object.keys(geojsonLayers).forEach(function(layerName) {
                activateLayer(layerName);
            });
        }

        // Funktion för att avaktivera alla lager
        function deactivateAllLayers() {
            Object.keys(layerIsActive).forEach(function(name) {
                if (layerIsActive[name]) {
                    geojsonLayers[name].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    layerIsActive[name] = false;
                    console.log("Deactivated layer:", name); // Debug: Bekräfta avaktivering
                }
            });
        }

        // Funktion för att hämta ikon för lagret
        function getMarkerIcon(layerName) {
            var zoomLevel = map.getZoom();
            var iconUrl;

            // Välj ikon beroende på zoomnivå och lager
            switch (layerName) {
                case 'Mässor':
                    iconUrl = 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/upptack.png?raw=true';
                    break;
                case 'Jaktkort':
                    iconUrl = 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/upptack.png?raw=true';
                    break;
                case 'Jaktskyttebanor':
                    iconUrl = 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/upptack.png?raw=true';
                    break;
                default:
                    // Fallback till standard markör om ingen ikon är definierad
                    return L.marker(latlng); 
            }

            // Returnera ikon om URL är definierad
            if (iconUrl) {
                return L.icon({
                    iconUrl: iconUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
            } else {
                // Returnera en standard markör om ikonUrl inte är definierad
                return L.marker(latlng);
            }
        }

        // Funktion för att generera popup-innehåll
        function generatePopupContent(feature) {
            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
            var hideProperties = ['id', 'Aktualitet'];
            var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

            for (var prop in feature.properties) {
                if (hideProperties.includes(prop)) continue;
                if (prop === 'BILD') {
                    popupContent += '<p><img src="' + feature.properties[prop] + '" style="max-width: 100%;" alt="Bild"></p>';
                } else if (prop === 'LINK' || prop === 'VAGBESKRIV') {
                    popupContent += '<p><a href="' + feature.properties[prop] + '" target="_blank">Länk</a></p>';
                } else if (hideNameOnlyProperties.includes(prop)) {
                    popupContent += '<p>' + feature.properties[prop] + '</p>';
                } else {
                    popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                }
            }

            popupContent += '</div>';
            return popupContent;
        }

        // Initialisera alla lager vid start
        fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
        fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
        fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

        // Lyssna på zoomändringar på kartan
        map.on('zoomend', function() {
            Object.keys(geojsonLayers).forEach(function(layerName) {
                geojsonLayers[layerName].forEach(function(layer) {
                    var zoomLevel = map.getZoom();
                    console.log("Zoom level for layer " + layerName + " is: " + zoomLevel);

                    layer.eachLayer(function(marker) {
                        if (marker instanceof L.Marker && getMarkerIcon(layerName)) {
                            var icon = getMarkerIcon(layerName);
                            marker.setIcon(icon);
                        }
                    });
                });
            });
        });

        return {
            toggleLayer: toggleLayer
        };
    })(map); // Skicka map som parameter till självinkapslad funktion
}, 1000); // Fördröj initialiseringen av Upptack_geojsonHandler.js med 1000 ms (1 sekund)
