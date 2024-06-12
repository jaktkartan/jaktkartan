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

// Funktion för att skapa popup-fönster med innehåll
function createPopup(content) {
    var popupOptions = {
        maxWidth: '300' // Maximal bredd för popup-fönstret i pixel
    };
    return L.popup(popupOptions).setContent(content);
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
