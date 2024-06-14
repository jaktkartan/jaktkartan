// Stilar för popup-panelen
var popupPanel = document.getElementById('popup-panel');
popupPanel.style.position = 'fixed';
popupPanel.style.bottom = '0px';
popupPanel.style.left = '0px';
popupPanel.style.width = '100%';
popupPanel.style.maxHeight = '40%';
popupPanel.style.backgroundColor = '#fff';
popupPanel.style.borderTop = '5px solid rgb(50, 94, 88)';
popupPanel.style.borderLeft = '5px solid rgb(50, 94, 88)';
popupPanel.style.borderRight = '5px solid rgb(50, 94, 88)';
popupPanel.style.padding = '10px';
popupPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
popupPanel.style.zIndex = '1000';
popupPanel.style.display = 'none';
popupPanel.style.overflowY = 'auto';
popupPanel.style.wordWrap = 'break-word';
popupPanel.style.borderTopLeftRadius = '10px';
popupPanel.style.borderTopRightRadius = '10px';

// Funktion för att uppdatera panelinnehållet baserat på egenskaper från geojson-objekt
function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    if (!panelContent) {
        console.error("Elementet 'popup-panel-content' hittades inte.");
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
    showPopupPanel(); // Visa panelen när innehåll uppdateras
}

// Funktion för att dölja panelen
function hidePopupPanel() {
    var panel = document.getElementById('popup-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Funktion för att visa panelen
function showPopupPanel() {
    var panel = document.getElementById('popup-panel');
    if (panel) {
        panel.style.display = 'block';
    }
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        var properties = e.target.feature.properties;
        updatePopupPanelContent(properties);
    });
}

// Lägg till eventlistener för att dölja panelen vid klick utanför den
document.addEventListener('click', function(event) {
    var isClickInside = popupPanel.contains(event.target);

    if (!isClickInside) {
        hidePopupPanel();
    }
});

// Stoppa klick på panelen från att bubbla upp till dokumentet
popupPanel.addEventListener('click', function(event) {
    event.stopPropagation();
});

var geojsonLayer = L.geoJSON(geojsonFeature).addTo(map);
addClickHandlerToLayer(geojsonLayer);
