// Funktion för att skapa en marker med popup-fönster för en bild-URL från GeoJSON
function createMarkerWithPopup(map, feature) {
    var properties = feature.properties;
    var imageUrl = properties.bild_baver; // Anpassa detta beroende på din GeoJSON-struktur

    if (imageUrl) {
        var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map);
        
        // Ladda bilden och skapa popup-fönster
        axios.get(imageUrl)
            .then(function (response) {
                var imageContent = `<img src="${imageUrl}" alt="Image">`;
                var popup = L.popup().setContent(imageContent);
                marker.bindPopup(popup);
            })
            .catch(function (error) {
                console.error('Failed to fetch image:', error);
                var errorMessage = "Failed to load image";
                var popup = L.popup().setContent(errorMessage);
                marker.bindPopup(popup);
            });
    }
}

// Exempel på hur du kan använda funktionen med din GeoJSON-data
L.geoJSON(yourGeoJsonData, {
    onEachFeature: function (feature, layer) {
        createMarkerWithPopup(map, feature);
    }
}).addTo(map);
