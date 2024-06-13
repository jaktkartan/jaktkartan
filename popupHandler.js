// Uppdaterat CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 0; /* Ta bort padding inuti popup-fönstret */
        max-width: 300px;
        max-height: 400px;
        overflow-y: auto; /* Vertikal scrollning vid behov */
    }

    /* Anpassa innehållet i popup-fönster */
    .leaflet-popup-content {
        word-wrap: break-word; /* Bryt ord om det inte får plats */
        overflow-wrap: break-word; /* Alternativ modern egenskap */
    }

    /* Anpassa bilder i popup-fönster */
    .leaflet-popup-content img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }
`;

// Inkludera CSS-stilar direkt i JavaScript
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);

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
        var popup = L.popup().setContent(popupContent);
        marker.bindPopup(popup);
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
