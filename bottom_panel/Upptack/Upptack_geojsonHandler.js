var Upptack_geojsonHandler;

// Vänta en sekund innan vi kör koden för att säkerställa att alla resurser är inlästa
setTimeout(function() {
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
    };

    // Funktion för att hämta GeoJSON-data och skapa lager
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

    // Funktion för att aktivera eller inaktivera lager
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

    function getMarkerStyle(layerName) {
        var style = layerStyles[layerName];
        return {
            icon: L.icon({
                iconUrl: style.iconUrl,
                iconSize: style.iconSize
            })
        };
    }

    function getFallbackStyle(layerName) {
        var style = layerStyles[layerName];
        return {
            icon: L.icon({
                iconUrl: style.fallbackStyle.fallbackIconUrl,
                iconSize: style.fallbackStyle.fallbackIconSize
            })
        };
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
        var popupPanel = document.getElementById('popup-panel');
        if (popupPanel) {
            popupPanel.classList.remove('hide');
            popupPanel.classList.add('show');
        }
    }

    function hidePopupPanel() {
        var popupPanel = document.getElementById('popup-panel');
        if (popupPanel) {
            popupPanel.classList.remove('show');
            popupPanel.classList.add('hide');
        }
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

    function updatePopupPanelContent(properties) {
        var content = generatePopupContent(properties);
        var panelContent = document.getElementById('popup-panel-content');
        if (panelContent) {
            panelContent.innerHTML = content;
        }
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
}, 1000);

