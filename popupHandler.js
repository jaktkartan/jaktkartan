// Stilar för popup-panelen
var popupPanel = document.getElementById('popup-panel');
popupPanel.style.position = 'fixed';
popupPanel.style.bottom = '0px';
popupPanel.style.left = '0px';
popupPanel.style.width = '100%'; // Ändrat från calc(100%)
popupPanel.style.maxHeight = '40%';
popupPanel.style.backgroundColor = '#fff';
popupPanel.style.borderTop = '5px solid rgb(50, 94, 88)';
popupPanel.style.borderLeft = '5px solid rgb(50, 94, 88)';
popupPanel.style.borderRight = '5px solid rgb(50, 94, 88)';
popupPanel.style.padding = '10px';
popupPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
popupPanel.style.zIndex = '1000';
popupPanel.style.overflowY = 'auto'; // Lägger till scrollbar vid behov
popupPanel.style.wordWrap = 'break-word'; // Bryter text vid behov
popupPanel.style.borderTopLeftRadius = '10px'; // Rundar övre vänstra hörnet
popupPanel.style.borderTopRightRadius = '10px'; // Rundar övre högra hörnet
popupPanel.style.fontFamily = "'Roboto', sans-serif"; // Använder Roboto-typsnittet
popupPanel.style.color = 'rgb(50, 94, 88)';
popupPanel.style.transform = 'translateY(100%)'; // Startposition för transition
popupPanel.style.transition = 'transform 0.3s ease'; // Lägg till transition för animation
popupPanel.style.display = 'none'; // Dölj panelen som standard

// Funktion för att uppdatera panelens innehåll baserat på geojson-objektets egenskaper
function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    var content = '';

    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }

    panelContent.innerHTML = content;
}

// Funktion för att visa panelen när användaren trycker på ett geojson-objekt
function showPopupPanel() {
    popupPanel.style.display = 'block';
}

// Funktion för att dölja panelen med animation
function hidePopupPanel() {
    popupPanel.style.transform = 'translateY(100%)'; // Flytta panelen nedåt
    setTimeout(function() {
        popupPanel.style.display = 'none'; // Dölj panelen efter animationen
    }, 300); // Vänta 0.3 sekunder för att slutföra animationen
}

// Funktion för att visa panelen med animation
function showPopupPanel() {
    popupPanel.style.display = 'block'; // Visa panelen
    setTimeout(function() {
        popupPanel.style.transform = 'translateY(0%)'; // Flytta panelen uppåt
    }, 10); // Vänta 10 millisekunder innan att tillämpa transform
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        var properties = e.target.feature.properties;
        updatePopupPanelContent(properties);
    });
}

// Kontrollera om map-objektet är definierat globalt
if (typeof map !== 'undefined') {
    var geojsonLayer = L.geoJSON(geojsonFeature).addTo(map);
    addClickHandlerToLayer(geojsonLayer);
} else {
    console.error("Map-objektet är inte definierat.");
}
