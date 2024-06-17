var AlgjaktskartanStilar = {
    defaultStyle: {
        // Standardstilar för ditt lager
        fillColor: "#ff7800",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
    },

    highlightStyle: {
        // Stilar när ett objekt är markerat eller hoverad
        fillColor: "#00ff00",
        color: "#00ff00",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.7
    },

    // Funktion för att tillämpa stilar på geojson-lager
    applyStyle: function(feature, layer) {
        layer.setStyle(AlgjaktskartanStilar.defaultStyle);

        // Lägg till händelser för hover-effekter eller andra interaktioner om det behövs
        layer.on({
            mouseover: function() {
                layer.setStyle(AlgjaktskartanStilar.highlightStyle);
            },
            mouseout: function() {
                layer.setStyle(AlgjaktskartanStilar.defaultStyle);
            }
        });
    }
};

