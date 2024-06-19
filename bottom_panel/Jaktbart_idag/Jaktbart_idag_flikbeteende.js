document.addEventListener('DOMContentLoaded', function() {
    // Logga hela innehållet i localStorage
    console.log('localStorage innehåll:', JSON.stringify(localStorage));

    var latitudeElement = document.getElementById('latitude');
    var longitudeElement = document.getElementById('longitude');

    if (latitudeElement && longitudeElement) {
        // Hämta latitud och longitud från localStorage
        var lat = parseFloat(localStorage.getItem('userLatitude'));
        var lon = parseFloat(localStorage.getItem('userLongitude'));

        // Logga latitud och longitud
        console.log('Latitude från localStorage:', lat);
        console.log('Longitude från localStorage:', lon);

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
});
