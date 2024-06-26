var layerURLs = {
    'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
    'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
    'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
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

var zoomToRadiusFactor = function(zoom) {
    return Math.pow(2, zoom - 5);
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

    // Funktion för att hämta GeoJSON-data och skapa lagret med stil
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    var geojson = response.data;
                    var style = layerStyles[layerName][getFilenameFromURL(geojsonURL)];
                    var layer = L.geoJSON(geojson, {
                        pointToLayer: function(feature, latlng) {
                            var radius = style.baseRadius * zoomToRadiusFactor(map.getZoom());
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
        deactivateAllLayers();
        activateLayer(layerName);
    }

    // Funktion för att aktivera ett lager
    function activateLayer(layerName) {
        geojsonLayers[layerName].forEach(function(layer) {
            layer.addTo(map);
        });
        layerIsActive[layerName] = true;
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
        return pathArray[pathArray.length - 1];
    }

    // Initialisera alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

    return {
        toggleLayer: toggleLayer
    };
})();

// Exempel på knappklick-hantering
document.getElementById('massorButton').addEventListener('click', function() {
    Upptack_geojsonHandler.toggleLayer('Mässor');
});

document.getElementById('jaktkortButton').addEventListener('click', function() {
    Upptack_geojsonHandler.toggleLayer('Jaktkort');
});

document.getElementById('jaktskyttebanorButton').addEventListener('click', function() {
    Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor');
});
