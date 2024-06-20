document.addEventListener("DOMContentLoaded", function() {
    var showCoordinatesBtn = document.getElementById('showCoordinatesBtn');
    
    if (showCoordinatesBtn) {
        showCoordinatesBtn.addEventListener('click', function() {
            // Kör all kod när användaren klickar på knappen
            fetchAndDisplayCoordinates();
        });
    } else {
        console.error("Elementet 'showCoordinatesBtn' kunde inte hittas.");
    }
});

function fetchAndDisplayCoordinates() {
    // Fördröjning på 1 sekund (1000 millisekunder) för att simulera asynkron hämtning
    setTimeout(function() {
        // Hämta koordinaterna från localStorage
        var userLatitude = localStorage.getItem('userLatitude');
        var userLongitude = localStorage.getItem('userLongitude');
        
        // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
        if (userLatitude !== null && userLongitude !== null) {
            // Logga koordinaterna
            console.log("Latitude från localStorage:", userLatitude);
            console.log("Longitude från localStorage:", userLongitude);
            
            // Visa koordinaterna i HTML
            handleCoordinates(userLatitude, userLongitude);
        } else {
            console.log("Kunde inte hämta koordinater från localStorage.");
        }
    }, 1000); // Fördröjning på 1 sekund (1000 millisekunder)
}

function handleCoordinates(lat, lon) {
    var coordinatesContainer = document.getElementById('coordinatesContainer');
    if (coordinatesContainer) {
        // Visa koordinaterna i HTML
        coordinatesContainer.innerHTML = `<p>Latitude: ${lat}</p><p>Longitude: ${lon}</p>`;
    } else {
        console.error("Elementet 'coordinatesContainer' kunde inte hittas.");
    }
}
