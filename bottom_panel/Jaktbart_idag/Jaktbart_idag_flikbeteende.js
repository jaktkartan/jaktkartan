document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    var latitudeElement = document.getElementById('latitude');
    var longitudeElement = document.getElementById('longitude');

    console.log('Latitude element:', latitudeElement);
    console.log('Longitude element:', longitudeElement);

    if (latitudeElement && longitudeElement) {
        // Hämta latitud och longitud från localStorage
        var lat = parseFloat(localStorage.getItem('userLatitude'));
        var lon = parseFloat(localStorage.getItem('userLongitude'));

        console.log('Latitude from localStorage:', lat);
        console.log('Longitude from localStorage:', lon);

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
});
