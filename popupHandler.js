// Funktion för att skapa popup-fönster med anpassad position och storlek
function createPopup(content) {
    var popupOptions = {
        maxWidth: '80vw', // Anpassa bredden till 80% av viewportens bredd
        maxHeight: '45vh', // Begränsa höjden till 45% av viewportens höjd
        autoPan: false, // Stäng av automatisk centrering
        closeButton: true // Tillåt stäng-knappen
    };

    // Hårdkodad bild-URL för att felsöka
    var imageUrl = 'https://github.com/timothylevin/Testmiljo/blob/main/bottom_panel/Kartor/Allman_jakt_daggdjur/bilder/vildsvin.jpeg?raw=true';
    var hardcodedImgTag = `<img src="${imageUrl}" alt="Image" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">`;

    // Skapa popup-innehåll
    var popupContent = document.createElement('div');
    popupContent.innerHTML = hardcodedImgTag;

    var popup = L.popup(popupOptions).setContent(popupContent);

    // Beräkna koordinater för att placera popup längst ned på sidan
    var mapBounds = map.getBounds();
    var southWest = mapBounds.getSouthWest();
    var center = mapBounds.getCenter();
    var latLng = L.latLng(southWest.lat, center.lng);

    // Uppdatera popup-fönstrets position
    popup.setLatLng(latLng);

    // Lägg till popup på kartan
    popup.addTo(map);

    return popup;
}



// Inkludera CSS-stilar i <style> taggen i <head> av din HTML-dokument
var styleTag = document.createElement('style');
styleTag.textContent = `
    /* Anpassa popup-fönster stil */
    .leaflet-popup-content-wrapper {
        padding: 10px; /* Lägg till lite padding inuti popup-fönstret */
        max-width: 90vw; /* Begränsa maximal bredd för innehållet i popup-fönstret till 90% av viewportens bredd */
        max-height: 90vh; /* Begränsa maximal höjd för popup-fönstret till 90% av viewportens höjd */
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
document.head.appendChild(styleTag);
