// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 90vw; /* Begränsa maximal bredd för innehållet i popup-fönstret till 90% av viewportens bredd */
        max-height: 70vh; /* Begränsa maximal höjd för popup-fönstret till 70% av viewportens höjd */
        overflow-y: auto; /* Aktivera vertikal scrollning vid behov */
    }

    /* Anpassa bilder i popup-fönster */
    .leaflet-popup-content img {
        display: block; /* Se till att bilderna visas som blockelement */
        margin: 0 auto; /* Centrera bilder horisontellt */
        max-width: 100%; /* Sätt maximal bredd för bilderna till 100% av popup-fönstrets bredd */
        height: auto; /* Automatisk höjd för att behålla proportionerna */
    }
`;

// Funktion för att skapa popup-fönster med anpassad position och storlek
function createPopup(content) {
    var popupOptions = {
        maxWidth: '90vw', // Anpassa bredden till 90% av viewportens bredd
        maxHeight: '70vh', // Begränsa höjden till 70% av viewportens höjd
        autoPan: false, // Stäng av automatisk centrering
        closeButton: true // Tillåt stäng-knappen
    };

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    var popup = L.popup(popupOptions).setContent(content);

    return popup;
}

// Uppdaterad funktion för att öppna popup-fönstret längst ned på sidan
function openPopupAtBottom(popup) {
    // Beräkna koordinater för att placera popup längst ned på sidan
    var mapBounds = map.getBounds();
    var southWest = mapBounds.getSouthWest();
    var southEast = mapBounds.getSouthEast();
    var center = mapBounds.getCenter();
    var latLng = L.latLng(southWest.lat, center.lng); // Längst ned på sidan

    // Uppdatera popup-fönstrets position till den angivna latLng-positionen
    popup.setLatLng(latLng);

    // Öppna popup-fönstret på kartan
    popup.openOn(map);

    return popup;
}

// Funktion för att binda popup till geojson-lagret med klickhändelse
function bindPopupToLayer(layer, popupContent) {
    // Lägg till en klickhändelse till lagret för att öppna popup
    layer.on('click', function(event) {
        // Skapa popup-fönstret
        var popup = createPopup(popupContent);

        // Öppna popup längst ned på sidan
        openPopupAtBottom(popup);
    });
}

// Uppdaterad funktion för att hämta GeoJSON-data och skapa lager med popup
function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
    geojsonURLs.forEach(function(geojsonURL) {
        axios.get(geojsonURL)
            .then(function(response) {
                console.log("Successfully fetched GeoJSON data:", response.data);
                var layer = L.geoJSON(response.data, {
                    onEachFeature: function(feature, layer) {
                        // Skapa popup-innehåll dynamiskt baserat på alla attribut i geojson-egenskaperna
                        var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';
                        for (var prop in feature.properties) {
                            // Lägg till alla egenskaper i popup-innehållet
                            popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                        }
                        popupContent += '</div>';

                        // Använd bindPopupToLayer för att binda klickhändelse och popup-innehåll
                        bindPopupToLayer(layer, popupContent);
                    }
                });

                // Lägg till lagret i geojsonLayers arrayen
                geojsonLayers[layerName].push(layer);

                // Om lagret är aktivt, lägg till det på kartan
                if (layerIsActive[layerName]) {
                    layer.addTo(map);
                }
            })
            .catch(function(error) {
                console.log("Error fetching GeoJSON data:", error.message);
            });
    });

// Aktivera eller avaktivera lagret
Kartor_geojsonHandler.toggleLayer(layerName, geojsonURLs);

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);

