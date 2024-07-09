var Upptack_geojsonHandler;

setTimeout(function() {
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
    };

    var map = L.map('map').setView([59.3293, 18.0686], 10); // Initial map center and zoom
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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
                        var layer = L.geoJSON(geojson, {
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
                    })
                    .catch(function(error) {
                        console.log("Error fetching GeoJSON data:", error.message);
                    });
            });
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

        function generatePopupContent(properties) {
            var content = '';

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var value = properties[key];

                    if (hideProperties.includes(key) || (hideNameOnlyProperties.includes(key) && !value)) {
                        continue;
                    }

                    if (isImageUrl(value)) {
                        content += '<p><img src="' + value + '" alt="Bild"></p>';
                    } else {
                        var translatedKey = translateKey(key);
                        content += '<p><strong>' + translatedKey + ':</strong> ' + (value ? value : '') + '</p>';
                    }
                }
            }

            return content;
        }

        function showPopupPanel(properties) {
            var content = generatePopupContent(properties);
            var panelContent = document.getElementById('popup-panel-content');

            if (!panelContent) {
                console.error("Elementet 'popup-panel-content' hittades inte.");
                return;
            }

            panelContent.innerHTML = content;
            popupPanel.classList.remove('hide');
            popupPanel.classList.add('show');
            popupPanelVisible = true;

            // Scroll to the top of the panel
            requestAnimationFrame(function() {
                setTimeout(function() {
                    panelContent.scrollTop = 0;
                }, 0);
            });
        }

        function addClickHandlerToLayer(layer) {
            layer.on('click', function(e) {
                try {
                    if (e.originalEvent) {
                        e.originalEvent.stopPropagation();
                    }

                    if (e.target && e.target.feature && e.target.feature.properties) {
                        var properties = e.target.feature.properties;
                        console.log('Klickade på ett geojson-objekt med egenskaper:', properties);

                        if (!popupPanelVisible) {
                            showPopupPanel(properties);
                        } else {
                            updatePopupPanelContent(properties);
                        }
                    } else {
                        console.error('Ingen geojson-information hittades i klickhändelsen.');
                    }
                } catch (error) {
                    console.error('Fel vid hantering av klickhändelse:', error);
                }
            });
        }

        fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
        fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
        fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

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

        document.addEventListener('click', function(event) {
            if (popupPanelVisible && !popupPanel.contains(event.target)) {
                hidePopupPanel();
            }
        });

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers
        };
    })(map);
}, 1000);
