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

// Referens till popup-panelen
var popupPanel = document.getElementById('popup-panel');

// Funktion för att visa eller uppdatera popup-panelen med specifika egenskaper
function showOrUpdatePopupPanel(properties) {
    updatePopupPanelContent(properties); // Uppdatera innehåll baserat på egenskaper

    if (!popupPanelVisible) {
        console.log('Visar popup-panelen...');
        // Visa popup-panelen
        popupPanel.style.display = 'block';
        setTimeout(function() {
            popupPanel.style.transform = 'translateY(0%)';
        }, 10);
        popupPanelVisible = true;
    }
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    console.log('Döljer popup-panelen...');
    // Dölj popup-panelen med en animation
    popupPanel.style.transform = 'translateY(100%)';
    setTimeout(function() {
        popupPanel.style.display = 'none';
    }, 300);
    popupPanelVisible = false;
}

// Funktion för att uppdatera panelens innehåll baserat på egenskaper från geojson-objekt
function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    if (!panelContent) {
        console.error("Elementet 'popup-panel-content' hittades inte.");
        return;
    }

    // Uppdatera innehållet baserat på egenskaperna från geojson-objektet
    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }

    // Uppdatera panelens innehåll
    panelContent.innerHTML = content;
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        e.originalEvent.stopPropagation(); // Stoppa event propagation
        try {
            if (e.target && e.target.feature && e.target.feature.properties) {
                var properties = e.target.feature.properties;
                console.log('Klickade på ett geojson-objekt med egenskaper:', properties);
                showOrUpdatePopupPanel(properties); // Visa eller uppdatera panelen med aktuella egenskaper
            } else {
                console.error('Ingen geojson-information hittades i klickhändelsen.');
            }
        } catch (error) {
            console.error('Fel vid hantering av klickhändelse:', error);
        }
    });
}

// Eventlyssnare för att stänga popup-panelen vid klick utanför
document.addEventListener('click', function(event) {
    // Kontrollera om klicket är på ett geojson-objekt eller i popup-panelen
    if (popupPanelVisible && !popupPanel.contains(event.target) && !event.target.closest('.leaflet-popup') && !event.target.closest('.leaflet-marker-icon')) {
        console.log('Klick utanför popup-panelen, döljer den...');
        hidePopupPanel(); // Dölj panelen om klicket var utanför
    }
}, true);

// Kontrollera att popup-panelen finns och har nödvändiga HTML-element
if (!popupPanel || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}
