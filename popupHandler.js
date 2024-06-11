// popupHandler.js

function centerPopup(e) {
    var map = e.target._map; // Hämta kartan från det objekt som öppnade popupen
    var px = map.project(e.popup._latlng); // Hitta popupens position
    px.y -= map.getSize().y / 2; // Justera för att centrera popup
    map.panTo(map.unproject(px), { animate: true }); // Panorera kartan
}

// Lägg till händelselyssnare på alla geoobjekt
function addPopupHandler(geoObject) {
    geoObject.on('popupopen', centerPopup);
}

// Exempel på hur man lägger till olika geoobjekt med popup och händelselyssnare
function addGeoObjectWithPopup(geoObject, popupContent) {
    geoObject.bindPopup(popupContent);
    addPopupHandler(geoObject);
}

