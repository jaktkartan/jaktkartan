document.addEventListener('DOMContentLoaded', function() {
    function updatePosition() {
        console.log("Attempting to update position...");
        
        // Logga localStorage innehåll för att verifiera
        console.log("LocalStorage innehåll:", localStorage);

        var latitudeElement = document.getElementById('latitude');
        var longitudeElement = document.getElementById('longitude');

        // Logga elementens tillgänglighet
        console.log("latitudeElement:", latitudeElement);
        console.log("longitudeElement:", longitudeElement);

        if (latitudeElement && longitudeElement) {
            // Hämta latitud och longitud från localStorage
            var lat = parseFloat(localStorage.getItem('userLatitude'));
            var lon = parseFloat(localStorage.getItem('userLongitude'));

            // Logga de hämtade värdena
            console.log("Fetched from localStorage - Latitude:", lat, "Longitude:", lon);

            // Visa latitud och longitud på sidan
            if (!isNaN(lat) && !isNaN(lon)) {
                latitudeElement.textContent = lat.toFixed(6); // Justera precisionen efter behov
                longitudeElement.textContent = lon.toFixed(6); // Justera precisionen efter behov
            } else {
                latitudeElement.textContent = 'N/A';
                longitudeElement.textContent = 'N/A';
            }
        } else {
            console.error('Kunde inte hitta latitude eller longitude element.');
        }
    }

    // Funktion för att vänta på att elementen ska finnas
    function waitForElements() {
        var latitudeElement = document.getElementById('latitude');
        var longitudeElement = document.getElementById('longitude');

        if (latitudeElement && longitudeElement) {
            console.log("Elements found, updating position...");
            updatePosition();
        } else {
            // Om elementen inte finns, vänta och prova igen
            console.log("Elements not found, retrying...");
            setTimeout(waitForElements, 100);
        }
    }

    // Starta väntningen direkt när sidan har laddats
    waitForElements();

    // Kör updatePosition när localStorage uppdateras
    window.addEventListener('storage', updatePosition);
});
