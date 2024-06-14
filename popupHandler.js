// Stilar för popup-panelen
var popupPanel = document.getElementById('popup-panel');
popupPanel.style.position = 'absolute';
popupPanel.style.bottom = '10px';
popupPanel.style.left = '10px';
popupPanel.style.width = 'calc(100% - 20px)';
popupPanel.style.maxWidth = '300px';
popupPanel.style.backgroundColor = '#fff';
popupPanel.style.border = '1px solid #ccc';
popupPanel.style.padding = '10px';
popupPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
popupPanel.style.zIndex = '1000';
popupPanel.style.display = 'none';

// Funktion för att uppdatera panelinnehållet baserat på egenskaper från geojson-objekt
function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    if (!panelContent) {
        console.error("Elementet 'popup-panel-content' hittades inte.");
        return;
    }

    console.log("Uppdaterar panelinnehåll med egenskaper:", properties);

    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }

    panelContent.innerHTML = content;

    console.log("Panelinnehåll uppdaterat:", content);

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
    console.log("showPopupPanel() anropad"); // Lägg till en loggning här för att kontrollera att funktionen anropas
    var panel = document.getElementById('popup-panel');
    console.log("Popup panel element:", panel); // Logga panel-elementet
    if (panel) {
        console.log("Visar popup-panelen");
        panel.style.display = 'block';
        console.log("Popup-panelens display-status:", panel.style.display);
    }
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        console.log("Geojson-objekt klickat:", e.target.feature.properties); // Kontrollmeddelande
        var properties = e.target.feature.properties;
        updatePopupPanelContent(properties);
    });
}
