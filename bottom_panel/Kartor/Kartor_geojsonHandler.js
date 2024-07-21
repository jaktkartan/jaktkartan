var Kartor_geojsonHandler = (function() {
    // Status för vilka lager som är aktiva
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false // Nytt lager
    };

    // Objekt som lagrar GeoJSON-lager för varje lager
    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': [] // Nytt lager, ändrat till array
    };

    // Stilar för olika lager och GeoJSON-filer
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
                    // Färgschema för jakttider
                    var colorScale = [
                        '#ffd54f', '#72d572', '#ff7043', '#1ba01b', '#20beea',
                        '#81d4fa', '#ab47bc', '#e9a6f4', '#78909c', '#9c8019', '#b5f2b5'
                    ];
                    var jakttidToColor = {};
                    var currentIndex = 0;
                    
                    // Returnerar en funktion som tilldelar färg baserat på jakttid
                    return function(feature) {
                        var jakttid = feature.properties['jakttid'];
                        if (!jakttidToColor[jakttid]) {
                            jakttidToColor[jakttid] = colorScale[currentIndex];
                            currentIndex = (currentIndex + 1) % colorScale.length;
                        }
                        return { fillColor: jakttidToColor[jakttid], color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.5 };
                    };
                })()
            },
            'Omrdemedbrunstuppehll_2.geojson': { fill: false, color: 'black', weight: 7, dashArray: '5, 10' }
        }
    };

    // Funktion för att hämta GeoJSON-data och skapa ett lager
    async function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Inaktivera andra lager om de är aktiva
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name, geojsonLayers[name].map(function(layer) {
                    return layer.options.url;
                }));
            }
        });

        // Markera lagret som aktivt
        layerIsActive[layerName] = true;

        // Hämta GeoJSON-data från URL och skapa lager i ordning
        for (const geojsonURL of geojsonURLs) {
            try {
                const response = await axios.get(geojsonURL);
                const geojson = response.data;
                
                // Skapa GeoJSON-lager med stil och klickhändelse
                const layer = L.geoJSON(geojson, {
                    style: function(feature) {
                        var filename = getFilenameFromURL(geojsonURL);
                        return layerStyles[layerName][filename].style ? layerStyles[layerName][filename].style(feature) : layerStyles[layerName][filename];
                    },
                    onEachFeature: function(feature, layer) {
                        addClickHandlerToLayer(layer);
                    }
                });

                geojsonLayers[layerName].push(layer);

                // Lägg till lagret på kartan om det är aktivt
                if (layerIsActive[layerName]) {
                    layer.addTo(map);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data.");
            }
        }

        updateFAB(layerName, true);
    }

    // Funktion för att växla (aktivera/inaktivera) lager
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            if (layerName === 'Älgjaktsområden') {
                if (geojsonLayers['Älgjaktsområden']) {
                    geojsonLayers['Älgjaktsområden'].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    geojsonLayers['Älgjaktsområden'] = [];
                }
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);
                });
                geojsonLayers[layerName] = [];
            }
            layerIsActive[layerName] = false;
            updateFAB(layerName, false);
        }
    }

    // Funktion för att avaktivera alla lager
    function deactivateAllLayersKartor() {
        console.log("Deactivating all layers.");
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                console.log("Deactivating layer:", layerName);
                if (layerName === 'Älgjaktsområden') {
                    if (geojsonLayers['Älgjaktsområden']) {
                        geojsonLayers['Älgjaktsområden'].forEach(function(layer) {
                            map.removeLayer(layer);
                        });
                        geojsonLayers['Älgjaktsområden'] = [];
                    }
                } else {
                    geojsonLayers[layerName].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    geojsonLayers[layerName] = [];
                }
                layerIsActive[layerName] = false;
                updateFAB(layerName, false);
            }
        });
    }

    return {
        activateLayer: function(layerName, geojsonURLs) {
            toggleLayer(layerName, geojsonURLs);
        },
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();

function getFilenameFromURL(url) {
    return url.split('/').pop().split('?')[0];
}

function addClickHandlerToLayer(layer) {
    // Exempel på hur du kan lägga till en klickhändelse på lagret
    layer.on('click', function(e) {
        console.log('Clicked feature:', e.target.feature);
    });
}

function updateFAB(layerName, isActive) {
    // Exempel på hur du uppdaterar knappar eller annan UI baserat på lagerstatus
    var button = document.querySelector('#' + layerName);
    if (button) {
        button.classList.toggle('active', isActive);
    }
}
