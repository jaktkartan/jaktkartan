// CSS för popup-panelen
var styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.innerHTML = `
    #popup-panel {
        position: fixed;
        bottom: 0px;
        width: 95%;
        max-height: 40%;
        background-color: #fff;
        border-top: 5px solid #fff;
        border-left: 5px solid #fff;
        border-right: 5px solid #fff;
        padding: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
        overflow-y: auto;
        word-wrap: break-word;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-family: 'Roboto', sans-serif;
        color: rgb(50, 94, 88);
        transform: translateY(100%);
        transition: transform 0.5s ease-in-out;
    }

    @keyframes slideIn {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }

    .show {
        animation: slideIn 0.5s forwards;
    }

    .hide {
        animation: slideOut 0.5s forwards;
    }
`;

// Lägg till style-taggen till <head>
document.head.appendChild(styleTag);

// JavaScript-logik för popup-panelen
var popupPanel = document.getElementById('popup-panel');
var popupPanelVisible = false;

// Funktion för att kontrollera om en URL pekar på en bild
function isImageUrl(url) {
    // Kontrollera att url är en sträng och matchar bildformat
    return typeof url === 'string' && (url.match(/\.(jpeg|jpg|png|webp|gif)$/i) || url.includes('github.com') && url.includes('?raw=true'));
}

// Funktion för att visa popup-panelen med specifika egenskaper
function showPopupPanel(properties) {
    updatePopupPanelContent(properties);

    // Lägg till klassen för att visa popup-panelen
    popupPanel.classList.remove('hide');
    popupPanel.classList.add('show');
    popupPanelVisible = true;
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    // Lägg till klassen för att dölja popup-panelen
    popupPanel.classList.remove('show');
    popupPanel.classList.add('hide');
    popupPanelVisible = false;
}

// Funktion för att uppdatera panelens innehåll baserat på egenskaper från geojson-objekt
function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    if (!panelContent) {
        console.error("Elementet 'popup-panel-content' hittades inte.");
        return;
    }

    console.log('Egenskaper som skickas till popup-panelen:', properties); // Debug-utskrift

    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];

            // Om värdet är en URL och pekar på en bild
            if (isImageUrl(value)) {
                content += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                console.log('Bild URL:', value); // Debug-utskrift av bild-URL
            } else {
                content += '<p><strong>' + key + ':</strong> ' + (value ? value : 'Ingen information tillgänglig') + '</p>';
            }
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
                e.originalEvent.stopPropagation(); // Stoppa bubbla av klickhändelse för att förhindra att document-click listenern aktiveras
            }

            if (e.target && e.target.feature && e.target.feature.properties) {
                var properties = e.target.feature.properties;
                console.log('Klickade på ett geojson-objekt med egenskaper:', properties);

                if (!popupPanelVisible) {
                    showPopupPanel(properties);
                } else {
                    updatePopupPanelContent(properties);
                }
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
    if (popupPanelVisible && !popupPanel.contains(event.target)) {
        hidePopupPanel();
    }
});

// Kontrollera att popup-panelen finns och har nödvändiga HTML-element
if (!popupPanel || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}
