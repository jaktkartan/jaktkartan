document.addEventListener('DOMContentLoaded', function() {
    function updatePosition() {
        var latitudeElement = document.getElementById('latitude');
        var longitudeElement = document.getElementById('longitude');

        if (latitudeElement && longitudeElement) {
            // Hämta latitud och longitud från localStorage
            var lat = parseFloat(localStorage.getItem('userLatitude'));
            var lon = parseFloat(localStorage.getItem('userLongitude'));

            // Visa latitud och longitud på sidan
            if (lat && lon) {
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

    // Kör updatePosition när sidan laddas
    updatePosition();

    // Kör updatePosition när localStorage uppdateras
    window.addEventListener('storage', updatePosition);
});
