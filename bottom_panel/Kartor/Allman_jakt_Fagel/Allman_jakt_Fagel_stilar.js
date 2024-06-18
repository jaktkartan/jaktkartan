// Allman_jakt_Fagel_stilar.js

const defaultStyle = {
    fillColor: "orange",
    fillOpacity: 0.6,
    color: "black",
    weight: 1,
    opacity: 1
};

const highlightStyle = {
    fillColor: "yellow",
    fillOpacity: 0.8,
    color: "black",
    weight: 2,
    opacity: 1
};

function getDefaultStyle(feature) {
    return defaultStyle;
}

function applyFagelStyle(feature, layer) {
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

export { getDefaultStyle, applyFagelStyle };
