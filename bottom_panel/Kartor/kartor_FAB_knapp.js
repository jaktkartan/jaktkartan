// kartor_FAB_knapp.js

// Funktion för att skapa FAB-knappar och tooltips för geojson-lager
function createFabButtons(layers) {
    var fabContainer = document.createElement('div');
    fabContainer.classList.add('fab-container');

    layers.forEach(function(layer) {
        var fabButton = document.createElement('button');
        fabButton.classList.add('fab');
        fabButton.textContent = '+';
        fabButton.onclick = function() {
            toggleLayer(layer.name, layer.urls);
        };
        fabButton.title = layer.tooltip;

        fabContainer.appendChild(fabButton);
    });

    document.body.appendChild(fabContainer);
}

// Funktion för att visa tooltip för ett specifikt lager
function showTooltip(layerName) {
    var tooltip = document.getElementById('tooltip-' + layerName);
    if (tooltip) {
        tooltip.style.display = 'block';

        // Stäng tooltip när man klickar utanför den
        window.onclick = function(event) {
            if (!event.target.matches('.fab')) {
                tooltip.style.display = 'none';
            }
        };
    }
}

// Funktion för att skapa tooltip-element
function createTooltip(layerName, tooltipText, imageUrl) {
    var tooltip = document.createElement('div');
    tooltip.id = 'tooltip-' + layerName;
    tooltip.classList.add('tooltip');

    var tooltipContent = document.createElement('div');
    tooltipContent.classList.add('tooltip-content');

    var text = document.createElement('p');
    text.textContent = tooltipText;

    var image = document.createElement('img');
    image.src = imageUrl; // Sätt bildens källa

    tooltipContent.appendChild(text);
    tooltipContent.appendChild(image);
    tooltip.appendChild(tooltipContent);
    document.body.appendChild(tooltip);
}

