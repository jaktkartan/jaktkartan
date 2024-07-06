// JavaScript-logik för popup-panelen
var popupPanel = document.getElementById('popup-panel');
var popupPanelVisible = false;

// Funktion för att visa popup-panelen med specifika egenskaper
function showPopupPanel(properties) {
    updatePopupPanelContent(properties);

    // Lägg till klassen för att visa popup-panelen
    popupPanel.classList.remove('hide');
    popupPanel.classList.add('show');
    popupPanelVisible = true;

    // Återställ scroll-positionen till toppen när panelen visas
    requestAnimationFrame(function() {
        setTimeout(function() {
            var panelContent = document.getElementById('popup-panel-content');
            if (panelContent) {
                panelContent.scrollTop = 0;
                console.log('Scroll position återställd till toppen när panelen visades');
            }
        }, 500); // Vänta lite längre för att säkerställa att animationen är klar
    });
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

    var hideProperties = ['id', 'shape_leng', 'objectid_2', 'objectid', 'shape_area', 'shape_le_2', 'field'];
    var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];
    var content = '';

    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];

            // Om egenskapen ska döljas, hoppa över den
            if (hideProperties.includes(key) || (hideNameOnlyProperties.includes(key) && !value)) {
                continue;
            }

            // Om värdet är en URL och pekar på en bild
            if (isImageUrl(value)) {
                content += '<p><img src="' + value + '" alt="Bild"></p>';
                console.log('Bild URL:', value); // Debug-utskrift av bild-URL
            } else {
                content += '<p><strong>' + key + ':</strong> ' + (value ? value : 'Ingen information tillgänglig') + '</p>';
            }
        }
    }

    // Uppdatera panelens innehåll
    panelContent.innerHTML = content;

    // Om panelen redan är synlig, återställ scroll-positionen till toppen
    if (popupPanelVisible) {
        requestAnimationFrame(function() {
            setTimeout(function() {
                if (panelContent) {
                    panelContent.scrollTop = 0;
                    console.log('Scroll position återställd till toppen efter att innehållet uppdaterats');
                }
            }, 0); // Kort fördröjning för att säkerställa att innehållet är uppdaterat
        });
    }
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

