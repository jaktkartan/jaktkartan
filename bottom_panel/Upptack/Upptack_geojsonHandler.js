var Upptack_geojsonHandler;

setTimeout(function() {
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
    };

    Upptack_geojsonHandler = (function(map) {
        var layerIsActive = {
            'Mässor': false,
            'Jaktkort': false,
            'Jaktskyttebanor': false
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

        function clearAllLayers() {
            console.log("Clearing all layers from Upptack_geojsonHandler.");
            Object.keys(geojsonLayers).forEach(function(layerName) {
                geojsonLayers[layerName].forEach(function(layer) {
                    if (map.hasLayer(layer)) {
                        map.removeLayer(layer);
                        console.log("Removed layer from Upptack_geojsonHandler:", layerName);
                    }
                });
                geojsonLayers[layerName] = [];
                layerIsActive[layerName] = false;
            });
            console.log("All layers cleared in Upptack_geojsonHandler.");
        }

        function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        var geojson = response.data;
                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                var style = getMarkerStyle(layerName);
                                return L.marker(latlng, { icon: style.icon });
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
                        console.error("Error fetching GeoJSON data:", error.message);
                    });
            });
        }

        function toggleLayer(layerName) {
            console.log("Toggling layer:", layerName);

            if (layerName === 'Visa_allt') {
                activateAllLayers();
            } else if (layerName === 'Rensa_allt') {
                clearAllLayers(); // Rensa alla lager
            } else {
                clearAllLayers(); // Rensa alla lager först
                activateLayer(layerName);
            }
        }

        function activateLayer(layerName) {
            console.log("Activating layer:", layerName);
            fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
            layerIsActive[layerName] = true;
        }

        function activateAllLayers() {
            console.log("Activating all layers.");
            Object.keys(layerIsActive).forEach(function(layerName) {
                activateLayer(layerName);
            });
        }

        function generatePopupContent(feature, layerName) {
            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
            var hideProperties = ['id', 'AKTUALITET'];
            var hideNameOnlyProperties = ['NAMN', 'INFO', 'LINK', 'VAGBESKRIV'];

            for (var prop in feature.properties) {
                if (hideProperties.includes(prop)) continue;
                var value = feature.properties[prop];

                if (prop === 'BILD' && value) {
                    popupContent += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                } else if ((prop === 'LINK' || prop === 'VAGBESKRIV') && value) {
                    popupContent += '<p><a href="' + value + '" target="_blank">' + (prop === 'LINK' ? 'Länk' : 'Vägbeskrivning') + '</a></p>';
                } else if (hideNameOnlyProperties.includes(prop) && value) {
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

        // Initial ladda lager
        Object.keys(layerURLs).forEach(function(layerName) {
            fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
        });

        // Hantera zoomnivåändringar
        map.on('zoomend', function() {
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
            toggleLayer: toggleLayer
        };
    })(map);
}, 1000);
