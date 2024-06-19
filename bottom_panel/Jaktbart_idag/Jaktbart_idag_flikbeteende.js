document.addEventListener("DOMContentLoaded", function() {
    // Fördröjning på 5 sekunder (5000 millisekunder)
    setTimeout(function() {
        // Hämta koordinaterna från localStorage
        var userLatitude = localStorage.getItem('userLatitude');
        var userLongitude = localStorage.getItem('userLongitude');
        
        // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
        if (userLatitude !== null && userLongitude !== null) {
            // Använd koordinaterna
            console.log("Latitude från localStorage:", userLatitude);
            console.log("Longitude från localStorage:", userLongitude);

            // Exempel: Uppdatera en karta med de nya koordinaterna
            updateMap(userLatitude, userLongitude);
        } else {
            console.log("Kunde inte hämta koordinater från localStorage.");
        }
    }, 5000); // Fördröjning på 5 sekunder (5000 millisekunder)
});
