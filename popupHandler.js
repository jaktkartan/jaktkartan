// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 300px; /* Begränsa maximal bredd för innehållet i popup-fönstret */
        max-height: 300px; /* Begränsa maximal höjd för popup-fönstret */
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

// Funktion för att skapa en marker med popup-fönster för bilder från GeoJSON
function createMarkerWithPopup(map, feature) {
    var properties = feature.properties;
    var imageUrls = findImageUrls(properties);

    if (imageUrls.length > 0) {
        var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map);

        // Ladda bilderna och skapa popup-fönster
        var popupContent = imageUrls.map(function(imageUrl) {
            return `<img src="${imageUrl}" alt="Image">`;
        }).join('<br>'); // Använd '<br>' för att separera bilder vertikalt

        var popup = L.popup().setContent(popupContent);
        marker.bindPopup(popup);
    }
}

// Funktion för att hitta alla egenskaper med giltiga bild-URL:er från GeoJSON
function findImageUrls(properties) {
    var imageUrls = [];

    for (var key in properties) {
        if (properties.hasOwnProperty(key) && typeof properties[key] === 'string' && isImageUrl(properties[key])) {
            imageUrls.push(properties[key]);
        }
    }

    return imageUrls;
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
