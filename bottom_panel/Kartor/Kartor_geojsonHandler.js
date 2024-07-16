var Kartor_geojsonHandler = (function() {
    // Status för vilka lager som är aktiva
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false // Nytt lager för WMS-tjänst
    };

    // Objekt som lagrar GeoJSON-lager för varje lager
    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': [] // Nytt lager för WMS-tjänst
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
        },
        'Älgjaktsområden': {} // Ingen specifik stil för WMS-lagret
    };

    // Funktion för att hämta GeoJSON-data och skapa ett lager
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Inaktivera andra lager om de är aktiva
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name);
            }
        });

        // Hämta GeoJSON-data från URL och skapa lager
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    var geojson = response.data;
                    
                    // Skapa GeoJSON-lager med stil och klickhändelse
                    var layer = L.geoJSON(geojson, {
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
                })
                .catch(function() {
                    console.error("Error fetching GeoJSON data.");
                });
        });

        // Markera lagret som aktivt
        layerIsActive[layerName] = true;
        updateFAB(layerName, true);
    }

    // Funktion för att lägga till WMS-lager
    function addWMSLayer(layerName) {
        // Inaktivera andra lager om de är aktiva
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name);
            }
        });

        // URL och lagerinställningar för WMS-tjänsten
        var wmsURL = 'URL_TILL_WMS_TJANSTEN'; // Ersätt med den faktiska URL:en till WMS-tjänsten
        var wmsLayer = L.tileLayer.wms(wmsURL, {
            layers: 'LAYER_NAME', // Ange rätt lager från WMS-tjänsten
            format: 'image/png',
            transparent: true,
            attribution: 'Attribution text' // Ersätt med lämplig attribution
        });

        // Lägg till WMS-lagret till kartan och lagra det
        wmsLayer.addTo(map);
        geojsonLayers[layerName].push(wmsLayer);

        // Markera lagret som aktivt
        layerIsActive[layerName] = true;
        updateFAB(layerName, true);
    }

    // Funktion för att växla (aktivera/inaktivera) lager
    function toggleLayer(layerName, geojsonURLs) {
        if (layerName === 'Älgjaktsområden') {
            if (!layerIsActive[layerName]) {
                addWMSLayer(layerName);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);  // Ta bort lager från kartan
                });

                geojsonLayers[layerName] = [];
                layerIsActive[layerName] = false;
                updateFAB(layerName, false);
            }
        } else {
            if (!layerIsActive[layerName]) {
                fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);  // Ta bort lager från kartan
                });

                geojsonLayers[layerName] = [];
                layerIsActive[layerName] = false;
                updateFAB(layerName, false);
            }
        }
    }

    // Ny funktion för att inaktivera alla lager
    function deactivateAllLayersKartor() {
        console.log("Deactivating all layers.");
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                console.log("Deactivating layer:", layerName);
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer); // Ta bort lager från kartan
                });
                geojsonLayers[layerName] = []; // Rensa listan med lager
                layerIsActive[layerName] = false; // Markera som inaktiv
                updateFAB(layerName, false);
            }
        });
    }

    // Funktion för att få filnamnet från en URL
    function getFilenameFromURL(url) {
        return url.split('/').pop();
    }

    // Funktion för att uppdatera FAB-knappen baserat på lagrets tillstånd
    function updateFAB(layerName, show) {
        var fabId = getFABId(layerName);
        var fabButton = document.getElementById(fabId);
        if (fabButton) {
            fabButton.style.display = show ? 'block' : 'none';
        }
    }

    // Hjälpfunktion för att få FAB-knappens ID baserat på lagrets namn
    function getFABId(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur':
                return 'fab-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'fab-fagel';
            case 'Älgjaktskartan':
                return 'fab-alg';
            case 'Älgjaktsområden':
                return 'fab-algjaktsomraden'; // Nytt FAB-ID för WMS-lagret
            default:
                return '';
        }
    }

    // Exponerar funktionerna för att växla lager och hämta GeoJSON-data
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer,
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();
