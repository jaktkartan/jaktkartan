// Algjaktskartan_stilar.js

// Standardstil för Algjaktskartan
const defaultStyle = {
    color: "blue",
    weight: 2,
    opacity: 1
};

// Highlight-stil för Algjaktskartan (vid hover)
const highlightStyle = {
    color: "yellow",
    weight: 3,
    opacity: 1
};

// Funktion som returnerar standardstilen
function getDefaultStyle(feature) {
    return defaultStyle;
}

// Funktion för att tillämpa stilar och hantera interaktioner
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

// Exportera stilfunktionerna
export { getDefaultStyle, applyAlgjaktskartanStyle };
