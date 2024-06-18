import { applyAlgjaktskartanStyle } from './Algjaktskartan/Algjaktskartan_stilar.js';
import { applyAllmanJaktFagelStyle } from './Allman_jakt_Fagel/Allman_jakt_Fagel_stilar.js';
import { applyAllmanJaktDaggdjurStyle } from './Allman_jakt_daggdjur/Allman_jakt_daggdjur_stilar.js';

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

    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        if (!Array.isArray(geojsonURLs) || geojsonURLs.length === 0) {
            console.error('GeoJSON URL:s är antingen inte en array eller tom.');
            return;
        }

        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    var layer = L.geoJSON(geojson, {
                        onEachFeature: function(feature, layer) {
                            // Lägg till eventuell logik för varje geojson-lager här
                            addClickHandlerToLayer(layer);

                            switch (layerName) {
                                case 'Älgjaktskartan':
                                    applyAlgjaktskartanStyle(feature, layer);
                                    break;
                                case 'Allmän jakt: Fågel':
                                    applyAllmanJaktFagelStyle(feature, layer);
                                    break;
                                case 'Allmän jakt: Däggdjur':
                                    applyAllmanJaktDaggdjurStyle(feature, layer);
                                    break;
                            }
                        }
                    });

                    if (map) {
                        layer.addTo(map);
                        geojsonLayers[layerName].push(layer);
                    } else {
                        console.error("Kartan (map) är inte definierad.");
                    }
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });

        layerIsActive[layerName] = true;
    }

    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });

            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
        }
    }

    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
