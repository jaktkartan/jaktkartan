// Hämta GeoJSON-data och lägg till på kartan
axios.get('Upptack/upptack.geojson')
    .then(function (response) {
        console.log("Successfully fetched GeoJSON data:", response.data);
        var geojsonLayer = L.geoJSON(response.data, {
            pointToLayer: function (feature, latlng) {
                console.log("Creating point layer for feature:", feature);
                // Här kan du anpassa punkternas utseende baserat på egenskaperna (feature.properties)
                return L.marker(latlng);
            },
            onEachFeature: function (feature, layer) {
                console.log("Adding popup for feature:", feature);
                // Här kan du lägga till popup-information för varje punkt
                var popupContent = "<b>" + feature.properties.NAMN + "</b><br>" +
                                    "Typ: " + feature.properties.TYP + "<br>" +
                                    "Datum: " + feature.properties.DATUM_FRAN + " - " + feature.properties.DATUM_TILL;
                layer.bindPopup(popupContent);
            }
        }).addTo(map);

        // Hämta alla standardmarkörer och ändra deras display-attribut till block för att göra dem synliga
        var standardMarkers = document.querySelectorAll('.leaflet-marker-icon[src*="marker-icon.png"]');
        console.log("Found standard markers:", standardMarkers);
        standardMarkers.forEach(function(marker) {
            console.log("Changing display attribute for marker:", marker);
            marker.style.display = 'block';
        });
    })
    .catch(function (error) {
        console.log("Error fetching GeoJSON data:", error.message);
    });
