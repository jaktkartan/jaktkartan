// Deklarera variabel för lagret
var upptackGeoJSONLayer;

// Funktion för att ladda upptack.geojson och lägga till lagret på kartan
function loadUpptackGeoJSON() {
    // Först, ta bort det befintliga lagret om det finns
    removeUpptackGeoJSON();
    
    axios.get('https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/upptack.geojson')
        .then(function (response) {
            console.log("Successfully fetched GeoJSON data:", response.data);
            upptackGeoJSONLayer = L.geoJSON(response.data, {
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

// Funktion för att ta bort upptack.geojson-lagret från kartan
function removeUpptackGeoJSON() {
    if (upptackGeoJSONLayer) {
        map.removeLayer(upptackGeoJSONLayer);
        console.log("Removed Upptack GeoJSON layer from the map.");
        // Återställ lagret till null efter borttagning
        upptackGeoJSONLayer = null;
    } else {
        console.log("Upptack GeoJSON layer not found on the map.");
    }
}

// Lägg till felsökningsutskrift i openTab() för att säkerställa korrekt anrop av loadUpptackGeoJSON()
function openTab(tabId, filePath) {
    console.log("Opening tab:", tabId, "with file path:", filePath);
    // Här kan du lägga till eventuell annan kod för hantering av fliköppning
    loadUpptackGeoJSON(); // Se till att denna rad finns här och anropar loadUpptackGeoJSON() när "Upptäck"-fliken öppnas
}
