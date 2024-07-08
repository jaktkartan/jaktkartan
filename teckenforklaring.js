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
    var layers = Object.assign({}, Kartor_geojsonHandler.layerIsActive, Upptack_geojsonHandler.layerIsActive);
    var styles = Object.assign({}, Kartor_geojsonHandler.layerStyles, Upptack_geojsonHandler.layerStyles);

    Object.keys(layers).forEach(function(layerName) {
        if (layers[layerName]) {
            var layerStyles = styles[layerName];
            if (Array.isArray(layerStyles)) {
                layerStyles.forEach(function(style) {
                    html += '<i style="background:' + (style.fillColor || '#ffffff') + '; border-color:' + (style.color || '#000000') + ';"></i> ' + layerName + '<br>';
                });
            } else {
                html += '<i style="background:' + (layerStyles.fillColor || '#ffffff') + '; border-color:' + (layerStyles.color || '#000000') + ';"></i> ' + layerName + '<br>';
            }
        }
    });
    legend.innerHTML = html;
}

// Lägg till en eventlyssnare till tab1 och tab2-knapparna
document.getElementById('tab1').addEventListener('click', function() {
    updateLegend(); // Uppdatera teckenförklaringen när tab1 klickas
});

document.getElementById('tab2').addEventListener('click', function() {
    updateLegend(); // Uppdatera teckenförklaringen när tab2 klickas
});

// Uppdatera teckenförklaringen när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    updateLegend();
});
