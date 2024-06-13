// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 90vw; /* Begränsa maximal bredd för innehållet i popup-fönstret till 90% av viewportens bredd */
        max-height: 300px; /* Begränsa maximal höjd för popup-fönstret */
        overflow-y: auto; /* Aktivera vertikal scrollning vid behov */
        bottom: 10px; /* Placera popup längst ned på skärmen */
        left: 50%; /* Centrera horisontellt */
        transform: translateX(-50%); /* Justera för att centrera horisontellt */
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
        autoPan: false, // Stäng av automatisk centrering
        autoPanPaddingBottom: window.innerHeight / 2 // Centrera längst ned på skärmen
    };

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    return L.popup(popupOptions).setContent(content);
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
