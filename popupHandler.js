// Funktion för att uppdatera panelinnehållet baserat på egenskaper från geojson-objekt
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
    showPanel(); // Visa panelen när innehåll uppdateras
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        var properties = e.target.feature.properties;
        updatePanelContent(properties);
    });
}

// Funktion för att dölja panelen
function hidePanel() {
    var panel = document.getElementById('panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Funktion för att visa panelen
function showPanel() {
    var panel = document.getElementById('panel');
    if (panel) {
        panel.style.display = 'block';
    }
}

function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        console.log("Polygon clicked:", e.target.feature.properties); // Kontrollmeddelande
        var properties = e.target.feature.properties;
        updatePanelContent(properties);
    });
}

