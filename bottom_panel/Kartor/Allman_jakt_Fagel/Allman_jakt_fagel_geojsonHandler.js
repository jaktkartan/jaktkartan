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
                    if (feature.geometry.crs && feature.geometry.crs.type && feature.geometry.crs.type.toUpperCase() !== 'NAME') {
                        console.error("Invalid CRS type:", feature.geometry.crs.type);
                        alert("Invalid CRS type detected. Skipping this feature.");
                        return;
                    }
                    // Skapa popup-innehållet dynamiskt baserat på alla attribut i geojson-egenskaperna
                    var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

                    // Lista över egenskaper som ska döljas helt
                    var hideProperties = ['id', 'Aktualitet'];
                    
                    // Lista över egenskaper där namnet ska döljas men data visas
                    var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

                    for (var prop in feature.properties) {
                        if (hideProperties.includes(prop)) {
                            continue; // Hoppa över dessa egenskaper helt
                        }
                        if (prop === 'BILD') {
                            // Lägg till en stil för att begränsa bildstorleken
                            popupContent += '<p><img src="' + feature.properties[prop] + '" style="max-width: 100%;" alt="Bild"></p>';
                        } else if (prop === 'LINK' || prop === 'VAGBESKRIV') {
                            // Visa hyperlänken som "Länk"
                            popupContent += '<p><a href="' + feature.properties[prop] + '" target="_blank">Länk</a></p>';
                        } else if (hideNameOnlyProperties.includes(prop)) {
                            popupContent += '<p>' + feature.properties[prop] + '</p>';
                        } else {
                            popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                        }
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
