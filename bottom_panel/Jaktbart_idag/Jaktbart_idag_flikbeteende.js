document.addEventListener("DOMContentLoaded", function() {
    // Kontrollera om vi är på en specifik sida där koordinaterna behövs
    if (document.getElementById('showCoordinatesBtn')) {
        // Fördröjning på 1 sekund (1000 millisekunder)
        setTimeout(function() {
            // Hämta koordinaterna från en annan källa
            var userLatitude = localStorage.getItem('userLatitude');
            var userLongitude = localStorage.getItem('userLongitude');
            
            // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
            if (userLatitude !== null && userLongitude !== null) {
                // Logga koordinaterna
                console.log("Latitude från localStorage:", userLatitude);
                console.log("Longitude från localStorage:", userLongitude);
                
                // Spara koordinater i localStorage (om du behöver uppdatera dem)
                localStorage.setItem('userLatitude', userLatitude);
                localStorage.setItem('userLongitude', userLongitude);

                console.log("Koordinater sparade i localStorage:", userLatitude, userLongitude);
            } else {
                console.log("Kunde inte hämta koordinater från localStorage.");
            }
        }, 1000); // Fördröjning på 1 sekund (1000 millisekunder)
    }
});
