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

    // Lägg till popup på kartan
    // Detta bör ske när användaren klickar på ett objekt, inte automatiskt
    // popup.addTo(map);

    return popup;
}

// Funktion för att öppna popup-fönstret vid angiven position
function openPopupAtPosition(popup, position) {
    // Hämta latitud och longitud från den angivna positionen
    var lat = position.lat;
    var lng = position.lng;

    // Skapa LatLng-objekt för den angivna positionen
    var latLng = L.latLng(lat, lng);

    // Uppdatera popup-fönstrets position till den angivna positionen
    popup.setLatLng(latLng);

    // Lägg till popup på kartan
    popup.openOn(map);
}

// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = popupStyles;
document.head.appendChild(styleTag);

// Exempel på hur man använder funktionen createPopup och öppnar det vid en specifik position
var popupContent = '<div style="max-width: 300px; overflow-y: auto;">Exempel på popup-innehåll</div>';
var popup = createPopup(popupContent);

// Exempelposition för att öppna popup längst ned på sidan
var position = {
    lat: 59.3293, // Latitud
    lng: 18.0686 // Longitud
};

// Öppna popup-fönstret vid den angivna positionen
openPopupAtPosition(popup, position);
