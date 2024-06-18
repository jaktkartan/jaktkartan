// Allman_jakt_daggdjur_stilar.js

const defaultStyle = {
    fillColor: "orange",
    fillOpacity: 0.4,
    stroke: true,
    color: "brown",
    weight: 1
};

const highlightStyle = {
    fillColor: "red",
    fillOpacity: 0.6,
    stroke: true,
    color: "brown",
    weight: 2
};

function getDefaultStyle(feature) {
    return defaultStyle;
}

function applyAllmanJaktDaggdjurStyle(feature, layer) {
    layer.setStyle(getDefaultStyle(feature));

    layer.on({
        mouseover: function() {
            layer.setStyle(highlightStyle);
        },
        mouseout: function() {
            layer.setStyle(getDefaultStyle(feature));
        }
    });
}

export { getDefaultStyle, applyAllmanJaktDaggdjurStyle };
