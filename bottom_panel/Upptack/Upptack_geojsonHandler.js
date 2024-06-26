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
            'Massor.geojson': { color: 'orange', radius: 8, fillColor: 'orange', fillOpacity: 0.8 }
        },
        'Jaktkort': {
            'jaktkort.geojson': { color: 'blue', radius: 8, fillColor: 'blue', fillOpacity: 0.8 }
        },
        'Jaktskyttebanor': {
            'jaktskyttebanor.geojson': { color: 'green', radius: 8, fillColor: 'green', fillOpacity: 0.8 }
        }
    };

    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Om lagret redan är aktivt, avbryt
        if (layerIsActive[layerName]) {
            return;
        }

        // Avaktivera alla andra lager förutom det aktuella lagret
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name, geojsonLayers[name].map(function(layer) {
                    return layer.options.url;
                }));
            }
        });

        // Hämta GeoJSON-data och skapa lagret med stil
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

                    // Lägg till lagret i geojsonLayers arrayen
                    geojsonLayers[layerName].push(layer);

                    // Om lagret är aktivt, lägg till det på kartan
                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });

        // Uppdatera layerIsActive för det aktuella lagret
        layerIsActive[layerName] = true;
    }

    function toggleLayer(layerName, geojsonURLs) {
        // Om lagret är aktivt, inaktivera det
        if (layerIsActive[layerName]) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });

            geojsonLayers[layerName] = [];

            layerIsActive[layerName] = false;
        } else {
            // Om lagret inte är aktivt, aktivera det
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        }
    }

    function getFilenameFromURL(url) {
        var pathArray = url.split('/');
        var filename = pathArray[pathArray.length - 1];
        return filename;
    }

    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
