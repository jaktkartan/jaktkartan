function loadElgjaktsomradenWMS() {
    // Funktion för att generera en slumpmässig färg i en naturlig nyans
    function getRandomColor() {
        var hue = Math.floor(Math.random() * 360); // Färgton
        var lightness = Math.floor(Math.random() * 40) + 40; // Ljushet från 40 till 80
        return `hsl(${hue}, 70%, ${lightness}%)`;
    }

    // Färgcache för att bevara färger för varje feature
    var colorCache = {};

    // Caching inställningar
    var cache = {};

    function getTileUrl(tilePoint) {
        var key = tilePoint.z + '/' + tilePoint.x + '/' + tilePoint.y;
        if (cache[key]) {
            return cache[key];
        }
        var url = L.Util.template('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WmsServer', tilePoint);
        cache[key] = url;
        return url;
    }

    // Skapa WMS-lagret
    var wmsLayer = L.tileLayer.wms('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WmsServer', {
        layers: '0',
        format: 'image/png',
        transparent: true,
        attribution: 'Lantmäteriet',
        tileSize: 512,
        detectRetina: true
    });

    // Lägg till WMS-lagret till kartan
    window.map.addLayer(wmsLayer);

    // Funktion som döljer eller visar lagret baserat på zoomnivå
    function updateLayerVisibility() {
        var zoomLevel = window.map.getZoom();
        if (zoomLevel >= 13) { // Visa lagret vid zoomnivå 13 eller högre
            if (!window.map.hasLayer(wmsLayer)) {
                window.map.addLayer(wmsLayer);
            }
        } else {
            if (window.map.hasLayer(wmsLayer)) {
                window.map.removeLayer(wmsLayer);
            }
        }
    }

    // Lägg till en "zoomend" lyssnare för att uppdatera lagrets synlighet när användaren zoomar
    window.map.on('zoomend', updateLayerVisibility);

    // Initial kontroll för att ställa in lagrets synlighet när kartan först laddas
    updateLayerVisibility();
}
