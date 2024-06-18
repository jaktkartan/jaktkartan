import { applyAlgjaktskartanStyle } from './bottom_panel/Kartor/Algjaktskartan/Algjaktskartan_stilar.js';
import { applyAllmanJaktFagelStyle } from './bottom_panel/Kartor/Allman_jakt_Fagel/Allman_jakt_Fagel_stilar.js';
import { applyAllmanJaktDaggdjurStyle } from './bottom_panel/Kartor/Allman_jakt_daggdjur/Allman_jakt_daggdjur_stilar.js';

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

                    var layer = L.geoJSON(geojson, {
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer); // Använd funktionen från popupHandler.js

                            // Tillämpa rätt stil baserat på lagrets namn
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
