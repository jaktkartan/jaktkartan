// Funktioner för att toggle väderfliken, knapparna i bottenpanelen och särskilt för kaliberkravsfliken som ger användaren två knappar för att välja vilken flik som ska visas.
// Knapparna i tab1 (upptäck) rensar geojson lager från tab2 (kartor) fliken.
document.getElementById('tab1').addEventListener('click', function() {
    if (typeof Kartor_geojsonHandler !== 'undefined') {
        Kartor_geojsonHandler.deactivateAllLayersKartor();
    } else {
        console.error("Kartor_geojsonHandler är inte definierad.");
    }
});

// Knapparna i tab2 (kartor) rensar geojson lager från tab1 (upptäck) fliken.
document.getElementById('tab2').addEventListener('click', function() {
    if (typeof Upptack_geojsonHandler !== 'undefined') {
        Upptack_geojsonHandler.deactivateAllLayers();
    } else {
        console.error("Upptack_geojsonHandler är inte definierad.");
    }
});

// Funktion för att återställa flikarna till sitt ursprungliga tillstånd
function resetTabs() {
    var tabs = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
        tabs[i].innerHTML = '';
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs();
    var tab = document.getElementById(tabId);
    tab.style.display = 'block';
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block';

    if (tabId === 'tab1') {
        openUpptack(); // Implementeras i bottom_panel/Upptack/Upptack_flikbeteende.js
    } else if (tabId === 'tab3') {
        tab.innerHTML = '';

        var heading = document.createElement('h2');
        heading.textContent = 'Jaktbart idag';
        tab.appendChild(heading);

        var paragraph = document.createElement('p');
        paragraph.textContent = 'Senaste lagrade position:';
        tab.appendChild(paragraph);

        displaySavedUserPosition(); // Anropar direkt för att visa rull-listan

    } else if (tabId === 'tab4') {
        tab.innerHTML = '';

        var heading = document.createElement('h2');
        heading.textContent = 'Kaliberkrav';
        tab.appendChild(heading);

        var paragraph = document.createElement('p');
        paragraph.textContent = 'Kaliberkrav och lämplig hagelstorlek vid jakt';
        tab.appendChild(paragraph);

        var button1 = document.createElement('button');
        button1.textContent = 'Kaliberkrav: Däggdjur';
        button1.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
        };
        tab.appendChild(button1);

        var button2 = document.createElement('button');
        button2.textContent = 'Kaliberkrav: Fågel';
        button2.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
        };
        tab.appendChild(button2);

    } else {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                tab.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching tab content:', error);
            });
    }
}

// Funktion för att öppna Kaliberkrav-fliken
function openKaliberkravTab(url) {
    var tabContent = document.getElementById('tab-content');
    var tab = document.createElement('div');
    tab.className = 'tab-pane';
    tabContent.appendChild(tab);

    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML += html;
            tab.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching Kaliberkrav content:', error);
        });
}

// Lyssnare för klick utanför flikar och panelknappar
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs();
    }
});

// Funktion för att stänga flikinnehåll
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Lyssnare för när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
