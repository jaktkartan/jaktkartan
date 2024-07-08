// CSS för teckenförklaringen
var style = document.createElement('style');
style.innerHTML = `
    .legend {
        background: white;
        padding: 10px;
        border: 2px solid #ccc;
        border-radius: 5px;
        font-size: 12px;
        line-height: 1.5;
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 1000;
    }
    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

// Globala variabler för lagerstatus
var layerIsActive = {}; // Håller koll på aktiva lager
var layerStyles = {};   // Håller koll på lagerstilar

// Funktion för att uppdatera lagerstatus
function updateLayerStatus(layerName, isActive, style) {
    layerIsActive[layerName] = isActive;
    if (style) {
        layerStyles[layerName] = style;
    }
    updateLegend(); // Uppdatera teckenförklaringen när lagerstatus ändras
}

// Funktion för att uppdatera teckenförklaringen
function updateLegend() {
    var legend = document.getElementById('legend');
    if (!legend) {
        legend = document.createElement('div');
        legend.id = 'legend';
        legend.className = 'legend';
        document.body.appendChild(legend);
    }
    var html = '<h4>Teckenförklaring</h4>';

    // Kontrollera alla aktiva lager och skapa teckenförklaring
    Object.keys(layerIsActive).forEach(function(layerName) {
        if (layerIsActive[layerName]) {
            var styles = layerStyles[layerName];
            html += '<i style="background:' + (styles.fillColor || '#ffffff') + '"></i> ' + layerName + '<br>';
        }
    });
    legend.innerHTML = html;
}

// Funktion för att avaktivera alla lager
function deactivateAllLayersKartor() {
    Object.keys(layerIsActive).forEach(function(layerName) {
        layerIsActive[layerName] = false;
    });
    updateLegend();
}

// Funktion för att avaktivera alla lager
function deactivateAllLayersUpptack() {
    Object.keys(layerIsActive).forEach(function(layerName) {
        layerIsActive[layerName] = false;
    });
    updateLegend();
}

// Exempel på hur geojson-lager läggs till
function addGeoJSONLayer(layerName, geojsonData, style) {
    var layer = L.geoJSON(geojsonData, { style: style }).addTo(map);
    updateLayerStatus(layerName, true, style);
    layer.on('remove', function() {
        updateLayerStatus(layerName, false);
    });
    return layer;
}

// Lägg till en eventlyssnare till tab1 och tab2-knapparna
document.getElementById('tab1').addEventListener('click', function() {
    updateLegend(); // Uppdatera teckenförklaringen när tab1 klickas
});

document.getElementById('tab2').addEventListener('click', function() {
    updateLegend(); // Uppdatera teckenförklaringen när tab2 klickas
});

// Exempel på hur man kan sätta upp geojson-lager (anpassa dessa funktioner)
document.addEventListener('DOMContentLoaded', function() {
    // Exempel på hur man lägger till ett geojson-lager
    var exampleGeoJson = {}; // Sätt din geojson-data här
    var exampleStyle = { fillColor: 'blue' }; // Sätt din stil här
    addGeoJSONLayer('Example Layer', exampleGeoJson, exampleStyle);
});
