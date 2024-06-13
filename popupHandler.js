// Dynamiskt lägga till popup-stilar till dokumentet
var style = document.createElement('style');
style.innerHTML = `
    .leaflet-popup-content-wrapper {
        padding: 10px;
        max-width: 90vw;
        max-height: 70vh;
        overflow-y: auto;
    }

    .leaflet-popup-content img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }

    .leaflet-popup-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        max-height: 50%;
        overflow-y: auto;
        background: white;
        border: 1px solid #ccc;
        z-index: 1000;
    }

    .leaflet-popup-bottom .leaflet-popup-content-wrapper {
        max-width: 100%;
        max-height: 100%;
    }
`;
document.head.appendChild(style);

// Funktion för att skapa popup-fönster med anpassad position och storlek
function createPopup(content) {
    var popupOptions = {
        closeButton: true,
        className: 'leaflet-popup-bottom'
    };

    var imagePattern = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp)(\?[^\s]*)?)/gi;
    content = content.replace(imagePattern, function(url) {
        return `<img src="${url}" alt="Image">`;
    });

    var popup = L.popup(popupOptions).setContent(content);
    return popup;
}

// Funktion för att öppna popup längst ned på sidan
function openPopupAtBottom(popup) {
    var mapBounds = map.getBounds();
    var southWest = mapBounds.getSouthWest();
    var southEast = mapBounds.getSouthEast();
    var center = mapBounds.getCenter();
    var latLng = L.latLng(southWest.lat, center.lng);

    popup.setLatLng(latLng).openOn(map);
    return popup;
}

// Funktion för att binda popup till geojson-lagret med klickhändelse
function bindPopupToLayer(layer, popupContent) {
    layer.on('click', function() {
        var popup = createPopup(popupContent);
        openPopupAtBottom(popup);
    });
}
