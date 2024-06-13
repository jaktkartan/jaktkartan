// Skapa ett namnområde för Kartor_geojsonHandler
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
                    var layer = L.geoJSON(response.data, {
                        onEachFeature: function(feature, layer) {
                            // Skapa popup-innehållet dynamiskt baserat på alla attribut i geojson-egenskaperna
                            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
                            for (var prop in feature.properties) {
                                // Lägg till alla egenskaper i popup-innehållet
                                popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                            }
                            popupContent += '</div>';
                            // Använd bindPopupToLayer för att hantera popup
                            layer.bindPopup(popupContent);
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
