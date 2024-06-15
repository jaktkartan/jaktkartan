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

// Referens till popup-panelen
var currentPopupPanel = null;

// Funktion för att visa eller uppdatera popup-panelen med specifika egenskaper
function showOrUpdatePopupPanel(properties) {
    if (!currentPopupPanel) {
        createPopupPanel(properties);
    } else {
        // Uppdatera den befintliga panelen med nya egenskaper
        updatePopupPanelContent(properties);
    }
}

// Funktion för att skapa en ny popup-panel med givna egenskaper
function createPopupPanel(properties) {
    // Skapa en ny panel
    var popupPanel = document.createElement('div');
    popupPanel.id = 'popup-panel';
    popupPanel.className = 'popup-panel';
    
    // Lägg till innehåll i panelen
    var content = '<div id="popup-panel-content">';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }
    content += '</div>';

    popupPanel.innerHTML = content;

    // Lägg till stängningsknapp
    var closeButton = document.createElement('button');
    closeButton.textContent = 'Stäng';
    closeButton.addEventListener('click', function() {
        hidePopupPanel();
    });
    popupPanel.appendChild(closeButton);

    // Visa panelen och uppdatera flaggan för den aktuella panelen
    document.body.appendChild(popupPanel);
    currentPopupPanel = popupPanel;
}

// Funktion för att uppdatera innehållet i en befintlig popup-panel
function updatePopupPanelContent(properties) {
    if (currentPopupPanel) {
        var panelContent = currentPopupPanel.querySelector('#popup-panel-content');
        if (panelContent) {
            var content = '';
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var value = properties[key];
                    content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
                }
            }
            panelContent.innerHTML = content;
        }
    }
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    if (currentPopupPanel) {
        currentPopupPanel.style.display = 'none';
        currentPopupPanel = null; // Nollställ den aktuella panelen
    }
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        if (e.target && e.target.feature && e.target.feature.properties) {
            var properties = e.target.feature.properties;
            console.log('Klickade på ett geojson-objekt med egenskaper:', properties);
            showOrUpdatePopupPanel(properties);
        } else {
            console.error('Ingen geojson-information hittades i klickhändelsen.');
        }
    });
}

// Eventlyssnare för att stänga popup-panelen vid klick utanför
document.addEventListener('click', function(event) {
    if (currentPopupPanel && !currentPopupPanel.contains(event.target)) {
        hidePopupPanel();
    }
});

// Kontrollera att popup-panelen och dess innehåll finns i DOM
if (!document.getElementById('popup-panel') || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}
