// Algjaktskartan_stilar.js

const defaultStyle = {
    color: "blue",
    weight: 2,
    opacity: 1
};

const highlightStyle = {
    color: "yellow",
    weight: 3,
    opacity: 1
};

function getDefaultStyle(feature) {
    return defaultStyle;
}

function applyAlgjaktskartanStyle(feature, layer) {
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

export { getDefaultStyle, highlightStyle, applyAlgjaktskartanStyle };
