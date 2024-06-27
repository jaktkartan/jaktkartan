// Gör Upptack_geojsonHandler global
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

        var layerStyles = {
            'Mässor': {
                icon: L.icon({
                    iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/massor.png?raw=true',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                }),
                fallbackStyle: { color: 'orange', radius: 5, fillColor: 'orange', fillOpacity: 0.8 }
            },
            'Jaktkort': {
                icon: L.icon({
                    iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/jaktkort.png?raw=true',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                }),
                fallbackStyle: { color: 'blue', radius: 5, fillColor: 'blue', fillOpacity: 0.8 }
            },
            'Jaktskyttebanor': {
                icon: L.icon({
                    iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/jaktskyttebanor.png?raw=true',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                }),
                fallbackStyle: { color: 'green', radius: 5, fillColor: 'green', fillOpacity: 0.8 }
            }
        };

        // Funktion för att hämta GeoJSON-data och skapa lagret med stil
        function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        var geojson = response.data;
                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                var style = getMarkerStyle(layerName);

                                if (style.icon) {
                                    return L.marker(latlng, { icon: style.icon });
                                } else {
                                    return L.circleMarker(latlng, style);
                                }
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

        // Funktion för att hämta filnamn från URL
        function getFilenameFromURL(url) {
            var filename = "";
            if (url) {
                var pathArray = url.split('/');
                filename = pathArray[pathArray.length - 1];
            }
            return filename;
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

        // Funktion för att hämta stil baserat på zoomnivå
        function getMarkerStyle(layerName) {
            var zoomLevel = map.getZoom();
            var style;

            if (zoomLevel >= 7 && zoomLevel <= 18) {
                style = {
                    icon: layerStyles[layerName].icon
                };
            } else {
                style = layerStyles[layerName].fallbackStyle || {
                    // Fallback to a default marker if no specific style is found
                    color: 'gray', // Default color
                    radius: 5,
                    fillColor: 'gray',
                    fillOpacity: 0.8
                };
            }

            console.log("Zoom level for layer " + layerName + " is: " + zoomLevel);

            return style;
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
                        var style = getMarkerStyle(layerName);
                        if (style.icon) {
                            marker.setIcon(style.icon); // Sätt ikon för varje markör
                        } else if (marker.setStyle) {
                            marker.setStyle(style); // Sätt stil för varje punktobjekt
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
