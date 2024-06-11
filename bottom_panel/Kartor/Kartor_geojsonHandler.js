// Skapa ett namnområde för Kartor_geojsonHandler
var Kartor_geojsonHandler = (function() {
    // Deklarera globala variabler för att spåra lagrets tillstånd och geojson-lager
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false
    };

    var geojsonLayers = {
        'Allmän jakt: Däggdjur': null,
        'Allmän jakt: Fågel': null,
        'Älgjaktskartan': null
    };

    // Funktion för att hämta GeoJSON-data och skapa lagret
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURL) {
        axios.get(geojsonURL)
            .then(function (response) {
                console.log("Successfully fetched GeoJSON data:", response.data);
                geojsonLayers[layerName] = L.geoJSON(response.data, {
                    onEachFeature: function (feature, layer) {
                        // Skapa popup-innehållet dynamiskt baserat på alla attribut i geojson-egenskaperna
                        var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

                        for (var prop in feature.properties) {
                            // Lägg till alla egenskaper i popup-innehållet
                            popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                        }
                        popupContent += '</div>';
                        layer.bindPopup(popupContent);
                    }
                }).addTo(map);
                // Uppdatera layerIsActive för det aktuella lagret
                layerIsActive[layerName] = true;
            })
            .catch(function (error) {
                console.log("Error fetching GeoJSON data:", error.message);
            });

    }

    // Funktion för att tända och släcka lagret
    function toggleLayer(layerName, geojsonURLs) {
        // Kontrollera om geojsonURLs är en array
        if (Array.isArray(geojsonURLs)) {
            // Om geojsonURLs är en array, loopa igenom varje URL och hämta data för varje lager
            geojsonURLs.forEach(function(url) {
                fetchGeoJSONDataAndCreateLayer(layerName, url);
            });
        } else {
            // Om geojsonURLs inte är en array, antas det vara en enskild URL
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        }
    }

    // Returnera offentliga metoder och variabler
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
