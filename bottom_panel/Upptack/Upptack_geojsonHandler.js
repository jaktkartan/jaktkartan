var layerURLs = {
    'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
    'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
    'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
};

var defaultMarkerSize = 7; // Standard storlek på markörerna

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
            'Massor.geojson': { color: 'orange', fillColor: 'orange', fillOpacity: 0.7 }
        },
        'Jaktkort': {
            'jaktkort.geojson': { color: 'blue', fillColor: 'blue', fillOpacity: 0.7 }
        },
        'Jaktskyttebanor': {
            'jaktskyttebanor.geojson': { color: 'green', fillColor: 'green', fillOpacity: 0.7 }
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
                            return L.circleMarker(latlng, style);
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
    var scaleFactor = 0.9; // Justera faktorn baserat på erfarenhet och experiment

    // Justera radien baserat på zoomnivå och scaleFactor
    var radius = defaultMarkerSize * Math.pow(scaleFactor, zoomLevel - 4);

    // Anpassa andra stilar här om det behövs
    var style = {
        color: layerStyles[layerName][filename].color,
        radius: radius,
        fillColor: layerStyles[layerName][filename].fillColor,
        fillOpacity: layerStyles[layerName][filename].fillOpacity
    };

    return style;
}


    // Initialisera alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

    return {
        toggleLayer: toggleLayer
    };
})();
