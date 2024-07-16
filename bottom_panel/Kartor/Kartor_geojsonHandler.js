// Kontrollera att proj4leaflet är inkluderat och definiera CRS
(function() {
    if (typeof L.Proj === 'undefined') {
        console.error("proj4leaflet is not loaded.");
    } else {
        // Definiera CRS EPSG:3006
        window.EPSG3006 = new L.Proj.CRS('EPSG:3006',
            '+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs',
            {
                resolutions: [10, 5, 2.5, 1.25],
                origin: [0, 0]
            }
        );
    }
})();

var layerIsActive = {
    'Allmän jakt: Däggdjur': false,
    'Allmän jakt: Fågel': false,
    'Älgjaktskartan': false,
    'Älgjaktsområden': false
};

var layers = {
    'Allmän jakt: Däggdjur': [],
    'Allmän jakt: Fågel': [],
    'Älgjaktskartan': [],
    'Älgjaktsområden': []
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
        'OvanfrLappmarksgrnsen_4.geojson': { fillColor: '#ff7f00', color: '#e5f5f9', weight: 2, fillOpacity: 0.5, dashArray: '5, 10' }
    },
    'Älgjaktskartan': {},
    'Älgjaktsområden': {}
};

function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
    geojsonURLs.forEach(function(url) {
        axios.get(url)
            .then(function(response) {
                var layer = L.geoJSON(response.data, {
                    style: layerStyles[layerName][getFilenameFromURL(url)]
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

function loadWMSLayer(url, params) {
    console.log("Loading WMS layer with URL:", url);
    console.log("Params:", params);
    
    var wmsLayer = L.tileLayer.wms(url, params);
    layers['Älgjaktsområden'].push(wmsLayer);

    if (layerIsActive['Älgjaktsområden']) {
        wmsLayer.addTo(map);
    }
}

function toggleLayer(layerName, geojsonURLs) {
    if (!layerIsActive[layerName]) {
        if (layerName === 'Älgjaktsområden') {
            loadWMSLayer('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
                layers: '2', // Korrekt lagerparameter för Älgjaktsområden
                format: 'image/png',
                transparent: true,
                opacity: 0.35,
                version: '1.1.1',
                crs: 'EPSG:3006' // CRS för WMS-lagret
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

// Exponera funktioner som används utanför modulen
window.Kartor_geojsonHandler = {
    toggleLayer: toggleLayer,
    deactivateAllLayersKartor: deactivateAllLayersKartor
};
