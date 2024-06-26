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
        console.log("Fetching GeoJSON data for layer:", layerName);
        geojsonURLs.forEach(function(geojsonURL) {
            console.log("Fetching URL:", geojsonURL);
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Data fetched successfully for:", geojsonURL);
                    var geojson = response.data;
                    var layer = L.geoJSON(geojson, {
                        pointToLayer: function(feature, latlng) {
                            var filename = getFilenameFromURL(geojsonURL);
                            var style = getMarkerStyle(layerName, filename);

                            if (style.icon) {
                                console.log("Using icon for feature at:", latlng);
                                return L.marker(latlng, { icon: style.icon });
                            } else {
                                console.log("Using circle marker for feature at:", latlng);
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
                        console.log("Adding layer to map:", layerName);
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
        console.log("Toggling layer:", layerName);
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
        console.log("Activating layer:", layerName);
        geojsonLayers[layerName].forEach(function(layer) {
            layer.addTo(map);
        });
        layerIsActive[layerName] = true;
    }

    // Funktion för att aktivera alla lager
    function activateAllLayers() {
        console.log("Activating all layers");
        Object.keys(geojsonLayers).forEach(function(layerName) {
            activateLayer(layerName);
        });
    }

    // Funktion för att avaktivera alla lager
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
        console.log("Current zoom level:", zoomLevel);
        var style;

        if (zoomLevel >= 15) {
            console.log("Using icon for zoom level >= 15");
            style = {
                icon: L.icon({
                    iconUrl: 'https://github.com/timothylevin/Testmiljo/blob/main/bilder/ikon3.png?raw=true', // Uppdatera sökvägen här beroende på din filstruktur
                    iconSize: [40, 40], // Justera storleken på ikonen efter behov
                    iconAnchor: [20, 20] // Justera ikonankaret om det behövs
                })
            };
        } else {
            console.log("Using circle marker for zoom level <", 15);
            style = {
                radius: 5,
                color: layerStyles[layerName][filename].color,
                fillColor: layerStyles[layerName][filename].fillColor,
                fillOpacity: layerStyles[layerName][filename].fillOpacity
            };
        }

        return style;
    }

    // Funktion för att uppdatera markörer vid zoom
    function updateMarkersOnZoom() {
        console.log("Updating markers on zoom");
        Object.keys(geojsonLayers).forEach(function(layerName) {
            geojsonLayers[layerName].forEach(function(layer) {
                layer.eachLayer(function(marker) {
                    if (marker.setIcon) {
                        var zoomLevel = map.getZoom();
                        var filename = getFilenameFromURL(marker.feature.properties.url);
                        var style = getMarkerStyle(layerName, filename);
                        
                        if (style.icon && zoomLevel >= 15) {
                            console.log("Setting icon for marker at:", marker.getLatLng());
                            marker.setIcon(style.icon);
                        } else if (!style.icon && zoomLevel < 15) {
                            console.log("Setting circle marker for marker at:", marker.getLatLng());
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
        });
    }

    // Initialisera alla lager vid start
    fetchGeoJSONDataAndCreateLayer('Mässor', layerURLs['Mässor']);
    fetchGeoJSONDataAndCreateLayer('Jaktkort', layerURLs['Jaktkort']);
    fetchGeoJSONDataAndCreateLayer('Jaktskyttebanor', layerURLs['Jaktskyttebanor']);

    // Lägg till en lyssnare för zoomhändelser
    map.on('zoomend', function() {
        console.log("Zoom event detected");
        updateMarkersOnZoom();
    });

    return {
        toggleLayer: toggleLayer
    };
})();
