// CSS för popup-fönster
var popupStyles = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 90vw; /* Begränsa maximal bredd för innehållet i popup-fönstret till 90% av viewportens bredd */
        max-height: 70vh; /* Begränsa maximal höjd för popup-fönstret till 70% av viewportens höjd */
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
        maxHeight: '70vh', // Begränsa höjden till 70% av viewportens höjd
        autoPan: false, // Stäng av automatisk centrering
        closeButton: true // Tillåt stäng-knappen
    };

    // Omvandla URL:er till bilder om de är bild-URL:er, även om de innehåller query-parametrar
    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    var popup = L.popup(popupOptions).setContent(content);

    // Hämta kartans gränser och centrera för att hitta sydvästra hörnet
    var mapBounds = map.getBounds();
    var southWest = mapBounds.getSouthWest();
    var latLng = L.latLng(southWest.lat, southWest.lng); // Sydvästra hörnet

    // Uppdatera popup-fönstrets position till sydvästra hörnet av kartan
    popup.setLatLng(latLng);

    // Lägg till popup på kartan
    popup.openOn(map);

    return popup;
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);
