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
            
            // Exempel på annan åtgärd baserat på koordinaterna
            // Exempel: Skicka koordinaterna till en annan funktion eller gör något annat med dem
            handleCoordinates(userLatitude, userLongitude);
        } else {
            console.log("Kunde inte hämta koordinater från localStorage.");
        }
    }, 1000); // Fördröjning på 5 sekunder (1000 millisekunder)
});

function handleCoordinates(lat, lon) {
    // Funktion för att hantera koordinaterna, till exempel att skicka dem till en annan tjänst eller använda dem för beräkningar
    console.log("Hanterar koordinaterna:", lat, lon);
    // Lägg till din logik här baserat på koordinaterna
}
