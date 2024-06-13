// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 90vw; /* Begränsa maximal bredd för innehållet i popup-fönstret till 90% av viewportens bredd */
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

// Funktion för att skapa popup-fönster med anpassad position och storlek
function createPopup(content) {
    var popupOptions = {
        maxWidth: '90vw', // Anpassa bredden till 90% av viewportens bredd
        maxHeight: '90vh', // Begränsa höjden till 90% av viewportens höjd
        autoPan: false, // Stäng av automatisk centrering
        closeButton: false, // Stäng av stäng-knappen
        closeOnClick: false // Stäng inte popup vid klick utanför
    };

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    var popup = L.popup(popupOptions).setContent(content);

    // Centrera popup längst ned på skärmen
    popup.setLatLng(map.getBounds().getSouthWest());

    return popup;
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
