// Deklarera en global variabel för att spåra lagrets tillstånd
var layerIsActive = false;
var geojsonLayer; // Deklarera geojsonLayer utanför funktionen för att den ska vara tillgänglig globalt

// Funktion för att hämta GeoJSON-data och skapa lagret
function fetchGeoJSONDataAndCreateLayer() {
    axios.get('https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson')
        .then(function (response) {
            console.log("Successfully fetched GeoJSON data:", response.data);
            geojsonLayer = L.geoJSON(response.data, {
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
        })
        .catch(function (error) {
            console.log("Error fetching GeoJSON data:", error.message);
        });
}

// Funktion för att tända och släcka lagret
function toggleLayer() {
    if (!layerIsActive) {
        // Om lagret inte är aktivt, lägg till lagret på kartan
        fetchGeoJSONDataAndCreateLayer();
        layerIsActive = true;
    } else {
        // Om lagret är aktivt, ta bort lagret från kartan
        map.removeLayer(geojsonLayer);
        layerIsActive = false;
    }
}
