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
            'Massor.geojson': { color: 'orange', baseRadius: 8, fillColor: 'orange', fillOpacity: 0.8 }
        },
        'Jaktkort': {
            'jaktkort.geojson': { color: 'blue', baseRadius: 8, fillColor: 'blue', fillOpacity: 0.8 }
        },
        'Jaktskyttebanor': {
            'jaktskyttebanor.geojson': { color: 'green', baseRadius: 8, fillColor: 'green', fillOpacity: 0.8 }
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
                            var style = layerStyles[layerName][filename];
                            var zoom = map.getZoom();
                            var radius = style.baseRadius * Math.pow(2, zoom - 5); // Anpassa denna formel efter behov
                            return L.circleMarker(latlng, { ...style, radius: radius });
                        },
                        onEachFeature: function(feature, layer) {
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
        Object.keys(layerIsActive).forEach(function(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                layer.addTo(map);
            });
            layerIsActive[layerName] = true;
        });
    }

    // Funktion för att avaktivera alla lager
    function deactivateAllLayers() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            layerIsActive[layerName] = false;
        });
    }

    function updateMarkerRadius() {
        var zoom = map.getZoom();
        Object.keys(geojsonLayers).forEach(function(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                layer.eachLayer(function(marker) {
                    if (marker instanceof L.CircleMarker) {
                        var filename = getFilenameFromURL(marker.feature.properties.geojsonURL);
                        var style = layerStyles[layerName][filename];
                        var radius = style.baseRadius * Math.pow(2, zoom - 5); // Anpassa denna formel efter behov
                        marker.setRadius(radius);
                    }
                });
            });
        });
    }

    map.on('zoomend', updateMarkerRadius);

    function getFilenameFromURL(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    // Returnerar publik API
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();

// Anropa för att hämta GeoJSON-data och skapa lagren vid start
Object.keys(layerURLs).forEach(function(layerName) {
    Upptack_geojsonHandler.fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
});

