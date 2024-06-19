document.addEventListener("DOMContentLoaded", function() {
    // Fördröjning på 1 sekund (1000 millisekunder)
    setTimeout(function() {
        // Hämta koordinaterna från localStorage
        var userLatitude = localStorage.getItem('userLatitude');
        var userLongitude = localStorage.getItem('userLongitude');
        
        // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
        if (userLatitude !== null && userLongitude !== null) {
            // Logga koordinaterna
            console.log("Latitude från localStorage:", userLatitude);
            console.log("Longitude från localStorage:", userLongitude);
            
            // Visa koordinaterna på HTML-sidan
            displayCoordinates(userLatitude, userLongitude);
        } else {
            console.log("Kunde inte hämta koordinater från localStorage.");
        }
    }, 1000); // Fördröjning på 1 sekund (1000 millisekunder)
});

function handleCoordinates(lat, lon) {
    // Spara koordinaterna till localStorage
    localStorage.setItem('userLatitude', lat);
    localStorage.setItem('userLongitude', lon);
    
    // Visa koordinaterna på HTML-sidan
    displayCoordinates(lat, lon);
    
    // Logga koordinaterna
    console.log("Hanterar koordinaterna:", lat, lon);
    // Lägg till din logik här baserat på koordinaterna
}

function displayCoordinates(lat, lon) {
    // Visa koordinaterna på HTML-sidan
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;
}
