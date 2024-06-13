// Dynamiskt lägga till popup-stilar till dokumentet
var style = document.createElement('style');
style.innerHTML = `
    .leaflet-popup-content-wrapper {
        padding: 10px;
        max-width: 90vw;
        max-height: 70vh;
        overflow-y: auto;
    }

    .leaflet-popup-content img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }

    .leaflet-popup-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        max-height: 50%;
        overflow-y: auto;
        background: white;
        border: 1px solid #ccc;
        z-index: 1000;
    }

    .leaflet-popup-bottom .leaflet-popup-content-wrapper {
        max-width: 100%;
        max-height: 100%;
    }
`;
document.head.appendChild(style);

// Funktion för att skapa popup-fönster med anpassad position och storlek
function createPopup(content) {
    var popupOptions = {
        closeButton: true,
        className: 'leaflet-popup-bottom'
    };

    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    var popup = L.popup(popupOptions).setContent(content);
    return popup;
}

// Funktion för att öppna popup längst ned på sidan
function openPopupAtBottom(popup) {
    var mapBounds = map.getBounds();
    var southWest = mapBounds.getSouthWest();
    var center = mapBounds.getCenter();
    var latLng = L.latLng(southWest.lat, center.lng);

    popup.setLatLng(latLng).openOn(map);
    return popup;
}

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

                            // Om det finns bilder i egenskaperna, lägg till dem i popup-innehållet
                            if (feature.properties.imageUrls && Array.isArray(feature.properties.imageUrls)) {
                                feature.properties.imageUrls.forEach(function(imageUrl) {
                                    popupContent += '<img src="' + imageUrl + '" style="max-width: 100%; height: auto;">';
                                });
                            }

                            // Använd bindPopupToLayer för att hantera popup
                            bindPopupToLayer(layer, popupContent);
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

