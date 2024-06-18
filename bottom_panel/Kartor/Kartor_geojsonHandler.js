import { getAlgjaktskartanStyle } from './bottom_panel/Kartor/Algjaktskartan/Algjaktskartan_stilar.js';
import { getAllmanJaktFagelStyle } from './bottom_panel/Kartor/Allman_jakt_Fagel/Allman_jakt_Fagel_stilar.js';
import { getAllmanJaktDaggdjurStyle } from './bottom_panel/Kartor/Allman_jakt_daggdjur/Allman_jakt_daggdjur_stilar.js';

var Kartor_geojsonHandler = (function() {
    // Deklarera globala variabler för att spåra lagrets tillstånd och geojson-lager
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

    // Funktion för att hämta GeoJSON-data och skapa lagret
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    var styleFunction;
                    if (layerName === 'Allmän jakt: Däggdjur') {
                        styleFunction = getAllmanJaktDaggdjurStyle;
                    } else if (layerName === 'Allmän jakt: Fågel') {
                        styleFunction = getAllmanJaktFagelStyle;
                    } else if (layerName === 'Älgjaktskartan') {
                        styleFunction = getAlgjaktskartanStyle;
                    }

                    var layer = L.geoJSON(geojson, {
                        style: styleFunction,
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer); // Använd funktionen från popupHandler.js
                        }
                    }).addTo(map);

                    // Lägg till lagret i geojsonLayers arrayen
                    geojsonLayers[layerName].push(layer);
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });

        // Uppdatera layerIsActive för det aktuella lagret
        layerIsActive[layerName] = true;
    }

    // Funktion för att tända och släcka lagret
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            // Om lagret inte är aktivt, lägg till lagret på kartan
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            // Om lagret är aktivt, ta bort lagret från kartan
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });

            // Töm geojsonLayers arrayen för det aktuella lagret
            geojsonLayers[layerName] = [];

            // Uppdatera layerIsActive för det aktuella lagret
            layerIsActive[layerName] = false;
        }
    }

    // Returnera offentliga metoder och variabler
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
