// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 0 !important; /* Ta bort padding inuti popup-fönstret */
        max-width: 300px;
        max-height: 400px;
        overflow-y: auto; /* Vertikal scrollning vid behov */
        overflow-x: hidden; /* Dölj horisontell scrollning */
    }

    /* Anpassa innehållet i popup-fönster */
    .leaflet-popup-content {
        word-wrap: break-word; /* Bryt ord om det inte får plats */
        overflow-wrap: break-word; /* Alternativ modern egenskap */
        max-width: calc(100% - 20px); /* Sätt maximal bredd för innehållet minus padding */
        padding: 10px; /* Lägg till lite padding inuti popup-innehållet */
    }

    /* Anpassa bilder i popup-fönster */
    .leaflet-popup-content img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }

    /* Anpassa z-index för popup-fönster */
    .leaflet-popup-pane {
        z-index: 10000; /* Justera z-index efter behov för att popup-fönstret ska ligga över annat innehåll */
    }
`;

// Funktion för att lägga till CSS-stilar till <style> taggen i <head> av din HTML-dokument
function addPopupStyles() {
    if (!document.querySelector('style#popupStyles')) {
        var styleTag = document.createElement('style');
        styleTag.textContent = popupStyles;
        styleTag.id = 'popupStyles'; // Sätt ett id för att kolla om stilen redan finns
        document.head.appendChild(styleTag);
    }
}

// Anropa funktionen för att lägga till CSS-stilar
addPopupStyles();

// Funktion för att skapa en marker med popup-fönster för bilder och text från GeoJSON
function createMarkerWithPopup(map, feature) {
    var properties = feature.properties;
    var popupContent = '';

    // Loopa igenom alla egenskaper och samla både bilder och text i popup-innehållet
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            if (typeof value === 'string' && isImageUrl(value)) {
                // Om det är en bild-URL, lägg till en <img> tagg i popup-innehållet
                popupContent += `<img src="${value}" alt="Image"><br>`;
            } else if (value !== null && typeof value !== 'object') {
                // Om det är text (inte null och inte en objekt), lägg till det som text i popup-innehållet
                popupContent += `<strong>${key}:</strong> ${value}<br>`;
            }
        }
    }

    if (popupContent !== '') {
        var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map);
        var popup = L.popup({
            maxWidth: 300, // Sätt maxbredd för popup-fönster
            maxHeight: 400, // Sätt maxhöjd för popup-fönster
            autoPan: true, // Automatisk panorering för att visa hela popup-fönstret inom kartans synliga område
            closeButton: false, // Inget stängknapp i popup-fönstret
            closeOnClick: false // Stäng inte popup-fönstret när användaren klickar på kartan
        }).setContent(popupContent);

        // Sätt ett högt z-index-värde för popup-fönstret
        popup.getElement().style.zIndex = '10000';

        marker.bindPopup(popup);

        // Lägg till en klickhändelse för markören
        marker.on('click', function () {
            this.openPopup(); // Öppna popup-fönstret
            this.bringToFront(); // Flytta markören till främsta plan i förhållande till andra markörer

            // Justera z-index direkt på popup-fönstret
            var popupElement = this.getPopup().getElement();
            if (popupElement) {
                popupElement.style.zIndex = '2000'; // Anpassa z-index efter behov för att popup-fönstret ska ligga över annat innehåll
            }
        });
    }
}

// Funktion för att avgöra om en given sträng är en giltig bild-URL
function isImageUrl(url) {
    return (url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null);
}

// Exempel på hur du kan använda funktionen med din GeoJSON-data
L.geoJSON(yourGeoJsonData, {
    onEachFeature: function (feature, layer) {
        createMarkerWithPopup(map, feature);
    }
}).addTo(map);
