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
                            addClickHandlerToLayer(layer, layerName);
                        }
                    });

                    geojsonLayers[layerName].push(layer);

                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }

                    console.log(`Layer ${layerName} fetched and created.`);
                    updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager skapas
                } catch (error) {
                    console.log("Error fetching GeoJSON data for " + layerName + ":", error.message);
                }
            }
        }

        function toggleLayer(layerName) {
            console.log(`Toggling layer: ${layerName}`);
            if (layerName === 'Visa_allt') {
                activateAllLayers();
            } else if (layerName === 'Rensa_allt') {
                deactivateAllLayers();
            } else {
                filterLayer(layerName);
            }
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager togglas
        }

        function activateLayer(layerName) {
            console.log(`Activating layer: ${layerName}`);
            if (!geojsonLayers[layerName].length) {
                fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    layer.addTo(map);
                });
            }
            layerIsActive[layerName] = true;
            console.log(`Layer ${layerName} activated.`);
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager aktiveras
        }

        function deactivateLayer(layerName) {
            console.log(`Deactivating layer: ${layerName}`);
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            layerIsActive[layerName] = false;
            console.log(`Layer ${layerName} deactivated.`);
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager avaktiveras
        }

        function activateAllLayers() {
            console.log("Activating all layers");
            Object.keys(layerURLs).forEach(function(layerName) {
                activateLayer(layerName);
            });
            updateFabUpptackVisibility();
        }

        function deactivateAllLayers() {
            console.log("Deactivating all layers");
            Object.keys(layerIsActive).forEach(function(name) {
                if (layerIsActive[name]) {
                    geojsonLayers[name].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    layerIsActive[name] = false;
                }
            });
            updateFabUpptackVisibility();
        }

        function filterLayer(layerName) {
            console.log(`Filtering to layer: ${layerName}`);
            deactivateAllLayers();
            activateLayer(layerName);
        }

        function generatePanelContent(properties, layerName) {
            var content = '<div style="max-width: 300px; overflow-y: auto;">';

            // Definiera vilka fält som ska visas för olika lager
            var fields = {
                'Mässor': ['NAMN', 'INFO', 'LINK', 'VAGBESKRIV'],
                'Jaktkort': ['Rubrik', 'Info', 'Link', 'VAGBESKRIV']
            };

            // Fält som ska visas utan fältnamn
            var hideFieldNames = ['Rubrik', 'Kommun', 'Info', 'TYP', 'BILD', 'NAMN', 'INFO', 'id'];

            // Iterera genom alla egenskaper i GeoJSON-funktionen
            for (var prop in properties) {
                if (!properties.hasOwnProperty(prop) || hideFieldNames.includes(prop)) {
                    continue; // Hoppa över om fältet finns i hideFieldNames
                }

                var value = properties[prop];

                // Kontrollera om egenskapen är en bild-URL
                if (prop === 'BILD' && value && isImageUrl(value)) {
                    content += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                }
                // Kontrollera om egenskapen är en länk
                else if ((prop === 'LINK' || prop === 'Link') && value) {
                    // Lägg till en hyperlänk med texten "Länk" som länkar till URL:en
                    content += '<p><a href="' + value + '" target="_blank">Länk</a></p>';
                }
                // Kontrollera om egenskapen är en vägbeskrivning
                else if ((prop === 'VAGBESKRIV' || prop === 'VägBeskrivning') && value) {
                    // Lägg till en hyperlänk med texten "Vägbeskrivning" som länkar till URL:en
                    content += '<p><a href="' + value + '" target="_blank">Vägbeskrivning</a></p>';
                }
                // Kontrollera om egenskapen ska visas utan fältnamn
                else if (hideFieldNames.includes(prop) && value) {
                    content += '<p>' + value + '</p>';
                }
                // Annars, visa egenskapen som text
                else if (value) {
                    // Visa egenskapens namn och värde
                    content += '<p><strong>' + prop + ':</strong> ' + value + '</p>';
                }
            }

            content += '</div>';
            return content;
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

        function updateFabUpptackVisibility() {
            var anyLayerActive = Object.values(layerIsActive).some(isActive => isActive === true);
            var fabUpptackButton = document.getElementById('fab-upptack');
            if (anyLayerActive) {
                fabUpptackButton.style.display = 'flex';
                fabUpptackButton.classList.add('show'); // Lägg till 'show' klass för säkerhets skull
                console.log("FAB button set to display: flex");
            } else {
                fabUpptackButton.style.display = 'none';
                fabUpptackButton.classList.remove('show'); // Ta bort 'show' klass för säkerhets skull
                console.log("FAB button set to display: none");
            }
            console.log(`FAB button visibility updated: ${anyLayerActive ? 'visible' : 'hidden'}`);
        }

        // Initialisera alla lager från början och uppdatera FAB-knappen
        activateAllLayers();

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

        document.getElementById('fab-upptack').addEventListener('click', function() {
            var modal = document.getElementById('modal-upptack');
            modal.classList.toggle('show');
        });

        function addClickHandlerToLayer(layer, layerName) {
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

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers,
            activateAllLayers: activateAllLayers,
            activateLayer: activateLayer
        };
    })(map);
}, 1000);
