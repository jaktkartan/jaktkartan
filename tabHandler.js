// Funktioner för att toggla flikarna och hantera knapparna
document.getElementById('tab1').addEventListener('click', function() {
    if (typeof Kartor_geojsonHandler !== 'undefined') {
        Kartor_geojsonHandler.deactivateAllLayersKartor();
    } else {
        console.error("Kartor_geojsonHandler är inte definierad.");
    }
    openTab('tab1');
});

document.getElementById('tab2').addEventListener('click', function() {
    if (typeof Upptack_geojsonHandler !== 'undefined') {
        Upptack_geojsonHandler.deactivateAllLayers();
    } else {
        console.error("Upptack_geojsonHandler är inte definierad.");
    }
    openTab('tab2');
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
    } else if (tabId === 'tab2') {
        openKartor(); // Implementeras i bottom_panel/Kartor/kartor_flikbeteende.js
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
        var img1 = document.createElement('img');
        img1.src = 'bottom_panel/Kartor/bilder/daggdjurikon.png';
        img1.alt = 'Kaliberkrav: Däggdjur';
        img1.style.width = '90px';  // Justera storlek efter behov
        img1.style.height = '90px'; // Justera storlek efter behov
        button1.appendChild(img1);
        button1.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
        };
        tab.appendChild(button1);

        var button2 = document.createElement('button');
        var img2 = document.createElement('img');
        img2.src = 'bottom_panel/Kartor/bilder/fagelikon.png';
        img2.alt = 'Kaliberkrav: Fågel';
        img2.style.width = '90px';  // Justera storlek efter behov
        img2.style.height = '90px'; // Justera storlek efter behov
        button2.appendChild(img2);
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

// Lyssnare för klick utanför flikar
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');

    // Kontrollera om klicket är utanför tab-content
    if (!tabContent.contains(event.target)) {
        resetTabs();
    }
});

// Förhindra stängning när klick inom flikarna
document.getElementById('tab-content').addEventListener('click', function(event) {
    event.stopPropagation();
});

// Lyssnare för när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
