var Kartor_geojsonHandler = (function() {
    // Status för vilka lager som är aktiva
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false  // Lägg till WMS-lagret
    };

    // Objekt som lagrar GeoJSON-lager för varje lager
    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': []  // Lägg till WMS-lagret
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
            'Srskiltjakttidsfnster_3.geojson': { fillColor: 'purple', color: 'purple', weight: 2 },
            'Omrdemedbrunstuppehll_2.geojson': { fill: false, color: 'black', weight: 7, dashArray: '5, 10' },
            'Kirunakommunnedanodlingsgrns_4.geojson': { fillColor: 'pink', color: 'pink', weight: 2 }
        }
    };

    // Funktion för att hämta GeoJSON-data och skapa ett lager
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Inaktivera andra lager om de är aktiva
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name, geojsonLayers[name].map(function(layer) {
                    return layer.options.url;
                }));
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

    // Funktion för att ladda och hantera WMS-lager
    function loadWMSLayer(layerName) {
        // Definiera EPSG:4326 (WGS84) CRS
        var EPSG4326 = new L.Proj.CRS('EPSG:4326',
            '+proj=longlat +datum=WGS84 +no_defs',
            {
                resolutions: [
                    8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25
                ],
                origin: [0, 0]
            }
        );

        // Definiera URL för WMS-lagret
        var wmsUrl = 'https://geodata.nationell.geodataportalen.se/land/ows?service=WMS';

        // Skapa WMS-lager
        var wmsLayer = L.tileLayer.wms(wmsUrl, {
            layers: 'algar:algjaktsomraden',
            format: 'image/png',
            transparent: true,
            crs: EPSG4326,  // Använd rätt CRS
            srs: 'EPSG:3006'  // Specificera SRS för att servern ska veta att den ska leverera i EPSG:3006
        });

        // Lägg till lagret om det inte redan är aktivt
        if (!layerIsActive[layerName]) {
            map.addLayer(wmsLayer);
            geojsonLayers[layerName].push(wmsLayer);
            layerIsActive[layerName] = true;
            updateFAB(layerName, true);
        } else {
            map.removeLayer(wmsLayer);
            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
            updateFAB(layerName, false);
        }
    }

    // Funktion för att växla (aktivera/inaktivera) lager
    function toggleLayer(layerName, geojsonURLs) {
        if (layerName === 'Älgjaktsområden') {
            loadWMSLayer(layerName);
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

    // Funktion för att inaktivera alla lager
    function deactivateAllLayersKartor() {
        console.log("Deactivating all layers.");
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                console.log("Deactivating layer:", layerName);
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);
                });

                geojsonLayers[layerName] = [];
                layerIsActive[layerName] = false;
                updateFAB(layerName, false);
            }
        });
    }

    // Lägg till fler funktioner här om det behövs

    return {
        toggleLayer: toggleLayer,
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();

