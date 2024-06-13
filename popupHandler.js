// popupHandler.js

function updatePanelContent(properties) {
    var panelContent = document.getElementById('panel-content');
    if (!panelContent) {
        console.error("Elementet 'panel-content' hittades inte.");
        return;
    }

    var content = '';
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            content += '<p><strong>' + key + ':</strong> ' + value + '</p>';
        }
    }

    panelContent.innerHTML = content;
    document.getElementById('panel').style.display = 'block'; // Visa panelen
}

function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        var properties = e.target.feature.properties;
        updatePanelContent(properties);
    });
}

function hidePanel() {
    var panel = document.getElementById('panel');
    if (panel) {
        panel.style.display = 'none';
    }
}
