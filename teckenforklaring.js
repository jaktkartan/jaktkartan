// teckenforklaring.js

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
    var html = '<h4>Teckenförklaring</h4>';

    Object.keys(layerIsActive).forEach(function(layerName) {
        if (layerIsActive[layerName]) {
            var styles = layerStyles[layerName];
            Object.keys(styles).forEach(function(filename) {
                var style = styles[filename].style ? styles[filename].style({}) : styles[filename];
                html += '<i style="background:' + style.fillColor + '"></i> ' + layerName + '<br>';
            });
        }
    });

    legend.innerHTML = html;
}

// Funktion för att inaktivera alla lager
function deactivateAllLayersKartor() {
    Object.keys(layerIsActive).forEach(function(layerName) {
        if (layerIsActive[layerName]) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer); // Ta bort lager från kartan
            });
            geojsonLayers[layerName] = []; // Rensa listan med lager
            layerIsActive[layerName] = false; // Markera som inaktiv
        }
    });
    updateLegend(); // Uppdatera teckenförklaringen efter att lager har inaktiverats
}

// Funktion för att växla (aktivera/inaktivera) lager
function toggleLayer(layerName, geojsonURLs) {
    if (!layerIsActive[layerName]) {
        fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
    } else {
        geojsonLayers[layerName].forEach(function(layer) {
            map.removeLayer(layer);  // Ta bort lager från kartan
        });
        geojsonLayers[layerName] = [];
        layerIsActive[layerName] = false;
    }
    updateLegend(); // Uppdatera teckenförklaringen efter att lager har växlats
}

// Lägg till eventlyssnare för knappar eller andra element
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tab2').addEventListener('click', function() {
        if (typeof deactivateAllLayersKartor === 'function') {
            deactivateAllLayersKartor();
        } else {
            console.error("deactivateAllLayersKartor är inte definierad.");
        }
    });
});
