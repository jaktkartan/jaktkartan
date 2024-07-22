var Upptack_geojsonHandler;

setTimeout(function() {
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
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
                iconUrl: 'https://github.com/jaktkartan/jaktkartan/blob/main/bilder/ikon_jaktskyttebanor.png?raw=true',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktskyttebanor.png',
                    fallbackIconSize: [15, 15]
                }
            }
        };

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
                            var popupContent = generatePopupContent(feature, layerName);
                            layer.bindPopup(popupContent);
                        }
                    });

                    geojsonLayers[layerName].push(layer);

                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }
                } catch (error) {
                    console.log("Error fetching GeoJSON data for " + layerName + ":", error.message);
                }
            }
            updateFAB(layerName, true);
        }

        function toggleLayer(layerName, geojsonURLs) {
            if (layerIsActive[layerName]) {
                deactivateLayer(layerName);
                return;
            }

            deactivateAllLayers();
            layerIsActive[layerName] = true;

            if (geojsonURLs) {
                fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
            }
        }

        function deactivateAllLayers() {
            Object.keys(layerIsActive).forEach(function(layerName) {
                if (layerIsActive[layerName]) {
                    deactivateLayer(layerName);
                }
            });
        }

        function deactivateLayer(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
            updateFAB(layerName, false);
        }

        function generatePopupContent(feature, layerName) {
            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
            var fields = {
                'Mässor': ['NAMN', 'INFO', 'LINK', 'VAGBESKRIV'],
                'Jaktkort': ['Rubrik', 'Info', 'Link', 'VAGBESKRIV']
            };
            var hideProperties = [];
            var hideNameOnlyProperties = fields[layerName] || [];

            for (var prop in feature.properties) {
                if (hideProperties.includes(prop)) continue;
                var value = feature.properties[prop];

                if (prop === 'BILD' && value) {
                    popupContent += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                } else if (prop === 'LINK' || prop === 'Link') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Länk</a></p>';
                    }
                } else if (prop === 'VAGBESKRIV' || prop === 'VägBeskrivning') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Vägbeskrivning</a></p>';
                    }
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

        function updateFAB(layerName, show) {
            var fabButtons = document.querySelectorAll('.fab');
            fabButtons.forEach(function(button) {
                button.style.display = 'none';
            });

            var fabId = getFABId(layerName);
            var fabButton = document.getElementById(fabId);
            if (fabButton) {
                fabButton.style.display = show ? 'block' : 'none';
            }
        }

        function getFABId(layerName) {
            switch(layerName) {
                case 'Mässor':
                    return 'fab-massor';
                case 'Jaktkort':
                    return 'fab-jaktkort';
                case 'Jaktskyttebanor':
                    return 'fab-jaktskyttebanor';
                default:
                    return '';
            }
        }

        document.getElementById('fab-massor').addEventListener('click', function() {
            toggleLayer('Mässor', layerURLs['Mässor']);
        });

        document.getElementById('fab-jaktkort').addEventListener('click', function() {
            toggleLayer('Jaktkort', layerURLs['Jaktkort']);
        });

        document.getElementById('fab-jaktskyttebanor').addEventListener('click', function() {
            toggleLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);
        });

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers,
        };
    })(map);
}, 1000);

