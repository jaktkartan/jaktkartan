var layerURLs = {
    'Mässor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/Massor.geojson'],
    'Jaktkort': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktkort.geojson'],
    'Jaktskyttebanor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
};

var Upptack_geojsonHandler;

setTimeout(function() {
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
                iconUrl: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktskyttebanor.png',
                    fallbackIconSize: [15, 15]
                }
            }
        };

        var firstClickHandled = false;

        async function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            for (const geojsonURL of geojsonURLs) {
                try {
                    const response = await axios.get(geojsonURL);
                    const geojson = response.data;
                    const layer = L.geoJSON(geojson, {
                        pointToLayer: function(feature, latlng) {
                            var style = getMarkerStyle(layerName);
                            return L.marker(latlng, { icon: style.icon });
                        },
                        style: function(feature) {
                            return getFallbackStyle(layerName);
                        },
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer);
                        }
                    });

                    geojsonLayers[layerName].push(layer);

                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }

                    console.log(`Layer ${layerName} fetched and created.`);
                } catch (error) {
                    console.log("Error fetching GeoJSON data for " + layerName + ":", error.message);
                }
            }
        }

        function toggleLayer(layerName, activate) {
            if (!firstClickHandled) {
                // Om detta är första trycket efter att tab1 öppnats, släck alla lager utom det valda
                deactivateAllLayers();
                firstClickHandled = true;  // Flagga att första trycket är hanterat
            }
            
            if (activate) {
                activateLayer(layerName);
            } else {
                deactivateLayer(layerName);
            }
        }

        function activateLayer(layerName) {
            if (!geojsonLayers[layerName].length) {
                fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    layer.addTo(map);
                });
            }
            layerIsActive[layerName] = true;
            document.getElementById(layerName.toLowerCase() + 'Checkbox').checked = true;
        }

        function deactivateLayer(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            layerIsActive[layerName] = false;
            document.getElementById(layerName.toLowerCase() + 'Checkbox').checked = false;
        }

        function activateAllLayers() {
            Object.keys(layerURLs).forEach(function(layerName) {
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

        function addClickHandlerToLayer(layer) {
            layer.on('click', function(e) {
                if (e.originalEvent) {
                    e.originalEvent.stopPropagation();
                }
                var properties = e.target.feature.properties;
                console.log('Klickade på ett geojson-objekt med egenskaper:', properties);
                if (!popupPanelVisible) {
                    showPopupPanel(properties);
                } else {
                    updatePopupPanelContent(properties);
                }
            });
        }

        // Initialisera alla lager från början
        activateAllLayers();

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers,
            activateAllLayers: activateAllLayers,
            activateLayer: activateLayer,
            deactivateLayer: deactivateLayer,
            resetFirstClickHandled: function() { firstClickHandled = false; }  // Lägg till denna metod
        };
    })(map);
}, 1000);

// Knappen tab2 (kartor) rensar geojson-lager från tab1 (upptäck) fliken.
document.getElementById('tab2').addEventListener('click', function() {
    if (typeof Upptack_geojsonHandler !== 'undefined') {
        Upptack_geojsonHandler.deactivateAllLayers();
    } else {
        console.error("Upptack_geojsonHandler är inte definierad.");
    }
});
