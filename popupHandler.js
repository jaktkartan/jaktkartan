// popupHandler.js

// Lägg till en eventlistener för när dokumentet har laddats
document.addEventListener("DOMContentLoaded", function() {
    map.on('click', function(e) {
        var latlng = e.latlng;
        console.log("Map clicked at: ", latlng);
    });
});

// Funktion för att uppdatera panelens innehåll
function updatePanelContent(properties) {
    var panelContent = document.getElementById('panel-content');
    if (!panelContent) {
        console.error("Elementet 'panel-content' hittades inte.");
        return;
    }

    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }

    panelContent.innerHTML = content;
}
