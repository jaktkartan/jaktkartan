// Hämta GeoJSON-data och lägg till på kartan
axios.get('Upptack/upptack.geojson')
    .then(function (response) {
        console.log("Successfully fetched GeoJSON data:", response.data);
        var geojsonLayer = L.geoJSON(response.data, {
            pointToLayer: function (feature, latlng) {
                // Här kan du anpassa punkternas utseende baserat på egenskaperna (feature.properties)
                var markerColor = getMarkerColor(feature.properties.TYP); // Hämta färg baserat på egenskapen TYP

                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: markerColor,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                // Här kan du lägga till popup-information för varje punkt
                var popupContent = "<b>" + feature.properties.NAMN + "</b><br>" +
                                    "Typ: " + feature.properties.TYP + "<br>" +
                                    "Datum: " + feature.properties.DATUM_FRAN + " - " + feature.properties.DATUM_TILL;
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(function (error) {
        console.log("Error fetching GeoJSON data:", error.message);
    });

// Funktion för att bestämma markeringsfärg baserat på typ
function getMarkerColor(typ) {
    // Här kan du definiera olika färger för olika typer av händelser
    // Exempel:
    if (typ === "Mässa") {
        return "blue";
    } else if (typ === "Annat") {
        return "green";
    } else {
        return "red";
    }
}

