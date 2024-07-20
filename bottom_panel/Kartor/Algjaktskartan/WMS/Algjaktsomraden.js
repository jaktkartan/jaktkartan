// Funktion för att generera en slumpmässig färg i en naturlig nyans
function getRandomColor() {
    var hue = Math.floor(Math.random() * 360); // Färgton
    var lightness = Math.floor(Math.random() * 40) + 40; // Ljushet från 40 till 80
    return `hsl(${hue}, 70%, ${lightness}%)`;
}

// Färgcache för att bevara färger för varje feature
var colorCache = {};

// Funktion för att lägga till feature layer
function addFeatureLayer() {
    var featureLayer = L.esri.featureLayer({
        url: 'https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/rest/services/Jaktadm/lst_jaktadm_visning/MapServer/0',
        style: function (feature) {
            // Om feature inte redan har en färg i cache, generera och spara i cache
            if (!colorCache[feature.id]) {
                colorCache[feature.id] = getRandomColor();
            }
            return {
                color: colorCache[feature.id], // Kantfärg
                weight: 2, // Kantens tjocklek
                opacity: 1, // Kantens opacitet
                fillColor: colorCache[feature.id], // Fyllningsfärg
                fillOpacity: 0.5 // Konstant transparens på fyllningen
            };
        },
        onEachFeature: function (feature, layer) {
            // Bygg en HTML-tabell med attributdata
            var popupContent = '<table class="popup-table">';
            if (feature.properties) {
                for (var key in feature.properties) {
                    if (feature.properties.hasOwnProperty(key)) {
                        popupContent += '<tr><th>' + key + '</th><td>' + feature.properties[key] + '</td></tr>';
                    }
                }
            }
            popupContent += '</table>';
            
            // Bind popup med HTML-tabellen
            layer.bindPopup(popupContent);
        }
    }).addTo(window.map);

    // Funktion som döljer eller visar lagret baserat på zoomnivå
    function updateLayerVisibility() {
        var zoomLevel = window.map.getZoom();
        if (zoomLevel >= 13) { // Visa lagret vid zoomnivå 13 eller högre
            if (!window.map.hasLayer(featureLayer)) {
                featureLayer.addTo(window.map);
            }
        } else {
            if (window.map.hasLayer(featureLayer)) {
                window.map.removeLayer(featureLayer);
            }
        }
    }

    // Lägg till en "zoomend" lyssnare för att uppdatera lagrets synlighet när användaren zoomar
    window.map.on('zoomend', updateLayerVisibility);

    // Initial kontroll för att ställa in lagrets synlighet när kartan först laddas
    updateLayerVisibility();
}
