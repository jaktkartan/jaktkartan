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
                iconUrl: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_massor.png',
                    fallbackIconSize: [15, 15]
                }
            },
            'Jaktkort': {
                iconUrl: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktkort.png',
                    fallbackIconSize: [15, 15]
                }
            },
            'Jaktskyttebanor': {
                iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/ikon_jaktskyttebanor.png?raw=true',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktskyttebanor.png',
                    fallbackIconSize: [15, 15]
                }
            }
        };

        function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        var geojson = response.data;
                        console.log("Fetched GeoJSON data for " + layerName + ":", geojson); // Debug log

                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                var style = getMarkerStyle(layerName);
                                var marker = L.marker(latlng, { icon: style.icon });

                                // Lägg till klick-event för att centrera kartan och öppna popup
                                marker.on('click', function() {
                                    handleMarkerClick(marker);
                                });

                                return marker;
                            },
                            style: function(feature) {
                                return getFallbackStyle(layerName);
                            },
                            onEachFeature: function(feature, layer) {
                                var popupContent = generatePopupContent(feature, layerName);
                                layer.bindPopup(popupContent);
                            }
                        });

                        geojsonLayers[layerName].push(layer);

                        if (layerIsActive[layerName]) {
                            layer.addTo(map);
                        }
                    })
                    .catch(function(error) {
                        console.log("Error fetching GeoJSON data for " + layerName + ":", error.message);
                    });
            });
        }

        function handleMarkerClick(marker) {
            var latlng = marker.getLatLng();
            map.panTo(latlng, { animate: true, duration: 1 }); // Panorera kartan med animation

            // Öppna popup-fönstret efter en liten fördröjning
            setTimeout(function() {
                marker.openPopup();
            }, 1000); // Timeout som matchar animationens varaktighet
        }

        function toggleLayer(layerName) {
            if (layerName === 'Visa_allt') {
                activateAllLayers();
            } else if (layerName === 'Rensa_allt') {
                deactivateAllLayers();
            } else {
                deactivateAllLayers();
                activateLayer(layerName);
            }
        }

        function activateLayer(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                layer.addTo(map);
            });
            layerIsActive[layerName] = true;
        }

        function activateAllLayers() {
            Object.keys(geojsonLayers).forEach(function(layerName) {
                activateLayer(layerName);
            });
        }

        function deactivateAllLayers() {
            Object.keys(layerIsActive).forEach(function(name) {
                if (layerIsActive[name]) {
                    geojsonLayers[name].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    layerIsActive[name] = false;
                }
            });
        }

        function generatePopupContent(feature, layerName) {
            console.log("Feature properties:", feature.properties); // Debug log
            
            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

            // Definiera fält som ska användas för olika lager
            var fields = {
                'Mässor': ['NAMN', 'INFO', 'LINK', 'VAGBESKRIV'],
                'Jaktkort': ['Rubrik', 'Info', 'Link', 'VAGBESKRIV']
            };

            var hideProperties = [];
            var hideNameOnlyProperties = fields[layerName] || [];

            for (var prop in feature.properties) {
                if (hideProperties.includes(prop)) continue;
                var value = feature.properties[prop];

                // Kontrollera om det är en bild och lägg till den i popupen
                if (prop === 'BILD' && value) {
                    popupContent += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                } 
                // Kontrollera om det är en länk och lägg till den i popupen
                else if (prop === 'LINK' || prop === 'Link') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Länk</a></p>';
                    }
                } 
                // Kontrollera om det är en vägbeskrivning och lägg till den i popupen
                else if (prop === 'VAGBESKRIV' || prop === 'VägBeskrivning') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Vägbeskrivning</a></p>';
                    }
                } 
                // Hantera andra fält
                else if (hideNameOnlyProperties.includes(prop) && value) {
                    popupContent += '<p>' + value + '</p>';
                } else if (value) {
                    popupContent += '<p><strong>' + prop + ':</strong> ' + value + '</p>';
                }
            }

            popupContent += '</div>';
            return popupContent;
        }

        function getIconAnchor(iconSize) {
            return [iconSize[0] / 2, iconSize[1] / 2];
        }

        function getMarkerStyle(layerName) {
            var zoomLevel = map.getZoom();
            var style;

            if (zoomLevel >= 7 && zoomLevel <= 18) {
                style = {
                    icon: L.icon({
                        iconUrl: layerStyles[layerName].iconUrl,
                        iconSize: layerStyles[layerName].iconSize,
                        iconAnchor: getIconAnchor(layerStyles[layerName].iconSize),
                        popupAnchor: [0, -layerStyles[layerName].iconSize[1] / 2]
                    })
                };
            } else {
                style = {
                    icon: L.icon({
                        iconUrl: layerStyles[layerName].fallbackStyle.fallbackIconUrl,
                        iconSize: layerStyles[layerName].fallbackStyle.fallbackIconSize,
                        iconAnchor: getIconAnchor(layerStyles[layerName].fallbackStyle.fallbackIconSize),
                        popupAnchor: [0, -layerStyles[layerName].fallbackStyle.fallbackIconSize[1] / 2]
                    })
                };
            }

            return style;
        }

        function getFallbackStyle(layerName) {
            return layerStyles[layerName].fallbackStyle;
        }

        fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
        fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
        fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

        // Lägg till lyssnare för zoomhändelser
        map.on('zoomend', function() {
            console.log("Zoom level changed to: " + map.getZoom());
            Object.keys(geojsonLayers).forEach(function(layerName) {
                geojsonLayers[layerName].forEach(function(layer) {
                    var zoomLevel = map.getZoom();
                    layer.eachLayer(function(marker) {
                        var style = getMarkerStyle(layerName);
                        marker.setIcon(style.icon);
                    });
                });
            });
        });

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers
        };
    })(map);
}, 1000);
