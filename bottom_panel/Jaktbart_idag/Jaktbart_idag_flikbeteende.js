document.addEventListener('DOMContentLoaded', function() {
    // Hämta latitud och longitud från localStorage
    var lat = parseFloat(localStorage.getItem('userLatitude'));
    var lon = parseFloat(localStorage.getItem('userLongitude'));

    // Visa latitud och longitud på sidan
    var latitudeElement = document.getElementById('latitude');
    var longitudeElement = document.getElementById('longitude');

    if (lat && lon) {
        latitudeElement.textContent = lat.toFixed(6); // Justera precisionen efter behov
        longitudeElement.textContent = lon.toFixed(6); // Justera precisionen efter behov
    } else {
        latitudeElement.textContent = 'N/A';
        longitudeElement.textContent = 'N/A';
    }

    // Gör något mer med lat och lon här om det behövs
});
