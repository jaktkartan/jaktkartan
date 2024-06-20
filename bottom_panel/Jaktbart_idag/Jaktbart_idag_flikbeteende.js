document.addEventListener("DOMContentLoaded", function() {
    // Event listener för knappen
    var showCoordinatesBtn = document.getElementById('showCoordinatesBtn');
    var coordinatesContainer = document.getElementById('coordinatesContainer');

    if (showCoordinatesBtn && coordinatesContainer) {
        showCoordinatesBtn.addEventListener('click', function() {
            var userLatitude = localStorage.getItem('userLatitude');
            var userLongitude = localStorage.getItem('userLongitude');
            
            if (userLatitude !== null && userLongitude !== null) {
                handleCoordinates(userLatitude, userLongitude);
            } else {
                console.log("Kunde inte hämta koordinater från localStorage.");
                // Alternativt, hantera om koordinaterna inte finns tillgängliga
            }
        });
    } else {
        console.error("Elementet 'showCoordinatesBtn' eller 'coordinatesContainer' kunde inte hittas.");
    }
});

function handleCoordinates(lat, lon) {
    var coordinatesContainer = document.getElementById('coordinatesContainer');
    if (coordinatesContainer) {
        // Visa koordinaterna i HTML
        coordinatesContainer.innerHTML = `<p>Latitude: ${lat}</p><p>Longitude: ${lon}</p>`;
    } else {
        console.error("Elementet 'coordinatesContainer' kunde inte hittas.");
    }
}

// Den här delen av koden behöver inte exekveras omedelbart vid DOMContentLoaded
setTimeout(function() {
    // Hämta koordinaterna från localStorage
    var userLatitude = localStorage.getItem('userLatitude');
    var userLongitude = localStorage.getItem('userLongitude');
    
    // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
    if (userLatitude !== null && userLongitude !== null) {
        // Logga koordinaterna
        console.log("Latitude från localStorage:", userLatitude);
        console.log("Longitude från localStorage:", userLongitude);
        
        // Exempel på annan åtgärd baserat på koordinaterna
        // Exempel: Skicka koordinaterna till en annan funktion eller gör något annat med dem
        handleCoordinates(userLatitude, userLongitude);
    } else {
        console.log("Kunde inte hämta koordinater från localStorage.");
    }
}, 1000); // Fördröjning på 1 sekund (1000 millisekunder)
