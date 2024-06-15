// Variabel för att hålla referensen till popup-panelen globalt
var popupPanel = null;

// Stilar för popup-panelen (om du inte redan har dessa i CSS)
function setupPopupPanelStyles() {
    if (popupPanel) {
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
        popupPanel.style.display = 'none'; // Göm panelen som standard
    }
}

// Funktion för att visa eller skapa popup-panelen med specifika egenskaper
function showPopupPanel(properties) {
    if (!popupPanel) {
        createPopupPanel(properties);
    } else {
        updatePopupPanelContent(properties);
        popupPanel.style.display = 'block';
    }
}

// Funktion för att skapa popup-panelen med givna egenskaper
function createPopupPanel(properties) {
    popupPanel = document.createElement('div');
    popupPanel.id = 'popup-panel';
    popupPanel.className = 'popup-panel';
    setupPopupPanelStyles(); // Applicera stilar

    var content = '<div id="popup-panel-content">';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }
    content += '</div>';

    popupPanel.innerHTML = content;

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Stäng';
    closeButton.addEventListener('click', function() {
        hidePopupPanel();
    });
    popupPanel.appendChild(closeButton);

    document.body.appendChild(popupPanel);
}

// Funktion för att uppdatera innehållet i popup-panelen med nya egenskaper
function updatePopupPanelContent(properties) {
    var panelContent = popupPanel.querySelector('#popup-panel-content');
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

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    if (popupPanel) {
        popupPanel.style.transform = 'translateY(100%)'; // Animera nedåt
    }
}

// Eventlyssnare för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        if (e.target && e.target.feature && e.target.feature.properties) {
            var properties = e.target.feature.properties;
            console.log('Klickade på ett geojson-objekt med egenskaper:', properties);
            showPopupPanel(properties);
        } else {
            console.error('Ingen geojson-information hittades i klickhändelsen.');
        }
    });
}

// Exempel: Anropa addClickHandlerToLayer med ditt geojson-lager
var geojsonLayer = L.geoJSON(...); // Ersätt ... med ditt geojson-lager
addClickHandlerToLayer(geojsonLayer);

// Eventlyssnare för att dölja popup-panelen när användaren klickar utanför den
document.addEventListener('click', function(event) {
    if (popupPanel && !popupPanel.contains(event.target)) {
        hidePopupPanel();
    }
});
