document.addEventListener('DOMContentLoaded', function() {
    function updatePosition() {
        var latitudeElement = document.getElementById('latitude');
        var longitudeElement = document.getElementById('longitude');

        if (latitudeElement && longitudeElement) {
            // Hämta latitud och longitud från localStorage
            var lat = parseFloat(localStorage.getItem('userLatitude'));
            var lon = parseFloat(localStorage.getItem('userLongitude'));

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

    // Kontrollera om elementen finns och kör updatePosition om de gör det
    if (document.getElementById('latitude') && document.getElementById('longitude')) {
        updatePosition();
    }

    // Använd MutationObserver för att övervaka DOM-förändringar
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.getElementById('latitude') && document.getElementById('longitude')) {
                    updatePosition();
                    observer.disconnect(); // Koppla från observern när elementen hittas
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Kör updatePosition när localStorage uppdateras
    window.addEventListener('storage', updatePosition);
});
