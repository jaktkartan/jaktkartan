var layerURLs = {
    'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
    'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
    'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
};

var Upptack_geojsonHandler = (function() {
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
            'Massor.geojson': { color: 'orange', radius: 5, fillColor: 'orange', fillOpacity: 0.8 }
        },
        'Jaktkort': {
            'jaktkort.geojson': { color: 'blue', radius: 5, fillColor: 'blue', fillOpacity: 0.8 }
        },
        'Jaktskyttebanor': {
            'jaktskyttebanor.geojson': { color: 'green', radius: 5, fillColor: 'green', fillOpacity: 0.8 }
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
                            var filename = getFilenameFromURL(geojsonURL);
                            var style = getMarkerStyle(layerName, filename);

                            if (style.icon) {
                                return L.marker(latlng, { icon: style.icon });
                            } else {
                                return L.circleMarker(latlng, {
                                    radius: style.radius,
                                    color: style.color,
                                    fillColor: style.fillColor,
                                    fillOpacity: style.fillOpacity
                                });
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

                    // Lägg till en händelse för att uppdatera markörstilen vid zoom
                    map.on('zoomend', function() {
                        updateMarkerStyles(layerName, geojsonURL);
                    });
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });
    }

    // Funktion för att toggla lagret
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

    // Funktion för att aktivera ett lager
    function activateLayer(layerName) {
        geojsonLayers[layerName].forEach(function(layer) {
            layer.addTo(map);
        });
        layerIsActive[layerName] = true;
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
            }
        });
    }

    function getFilenameFromURL(url) {
        var pathArray = url.split('/');
        var filename = pathArray[pathArray.length - 1];
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
    function getMarkerStyle(layerName, filename) {
        var zoomLevel = map.getZoom();
        var style;

        if (zoomLevel >= 15) {
            style = {
                icon: L.icon({
                    iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/ikon3.png?raw=true',
                    iconSize: [40, 40], // Justera storleken på ikonen efter behov
                    iconAnchor: [20, 20] // Justera ikonankaret om det behövs
                })
            };
        } else {
            style = {
                radius: 5,
                color: layerStyles[layerName][filename].color,
                fillColor: layerStyles[layerName][filename].fillColor,
                fillOpacity: layerStyles[layerName][filename].fillOpacity
            };
        }

        return style;
    }

    // Funktion för att uppdatera markörstilar
    function updateMarkerStyles(layerName, geojsonURL) {
        geojsonLayers[layerName].forEach(function(layer) {
            layer.eachLayer(function(marker) {
                if (marker.feature) {
                    var filename = getFilenameFromURL(geojsonURL);
                    var style = getMarkerStyle(layerName, filename);

                    if (style.icon) {
                        marker.setIcon(style.icon);
                    } else {
                        marker.setStyle({
                            radius: style.radius,
                            color: style.color,
                            fillColor: style.fillColor,
                            fillOpacity: style.fillOpacity
                        });
                    }
                }
            });
        });
    }

    // Initialisera alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

    return {
        toggleLayer: toggleLayer
    };
})();
