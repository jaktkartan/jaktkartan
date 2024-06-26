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

    // GeoJSON URL:er för varje lager
    var layerURLs = {
        'Mässor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/Massor.geojson'],
        'Jaktkort': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktkort.geojson'],
        'Jaktskyttebanor': ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
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
                            return L.circleMarker(latlng, style);
                        },
                        onEachFeature: function(feature, layer) {
                            var popupContent = buildPopupContent(feature.properties);
                            layer.bindPopup(popupContent);
                        }
                    });

                    geojsonLayers[layerName].push(layer);

                    if (!layerIsActive[layerName]) {
                        // Om lagret inte är aktivt (första klicket), aktivera det och lägg till det på kartan
                        layer.addTo(map);
                        layerIsActive[layerName] = true;
                    } else {
                        // Om lagret redan är aktivt (andra klicket och framåt), ta bort det från kartan
                        map.removeLayer(layer);
                        layerIsActive[layerName] = false;
                    }
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });
    }

    // Funktion för att släcka alla lager utom det angivna lagret
    function deactivateAllLayersExcept(layerName) {
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                geojsonLayers[name].forEach(function(layer) {
                    map.removeLayer(layer); // Tar bort andra aktiva lager från kartan
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

    function buildPopupContent(properties) {
        var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

        var hideProperties = ['id', 'Aktualitet'];
        var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

        for (var prop in properties) {
            if (hideProperties.includes(prop)) {
                continue;
            }
            if (prop === 'BILD') {
                popupContent += '<p><img src="' + properties[prop] + '" style="max-width: 100%;" alt="Bild"></p>';
            } else if (prop === 'LINK' || prop === 'VAGBESKRIV') {
                popupContent += '<p><a href="' + properties[prop] + '" target="_blank">Länk</a></p>';
            } else if (hideNameOnlyProperties.includes(prop)) {
                popupContent += '<p>' + properties[prop] + '</p>';
            } else {
                popupContent += '<p><strong>' + prop + ':</strong> ' + properties[prop] + '</p>';
            }
        }
        popupContent += '</div>';

        return popupContent;
    }

    // Funktion som anropas när en knapp klickas på i HTML
    function handleButtonClick(layerName) {
        if (!layerIsActive[layerName]) {
            // Om lagret inte är aktivt, släck alla andra lager och aktivera det valda lagret
            deactivateAllLayersExcept(layerName);
            fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
        } else {
            // Om lagret redan är aktivt, togglar det mellan synligt och osynligt
            geojsonLayers[layerName].forEach(function(layer) {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                } else {
                    layer.addTo(map);
                }
            });
            layerIsActive[layerName] = !layerIsActive[layerName]; // Togglar layerIsActive för det specifika lagret
        }
    }

    // Initierar alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

    return {
        handleButtonClick: handleButtonClick
    };
})();
