
// Allman_jakt_Fagel_stilar.js

// Standardstil för Allmän jakt: Fågel
const defaultStyle = {
    color: "green",
    weight: 2,
    opacity: 1
};

// Highlight-stil för Allmän jakt: Fågel (vid hover)
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

// Exportera stilfunktionerna
export { getDefaultStyle, applyAllmanJaktFagelStyle };
