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
function fetchGeoJSONDataAndCreateLayer(layerName) {
    var geojsonURL;
    // Bestäm vilken geojson-fil som ska hämtas baserat på layerName
    if (layerName === 'Allmän jakt: Däggdjur') {
        geojsonURL = 'LÄNK';
    } else if (layerName === 'Allmän jakt: Fågel') {
        geojsonURL = 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson';
    } else if (layerName === 'Älgjaktskartan') {
        geojsonURL = 'URL till jaktskyttebanor.geojson'; // Uppdatera URL för jaktskyttebanor
    }

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
function toggleLayer(layerName) {
    if (!layerIsActive[layerName]) {
        // Om lagret inte är aktivt, lägg till lagret på kartan
        fetchGeoJSONDataAndCreateLayer(layerName);
    } else {
        // Om lagret är aktivt, ta bort lagret från kartan
        map.removeLayer(geojsonLayers[layerName]);
        // Uppdatera layerIsActive för det aktuella lagret
        layerIsActive[layerName] = false;
    }
}
