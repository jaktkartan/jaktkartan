var Upptack_geojsonHandler = (function() {
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
            'Massor.geojson': { color: 'orange', radius: 8, fillColor: 'orange', fillOpacity: 0.8 }
        },
        'Jaktkort': {
            'jaktkort.geojson': { color: 'blue', radius: 8, fillColor: 'blue', fillOpacity: 0.8 }
        },
        'Jaktskyttebanor': {
            'jaktskyttebanor.geojson': { color: 'green', radius: 8, fillColor: 'green', fillOpacity: 0.8 }
        }
    };

    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Funktion för att hämta GeoJSON-data och skapa lagret med stil
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    var layer = L.geoJSON(geojson, {
                        pointToLayer: function(feature, latlng) {
                            var filename = getFilenameFromURL(geojsonURL);
                            var style = layerStyles[layerName][filename];
                            return L.circleMarker(latlng, style);
                        },
                        onEachFeature: function(feature, layer) {
                            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

                            var hideProperties = ['id', 'Aktualitet'];
                            var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

                            for (var prop in feature.properties) {
                                if (hideProperties.includes(prop)) {
                                    continue;
                                }
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

        layerIsActive[layerName] = true;
    }

    // Funktion för att tända och släcka lagret
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            // Släck alla lager förutom det valda
            deactivateAllLayersExcept(layerName);

            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        console.log("Successfully fetched GeoJSON data:", response.data);
                        var geojson = response.data;

                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                var filename = getFilenameFromURL(geojsonURL);
                                var style = layerStyles[layerName][filename];
                                return L.circleMarker(latlng, style);
                            },
                            onEachFeature: function(feature, layer) {
                                var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

                                var hideProperties = ['id', 'Aktualitet'];
                                var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

                                for (var prop in feature.properties) {
                                    if (hideProperties.includes(prop)) {
                                        continue;
                                    }
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
                        layer.addTo(map);
                        layerIsActive[layerName] = true;
                    })
                    .catch(function(error) {
                        console.log("Error fetching GeoJSON data:", error.message);
                    });
            });
        } else {
            // Om lagret redan är aktivt, "toggla" lagret (tänd och släck)
            geojsonLayers[layerName].forEach(function(layer) {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                } else {
                    map.addLayer(layer);
                }
            });
            layerIsActive[layerName] = !layerIsActive[layerName];
        }
    }

    // Funktion för att släcka alla lager utom det angivna lagret
    function deactivateAllLayersExcept(layerName) {
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
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

    // Initialisera alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']);

    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
