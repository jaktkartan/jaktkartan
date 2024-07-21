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
        'Älgjaktsområden': null // Nytt lager
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
        for (const geojsonURL of geojsonURLs) {
            try {
                const response = await axios.get(geojsonURL);
                const geojson = response.data;
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
                if (layerIsActive[layerName]) {
                    layer.addTo(map);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data.");
            }
        }
        updateFAB(layerName, true);
    }

    function toggleLayer(layerName, geojsonURLs) {
        deactivateAllLayersKartor();

        if (!layerIsActive[layerName]) {
            layerIsActive[layerName] = true;
            if (geojsonURLs) {
                fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
            } else if (layerName === 'Älgjaktsområden') {
                loadElgjaktsomradenWMS(true);
            }
        } else {
            layerIsActive[layerName] = false;
            deactivateLayer(layerName);
        }
    }

    function loadElgjaktsomradenWMS(add) {
        if (add) {
            if (!geojsonLayers['Älgjaktsområden']) {
                var wmsLayer = L.tileLayer.wms('https://geodata.naturvardsverket.se/arcgis/services/Inspire_SE_Harvest_object_Harvest_object_HR/MapServer/WmsServer', {
                    layers: '0',
                    format: 'image/png',
                    transparent: true,
                    attribution: 'Naturvårdsverket'
                });
                wmsLayer.addTo(map);
                geojsonLayers['Älgjaktsområden'] = wmsLayer;
            }
        } else {
            if (geojsonLayers['Älgjaktsområden']) {
                map.removeLayer(geojsonLayers['Älgjaktsområden']);
                geojsonLayers['Älgjaktsområden'] = null;
            }
        }
    }

    function deactivateAllLayersKartor() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                deactivateLayer(layerName);
            }
        });
    }

    function deactivateLayer(layerName) {
        if (geojsonLayers[layerName] && geojsonLayers[layerName].length > 0) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
        }
        if (layerName === 'Älgjaktsområden' && geojsonLayers['Älgjaktsområden']) {
            map.removeLayer(geojsonLayers['Älgjaktsområden']);
            geojsonLayers['Älgjaktsområden'] = null;
        }
        layerIsActive[layerName] = false;
        updateFAB(layerName, false);
    }

    function updateFAB(layerName, show) {
        var fabId = getFABId(layerName);
        var fabButton = document.getElementById(fabId);
        if (fabButton) {
            fabButton.style.display = show ? 'block' : 'none';
        }
    }

    function getFABId(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur': return 'fab-daggdjur';
            case 'Allmän jakt: Fågel': return 'fab-fagel';
            case 'Älgjaktskartan': return 'fab-alg';
            case 'Älgjaktsområden': return 'fab-alg-omraden';
            default: return '';
        }
    }

    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer,
        deactivateAllLayersKartor: deactivateAllLayersKartor,
        loadElgjaktsomradenWMS: loadElgjaktsomradenWMS
    };
})();
