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
        maxWidth: 300 // Maximal bredd för popup-fönstret i pixel (ska vara en siffra, inte en sträng)
    };

    // Logga ut innehållet innan bearbetning
    console.log("Original content:", content);

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    // Logga ut innehållet efter bearbetning
    console.log("Processed content:", content);

    return L.popup(popupOptions).setContent(content);
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
