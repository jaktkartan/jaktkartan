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
function showPopupPanel(properties) {
    updatePopupPanelContent(properties); // Uppdatera panelens innehåll
    popupPanel.style.display = 'block'; // Visa panelen
    setTimeout(function() {
        popupPanel.style.transform = 'translateY(0%)'; // Flytta panelen uppåt
    }, 10); // Vänta 10 millisekunder innan att tillämpa transform
    popupPanelVisible = true; // Uppdatera flaggan när panelen visas

    // Lägg till eventlyssnare för att stänga panelen när man klickar utanför den
    document.addEventListener('click', clickOutsideHandler);
}

// Funktion för att dölja popup-panelen
function hidePopupPanel() {
    popupPanel.style.transform = 'translateY(100%)'; // Flytta panelen nedåt
    setTimeout(function() {
        popupPanel.style.display = 'none'; // Dölj panelen efter animationen
    }, 300); // Vänta 0.3 sekunder för att slutföra animationen
    popupPanelVisible = false; // Uppdatera flaggan när panelen göms

    // Ta bort eventlyssnare för att stänga panelen när man klickar utanför den
    document.removeEventListener('click', clickOutsideHandler);
}

// Eventlyssnare för att stänga popup-panelen när man klickar utanför den
function clickOutsideHandler(event) {
    // Kontrollera om klicket var utanför popup-panelen
    if (!popupPanel.contains(event.target)) {
        hidePopupPanel(); // Dölj panelen om klicket var utanför
    }
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
}

// Funktion för att lägga till klickhanterare till geojson-lagret
function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        if (e.target && e.target.feature && e.target.feature.properties) {
            var properties = e.target.feature.properties;
            showPopupPanel(properties); // Visa panelen med aktuella egenskaper
        } else {
            console.error('Ingen geojson-information hittades i klickhändelsen.');
        }
    });
}
