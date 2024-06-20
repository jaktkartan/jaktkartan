document.addEventListener("DOMContentLoaded", function() {
    // Fördröjning på 1 sekund (1000 millisekunder)
    setTimeout(function() {
        // Anta att vi får koordinater från en existerande källa, t.ex. GPS-tjänst
        var userLatitude = localStorage.getItem('userLatitude'); // Uppdatera här med riktig koordinathämtning
        var userLongitude = localStorage.getItem('userLongitude'); // Uppdatera här med riktig koordinathämtning
        
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
});
