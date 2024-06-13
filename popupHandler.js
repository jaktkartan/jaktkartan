// Funktion för att skapa popup-fönster med innehåll
function createPopup(content) {
    var popupOptions = {
        maxWidth: 300 // Maximal bredd för popup-fönstret i pixel (ska vara en siffra, inte en sträng)
    };

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    return L.popup(popupOptions).setContent(content);
}

// Exempel på att skapa en marker med popup-fönster som innehåller en bild
function createMarkerWithPopup(map, lat, lng, imageUrl) {
    var marker = L.marker([lat, lng]).addTo(map);
    axios.get(imageUrl)
        .then(function (response) {
            var imageContent = `<img src="${imageUrl}" alt="Image">`;
            var popup = createPopup(imageContent);
            marker.bindPopup(popup);
        })
        .catch(function (error) {
            console.error('Failed to fetch image:', error);
            var errorMessage = "Failed to load image";
            var popup = createPopup(errorMessage);
            marker.bindPopup(popup);
        });
}

// Exempel på att skapa en marker med popup-fönster för en specifik bild-URL
var testImageUrl = 'https://github.com/timothylevin/Testmiljo/blob/main/bottom_panel/Kartor/Allman_jakt_daggdjur/bilder/vildsvin.jpeg?raw=true';
createMarkerWithPopup(map, 62.0, 15.0, testImageUrl); // Använd dina egna koordinater här

// Du kan lägga till fler markörer och popup-fönster genom att anropa createMarkerWithPopup() med olika bilder och koordinater.
