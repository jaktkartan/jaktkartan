// Allman_jakt_Fagel_stilar.js

const defaultStyle = {
    fillColor: "green",
    fillOpacity: 0.6,
    stroke: true,
    color: "black",
    weight: 1
};

const highlightStyle = {
    fillColor: "yellow",
    fillOpacity: 0.8,
    stroke: true,
    color: "black",
    weight: 2
};

function getDefaultStyle(feature) {
    return defaultStyle;
}

function applyAllmanJaktFagelStyle(feature, layer) {
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

export { getDefaultStyle, applyAllmanJaktFagelStyle };
