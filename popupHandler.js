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

// Håll koll på om popup-panelen är synlig eller inte
var popupPanelVisible = false;

// Hämta referens till popup-panelen
var popupPanel = document.getElementById('popup-panel');

// Funktion för att visa popup-panelen
function showPopupPanel() {
    popupPanel.style.display = 'block'; // Visa panelen
    setTimeout(function() {
        popupPanel.style.transform = 'translateY(0%)'; // Flytta panelen uppåt
    }, 10); // Vänta 10 millisekunder innan att tillämpa transform
    popupPanelVisible = true; // Uppdatera flaggan när panelen visas
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    popupPanel.style.transform = 'translateY(100%)'; // Flytta panelen nedåt
    popupPanelVisible = false; // Uppdatera flaggan när panelen göms
}

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

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        if (e.target && e.target.feature && e.target.feature.properties) {
            var properties = e.target.feature.properties;
            updatePopupPanelContent(properties);
        } else {
            console.error('Ingen geojson-information hittades i klickhändelsen.');
        }
    });
}

// Eventlyssnare för att stänga popup-panelen när man klickar utanför den eller på ett annat geojson-objekt
document.addEventListener('click', function(event) {
    // Kontrollera om popup-panelen är synlig
    if (popupPanelVisible) {
        // Kontrollera om klicket var utanför panelen eller på ett annat geojson-objekt
        if (!popupPanel.contains(event.target) && !isGeoJsonFeatureClick(event)) {
            hidePopupPanel(); // Dölj panelen om den är synlig och klicket var utanför
        }
    }
});

// Funktion för att kontrollera om klicket var på ett geojson-objekt
function isGeoJsonFeatureClick(event) {
    // Implementera logik för att avgöra om klicket var på ett geojson-objekt
    // Exempel: 
    // Om du har en geojson-lager-variabel kan du använda den för att kontrollera om klicket träffade ett geojson-objekt
    // Exempel: return geojsonLayer.someFunctionToCheckIfClickIsOnFeature(event);
    return false; // Ersätt med din logik
}
