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
popupPanel.style.overflowY = 'auto';
popupPanel.style.wordWrap = 'break-word';
popupPanel.style.borderTopLeftRadius = '10px';
popupPanel.style.borderTopRightRadius = '10px';
popupPanel.style.fontFamily = "'Roboto', sans-serif";
popupPanel.style.color = 'rgb(50, 94, 88)';
popupPanel.style.transform = 'translateY(100%)';
popupPanel.style.transition = 'transform 0.3s ease';

// Håll koll på om popup-panelen är synlig eller inte
var popupPanelVisible = false;

// Funktion för att visa popup-panelen med specifika egenskaper
function showPopupPanel(properties) {
    updatePopupPanelContent(properties);

    // Visa popup-panelen
    popupPanel.style.display = 'block';
    setTimeout(function() {
        popupPanel.style.transform = 'translateY(0%)';
    }, 10);
    popupPanelVisible = true;
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
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
        try {
            if (e.originalEvent) {
                // Stoppa bubbla av klickhändelse för att förhindra att document-click listenern aktiveras
                e.originalEvent.stopPropagation();
            }

            if (e.target && e.target.feature && e.target.feature.properties) {
                var properties = e.target.feature.properties;
                console.log('Klickade på ett geojson-objekt med egenskaper:', properties);

                if (!popupPanelVisible) {
                    showPopupPanel(properties);
                } else {
                    updatePopupPanelContent(properties);
                }

                // Stoppa bubbla av klickhändelse för att förhindra att document-click listenern aktiveras
                shouldClosePopupPanel = false;
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
    if (popupPanelVisible && !popupPanel.contains(event.target) && !event.target.closest('.leaflet-popup')) {
        hidePopupPanel();
    }
}, true);

// Lägg till en eventlyssnare för kartans moveend-händelse för att tillåta interaktion med objekt under panorering
map.on('moveend', function() {
    shouldClosePopupPanel = true;
});

// Kontrollera att popup-panelen finns och har nödvändiga HTML-element
if (!popupPanel || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}

// Lägg till hanterare för klick på geojson-lagret
geojsonLayer.eachLayer(addClickHandlerToLayer);
