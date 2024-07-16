var Kartor_geojsonHandler = (function() {
    // Status för vilka lager som är aktiva
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false
    };

    // Objekt som lagrar GeoJSON-lager och WMS-lager för varje lager
    var layers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': []
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
                    var colorScale = [
                        '#ffd54f', '#72d572', '#ff7043', '#1ba01b', '#20beea',
                        '#81d4fa', '#ab47bc', '#e9a6f4', '#78909c', '#9c8019', '#b5f2b5'
                    ];
                    var jakttidToColor = {};
                    var currentIndex = 0;
                    
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
        'Älgjaktsområden': {} // WMS-lagerhantering här
    };

    // Funktion för att hämta GeoJSON-data och skapa ett lager
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        Object.keys(layerIsActive).forEach(function(name) {
            if (name !== layerName && layerIsActive[name]) {
                toggleLayer(name, []);
            }
        });

        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    var geojson = response.data;
                    
                    var layer = L.geoJSON(geojson, {
                        style: function(feature) {
                            var filename = getFilenameFromURL(geojsonURL);
                            return layerStyles[layerName][filename].style ? layerStyles[layerName][filename].style(feature) : layerStyles[layerName][filename];
                        },
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer);
                        }
                    });

                    layers[layerName].push(layer);

                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }
                })
                .catch(function() {
                    console.error("Error fetching GeoJSON data.");
                });
        });

        layerIsActive[layerName] = true;
        updateFAB(layerName, true);
    }

    // Funktion för att ladda WMS-lager
    function loadWMSLayer(url, params) {
        console.log("Loading WMS layer with URL:", url);
        console.log("Params:", params);
        
        var wmsLayer = L.tileLayer.wms(url, params);
        layers['Älgjaktsområden'].push(wmsLayer);

        if (layerIsActive['Älgjaktsområden']) {
            wmsLayer.addTo(map);
        }
    }

    // Funktion för att växla (aktivera/inaktivera) lager
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            if (layerName === 'Älgjaktsområden') {
                loadWMSLayer('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
                    layers: '1',
                    format: 'image/png',
                    transparent: true,
                    opacity: 0.35,
                    version: '1.1.1',
                    crs: 'EPSG:3006' // Lägg till CRS här om det behövs
                });
            } else {
                fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
            }
        } else {
            layers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });

            layers[layerName] = [];
            layerIsActive[layerName] = false;
            updateFAB(layerName, false);
        }
    }

    function deactivateAllLayersKartor() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                layers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);
                });
                layers[layerName] = [];
                layerIsActive[layerName] = false;
                updateFAB(layerName, false);
            }
        });
    }

    function getFilenameFromURL(url) {
        return url.split('/').pop();
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
            case 'Allmän jakt: Däggdjur':
                return 'fab-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'fab-fagel';
            case 'Älgjaktskartan':
                return 'fab-alg';
            case 'Älgjaktsområden':
                return 'fab-algomraden';
            default:
                return '';
        }
    }

    return {
        toggleLayer: toggleLayer,
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();
