// Anta att "map" är en referens till din Leaflet-karta

// Lägg till en händelselyssnare för klick på markörer
map.on('click', function(event) {
    // Kontrollera om klicket inträffade på en markör
    if (event.layer instanceof L.Marker) {
        // Hämta den geografiska positionen för markören
        var markerLatLng = event.latlng;

        // Panorera kartan så att markören hamnar i mitten
        map.panTo(markerLatLng, { animate: true });
    }
});
