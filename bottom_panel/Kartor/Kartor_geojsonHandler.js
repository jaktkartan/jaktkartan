var Kartor_geojsonHandler = (function() {
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false
    };

    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': []
    };

    var layerStyles = {
        'Allmän jakt: Däggdjur': {
            'Rvjaktilvdalenskommun_1.geojson': { fillColor: 'orange', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'Allman_jakt_daggdjur_2.geojson': { fillColor: 'blue', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 }
        },
        'Allmän jakt: Fågel': {
            'Lnsindelning_1.geojson': { fillColor: 'yellow', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 },
            'Grnsfrripjaktilvdalenskommun_2.geojson': { fillColor: 'rgb(50, 94, 88)', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'GrnslvsomrdetillFinland_5.geojson': { fillColor: 'blue', color: 'blue', weight: 8, fillOpacity: 0.5, dashArray: '5, 10' },
            'NedanfrLappmarksgrnsen_3.geojson': { fillColor: '#fdae61', color: '#edf8e9', weight: 2, fillOpacity: 0.5, dashArray: '5, 10' },
            'OvanfrLapplandsgrnsen_4.geojson': { fillColor: '#a6d96a', color: '#edf8e9', weight: 2, fillOpacity: 0.5 }
        },
        'Älgjaktskartan': {
            'lgjaktJakttider_1.geojson': {
                style: (function() {
                    var colorScale = [
                        '#ffd54f',  // B
                        '#72d572',  // D
                        '#ff7043',  // A
                        '#1ba01b',  // C
                        '#20beea',  // F
                        '#81d4fa',  // G
                        '#ab47bc',  // H
                        '#e9a6f4',  // I
                        '#78909c',  // J
                        '#9c8019',  // K
                        '#b5f2b5'   // E
                    ];

                    var jakttidToColor = {};  
                    var currentIndex = 0;  

                    return function(feature) {
                        var jakttid = feature.properties['jakttid'];

                        if (!jakttidToColor[jakttid]) {
                            jakttidToColor[jakttid] = colorScale[currentIndex];
                            currentIndex = (currentIndex + 1) % colorScale.length;
                        }

                        var fillColor = jakttidToColor[jakttid];

                        return { fillColor: fillColor, color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.6 };
                    };
                })()
            },
            'Srskiltjakttidsfnster_3.geojson': { fillColor: 'purple', color: 'purple', weight: 2 },
            'Omrdemedbrunstuppehll_2.geojson': { fill: false, color: 'black', weight: 7, dashArray: '5, 10' },
            'Kirunakommunnedanodlingsgrns_4.geojson': { fillColor: 'pink', color: 'pink', weight: 2 }
        }
    };

// Funktion för att generera popup-innehåll
function generatePopupContent(feature) {
    // Logga egenskaperna för felsökning
    console.log('Feature properties:', feature.properties);

    var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
    var hideProperties = ['id', 'shape_area', 'shape_leng', 'objectid_2', 'objectid', 'shape_le_2', 'field'];
    var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

    // Iterera genom egenskaperna i feature
    for (var prop in feature.properties) {
        if (feature.properties.hasOwnProperty(prop)) {
            var value = feature.properties[prop];

            // Kontrollera om egenskapen ska döljas baserat på hideProperties
            if (hideProperties.includes(prop)) continue;

            // Kontrollera om egenskapen ska döljas baserat på hideNameOnlyProperties
            if (hideNameOnlyProperties.includes(prop)) {
                // Om värdet är null eller tomt, hoppa över
                if (!value || value.trim() === '') continue;
            }

            // Om egenskapen är en bild-URL
            if (prop === 'BILD' && value) {
                popupContent += '<p><img src="' + value + '" style="max-width: 100%; border-radius: 8px;" alt="Bild"></p>';
            } else if (prop === 'LINK' || prop === 'VAGBESKRIV') {
                // Om egenskapen är en länk eller beskrivning
                popupContent += '<p><a href="' + value + '" target="_blank">Länk</a></p>';
            } else {
                // Om det är en annan egenskap
                popupContent += '<p><strong>' + prop + ':</strong> ' + (value ? value : 'Ingen information tillgänglig') + '</p>';
            }
        }
    }

    popupContent += '</div>';
    return popupContent;
}



    // Funktion för att hämta GeoJSON-data och skapa ett lager.
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Inaktivera andra lager om de är aktiva.
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name, geojsonLayers[name].map(function(layer) {
                    return layer.options.url;
                }));
            }
        });

        // Hämta GeoJSON-data från URL och skapa lager.
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    // Skapa GeoJSON-lager med stil och klickhändelse.
                    var layer = L.geoJSON(geojson, {
                        style: function(feature) {
                            var filename = getFilenameFromURL(geojsonURL);
                            return layerStyles[layerName][filename].style ? layerStyles[layerName][filename].style(feature) : layerStyles[layerName][filename];
                        },
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer); // Lägg till klickhanterare till lagret
                        }
                    });

                    geojsonLayers[layerName].push(layer);

                    // Lägg till lagret på kartan om det är aktivt.
                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });

        // Markera lagret som aktivt.
        layerIsActive[layerName] = true;
    }

    // Funktion för att växla (aktivera/inaktivera) lager.
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);  // Ta bort lager från kartan.
            });

            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
        }
    }

    // Funktion för att få filnamnet från en URL.
    function getFilenameFromURL(url) {
        var pathArray = url.split('/');
        var filename = pathArray[pathArray.length - 1];
        return filename;
    }

    // Exponerar funktionerna för att växla lager och hämta GeoJSON-data.
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();

