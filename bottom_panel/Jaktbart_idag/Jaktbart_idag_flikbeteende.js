document.addEventListener("DOMContentLoaded", function() {
    // Fördröjning på 1 sekund (1000 millisekunder)
    setTimeout(function() {
        // Hämta koordinaterna från en existerande källa, t.ex. GPS-tjänst
        var userLatitude = localStorage.getItem('userLatitude');
        var userLongitude = localStorage.getItem('userLongitude');
        
        // Kontrollera att koordinaterna är tillgängliga och inte är null eller undefined
        if (userLatitude !== null && userLongitude !== null) {
            // Spara koordinater i localStorage
            localStorage.setItem('userLatitude', userLatitude);
            localStorage.setItem('userLongitude', userLongitude);

            console.log("Koordinater sparade i localStorage:", userLatitude, userLongitude);
        } else {
            console.log("Kunde inte hämta koordinater från localStorage.");
        }
    }, 1000); // Fördröjning på 1 sekund (1000 millisekunder)
});
