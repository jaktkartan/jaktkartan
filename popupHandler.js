// popupHandler.js

function centerPopup(e) {
    var map = e.target._map; // Hämta kartan från det objekt som öppnade popupen
    
    if (e.popup && e.popup._latlng) {
        var px = map.project(e.popup._latlng); // Hitta popupens position
        px.y -= map.getSize().y / 2; // Justera för att centrera popup
        map.panTo(map.unproject(px), { animate: true }); // Panorera kartan
    }
}


function addGlobalPopupHandler(map) {
    map.on('popupopen', centerPopup);
}
