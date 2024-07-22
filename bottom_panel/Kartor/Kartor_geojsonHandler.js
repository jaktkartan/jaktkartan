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
        'Allmän jakt: Däggdjur': { /* Ditt lager stil */ },
        'Allmän jakt: Fågel': { /* Ditt lager stil */ },
        'Älgjaktskartan': { /* Ditt lager stil */ }
    };

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
                attribution: 'Länsstyrelsen',
                opacity: 0.5
            }).addTo(map);

            geojsonLayers['Älgjaktsområden'] = wmsLayer;

            map.on('click', function(e) {
                var latlng = e.latlng;
                var url = getFeatureInfoUrl(latlng, wmsLayer, map, {
                    'info_format': 'text/xml',
                    'propertyName': 'Områdesnamn,Områdesnummer'
                });

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
                            if (!popupPanelVisible) {
                                showPopupPanel(properties);
                            } else {
                                updatePopupPanelContent(properties);
                            }
                        } else {
                            console.log("No features found.");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching feature info:", error);
                    });
            });

            console.log("WMS layer added to map:", wmsLayer);
        } else {
            if (geojsonLayers['Älgjaktsområden']) {
                console.log('Removing Älgjaktsområden layer.');
                map.off('click');  // Remove the click listener
                map.removeLayer(geojsonLayers['Älgjaktsområden']);
                geojsonLayers['Älgjaktsområden'] = null;
            }
        }
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
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
        }
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
                return 'fab-alg-omraden';
            default:
                return '';
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
