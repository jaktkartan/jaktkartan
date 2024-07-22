var Kartor_geojsonHandler = (function() {
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false
    };

    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': null
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
        }
    };

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
            if (layerName === 'Älgjaktsområden') {
                loadElgjaktsomradenWMS(false);
            } else {
                deactivateLayer(layerName);
            }
        }
    }

    function loadElgjaktsomradenWMS(add) {
        if (add) {
            if (geojsonLayers['Älgjaktsområden']) {
                console.log('Layer is already added. No action taken.');
                return;
            }
            console.log('Adding Älgjaktsområden layer.');
            var wmsLayer = L.tileLayer.wms('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
                layers: '2',
                format: 'image/png',
                transparent: true,
                attribution: 'Länsstyrelsen'
            }).addTo(map);

            geojsonLayers['Älgjaktsområden'] = wmsLayer;

            map.on('click', handleWmsLayerClick);

            console.log("WMS layer added to map:", wmsLayer);
        } else {
            if (geojsonLayers['Älgjaktsområden']) {
                console.log('Removing Älgjaktsområden layer.');
                map.removeLayer(geojsonLayers['Älgjaktsområden']);
                geojsonLayers['Älgjaktsområden'] = null;
                map.off('click', handleWmsLayerClick);
            }
        }
    }

    function handleWmsLayerClick(e) {
        var latlng = e.latlng;
        var wmsLayer = geojsonLayers['Älgjaktsområden'];
        if (!wmsLayer) return;

        var url = getFeatureInfoUrl(
            latlng,
            wmsLayer,
            map,
            {
                'info_format': 'text/xml',
                'propertyName': 'Områdesnamn,Områdesnummer'
            }
        );

        console.log("GetFeatureInfo URL:", url);

        fetch(url)
            .then(response => response.text())
            .then(data => {
                console.log("FeatureInfo data:", data);
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, "application/xml");
                var fields = xmlDoc.getElementsByTagName("FIELDS")[0];
                if (fields) {
                    var properties = {};
                    for (var i = 0; i < fields.attributes.length; i++) {
                        var attr = fields.attributes[i];
                        properties[attr.name] = attr.value;
                    }
                    console.log('Egenskaper från WMS:', properties);
                    showPopupPanel(properties);
                } else {
                    console.log("No features found.");
                }
            })
            .catch(error => {
                console.error("Error fetching feature info:", error);
            });
    }

    function getFeatureInfoUrl(latlng, wmsLayer, map, params) {
        var point = map.latLngToContainerPoint(latlng, map.getZoom());
        var size = map.getSize();
        var bounds = map.getBounds();
        var crs = map.options.crs;

        var sw = crs.project(bounds.getSouthWest());
        var ne = crs.project(bounds.getNorthEast());

        var defaultParams = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: crs.code,
            styles: '',
            version: wmsLayer._wmsVersion,
            format: wmsLayer.options.format,
            bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
            height: size.y,
            width: size.x,
            layers: wmsLayer.wmsParams.layers,
            query_layers: wmsLayer.wmsParams.layers,
            info_format: 'application/json'
        };

        params = L.Util.extend(defaultParams, params);

        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

        return wmsLayer._url + L.Util.getParamString(params, wmsLayer._url, true);
    }

    function deactivateAllLayersKartor() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                layerIsActive[layerName] = false;
                deactivateLayer(layerName);
            }
        });
    }

    function deactivateLayer(layerName) {
        if (geojsonLayers[layerName]) {
            if (layerName === 'Älgjaktsområden') {
                loadElgjaktsomradenWMS(false);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);
                });
                geojsonLayers[layerName] = [];
            }
        }
    }

    function updateFAB(layerName, add) {
        var fabButton = document.getElementById('fab-' + layerName.toLowerCase().replace(/\s+/g, '-'));
        if (fabButton) {
            fabButton.style.display = add ? 'block' : 'none';
        }
    }

    function getFilenameFromURL(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    return {
        toggleLayer: toggleLayer,
        loadElgjaktsomradenWMS: loadElgjaktsomradenWMS
    };
})();

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
            default:
                return '';
        }
    }
