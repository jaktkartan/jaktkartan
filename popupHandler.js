// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 300px; /* Begränsa maximal bredd för innehållet i popup-fönstret */
    }

    /* Anpassa bilder i popup-fönster */
    .leaflet-popup-content img {
        display: block; /* Se till att bilderna visas som blockelement */
        margin: 0 auto; /* Centrera bilder horisontellt */
        max-width: 100%; /* Sätt maximal bredd för bilderna till 100% av popup-fönstrets bredd */
    }

    /* Responsiv anpassning för mobil */
    @media (max-width: 768px) {
        .leaflet-popup-content-wrapper {
            max-width: 250px; /* Justera popup-fönstrets bredd för mindre skärmar */
        }
    }
`;

// Funktion för att skapa popup-fönster med innehåll
function createPopup(content) {
    var popupOptions = {
        maxWidth: '300' // Maximal bredd för popup-fönstret i pixel
    };
    return L.popup(popupOptions).setContent(content);
}

// Exempel på hur du kan använda funktionen för att skapa popup-fönster med bildlänkar
var popupContent = `
    <div>
        <h2>Popup-titel</h2>
        <p>Här är en bild:</p>
        <img src="path/till/din/bild.jpg" style="max-width: 100%;" alt="Beskrivning av bilden">
    </div>
`;

// Skapa popup-fönstret och lägg till det till en marker eller lager
var popup = createPopup(popupContent);
// Exempel på att lägga till popup till en marker
L.marker([lat, lon]).addTo(map).bindPopup(popup);

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
