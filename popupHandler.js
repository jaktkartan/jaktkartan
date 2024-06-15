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

document.addEventListener('DOMContentLoaded', function() {
    var popupPanel = null; // Global variabel för popup-panelen

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
            popupPanel.style.display = 'none';
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

    // Exempel: Anropa addClickHandlerToLayer med ditt lager
    var geojsonLayer = L.geoJSON(...); // Ersätt ... med ditt geojson-lager
    addClickHandlerToLayer(geojsonLayer);

    // Eventlyssnare för att dölja popup-panelen när användaren klickar utanför den
    document.addEventListener('click', function(event) {
        if (popupPanel && !popupPanel.contains(event.target)) {
            hidePopupPanel();
        }
    });
});
