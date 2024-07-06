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
        border-top: 5px solid #000;
        padding: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
        overflow-y: auto;
        transform: translateY(100%);
        transition: transform 0.5s ease-in-out;
    }

    .show {
        transform: translateY(0);
    }

    .hide {
        transform: translateY(100%);
    }

    #popup-panel img {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
    }
`;

// Lägg till style-taggen till <head>
document.head.appendChild(styleTag);

// JavaScript-logik för popup-panelen
var popupPanel = document.getElementById('popup-panel');
var popupPanelVisible = false;

// Funktion för att kontrollera om en URL är en bild
function isImageUrl(url) {
    return typeof url === 'string' && (url.match(/\.(jpeg|jpg|png|webp|gif)$/i) || (url.includes('github.com') && url.includes('?raw=true')));
}

// Funktion för att visa popup-panelen med specifika egenskaper
function showPopupPanel(properties) {
    updatePopupPanelContent(properties);

    // Lägg till klassen för att visa popup-panelen
    popupPanel.classList.remove('hide');
    popupPanel.classList.add('show');
    popupPanelVisible = true;

    // Återställ scroll-positionen till toppen när panelen visas
    setTimeout(function() {
        var panelContent = document.getElementById('popup-panel-content');
        if (panelContent) {
            panelContent.scrollTop = 0;
            console.log('Scroll position återställd till toppen när panelen visades');
        }
    }, 0); // Kort fördröjning för att säkerställa att animationen är klar
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

    console.log('Uppdaterar med egenskaper:', properties);

    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            if (isImageUrl(value)) {
                content += '<p><img src="' + value + '" alt="Bild"></p>';
                console.log('Bild URL:', value);
            } else {
                content += '<p><strong>' + key + ':</strong> ' + (value ? value : 'Ingen information tillgänglig') + '</p>';
            }
        }
    }

    panelContent.innerHTML = content;

    // Om panelen redan är synlig, återställ scroll-positionen till toppen
    if (popupPanelVisible) {
        setTimeout(function() {
            if (panelContent) {
                panelContent.scrollTop = 0;
                console.log('Scroll position återställd till toppen efter att innehållet uppdaterats');
            }
        }, 0); // Kort fördröjning för att säkerställa att innehållet är uppdaterat
    }
}

// Funktion för att lägga till klickhanterare till document
document.addEventListener('click', function(event) {
    if (popupPanelVisible && !popupPanel.contains(event.target)) {
        hidePopupPanel();
    }
});

// Debugga att panelen finns
if (!popupPanel || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}
