// Lägg till stilar dynamiskt
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slideOut {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
}

.tab-pane {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-height: 40%;
    background-color: #fff;
    border-top: 5px solid #fff;
    border-left: 5px solid #fff;
    border-right: 5px solid #fff;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    z-index: 1000;
    overflow-y: auto;
    word-wrap: break-word;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-family: 'Roboto', sans-serif;
    color: rgb(50, 94, 88);
    transform: translateY(100%);
    transition: transform 0.5s ease-in-out;
}

.tab-pane.show {
    animation: slideIn 0.5s forwards;
}

.tab-pane.hide {
    animation: slideOut 0.5s forwards;
}

/* Media query för att göra tabbarna smalare på större skärmar */
@media (min-width: 768px) {
    .tab-pane {
        width: 70%;
    }
}

@media (min-width: 1200px) {
    .tab-pane {
        width: 40%;
    }
}

/* Specifika stilar för #tab1 och #tab2 */
#tab1.tab-pane, #tab2.tab-pane {
    height: 15vh; /* Specifik höjd för tab1 och tab2 */
    display: flex; /* Lägg till flexbox layout här också */
    flex-direction: column; /* Säkerställ att barnen ordnas i kolumner */
    padding: 0px;
    justify-content: flex-end; /* Placera innehållet längst ner */
}

.tab1-2-header-title {
    position: absolute;
    top: 10px;
    left: 10px;
    margin: 0;
    padding: 0;
    font-size: 24px;
    color: rgb(50, 94, 88);
}

#tab1 .button-container, #tab2 .button-container {
    margin-top: 5vh; /* Glipa mellan knapparnas överkant och flikens överkant */
}

/* Skrollbara flikar */
#tab3.tab-pane, #tab5.tab-pane {
    height: 50vh; /* Specifik höjd för tab3 och tab5 */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Kolumnlayout */
    padding: 0px;
    justify-content: flex-start; /* Placera innehållet längst upp */
    overflow-y: auto; /* Gör fliken skrollbar */
}
`;
document.head.appendChild(style);

// Knappen tab1 (upptäck) rensar geojson-lager och WMS från tab2 (kartor) fliken.
document.getElementById('tab1').addEventListener('click', function() {
    if (typeof Kartor_geojsonHandler !== 'undefined') {
        Kartor_geojsonHandler.deactivateAllLayersKartor();
    } else {
        console.error("Kartor_geojsonHandler är inte definierad.");
    }
});

// Knappen tab2 (kartor) rensar geojson-lager från tab1 (upptäck) fliken.
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
        tabs[i].classList.remove('show');
        tabs[i].classList.add('hide');
    }
    setTimeout(function() {
        var tabs = document.getElementsByClassName('tab-pane');
        for (var i = 0; i < tabs.length; i++) {
            clearTabPaneContent(tabs[i]);
            tabs[i].style.display = 'none';
        }
        var tabContent = document.getElementById('tab-content');
        tabContent.style.display = 'none';
    }, 500); // Vänta tills animationen är klar
}

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs();
    var tab = document.getElementById(tabId);
    setTimeout(function() {
        var tabContent = document.getElementById('tab-content');
        tabContent.style.display = 'block';
        tab.style.display = 'block';
        tab.classList.remove('hide');
        tab.classList.add('show');

        if (tabId === 'tab1') {
            openUpptack();
        } else if (tabId === 'tab2') {
            openKartor();
        } else if (tabId === 'tab3') {
            openJaktbartIdag();
        } else if (tabId === 'tab4') {
            populateTab4();
        } else if (tabId === 'tab5') {
            fetchTab5Content(url);
        }
    }, 500); // Vänta tills resetTabs är klar
}

function clearTabPaneContent(tabPane) {
    while (tabPane.firstChild) {
        tabPane.removeChild(tabPane.firstChild);
    }
}

// Funktion för att öppna "Kaliberkrav" fliken
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
            tab.classList.add('show');
        })
        .catch(error => {
            console.error('Error fetching Kaliberkrav content:', error);
        });
}

// Andra flikfunktioner
function openUpptack() {
    // Innehåll för fliken "Upptäck"
}

function openKartor() {
    // Innehåll för fliken "Kartor"
}

function openJaktbartIdag() {
    // Innehåll för fliken "Kartor"
}


function populateTab4() {
    var tab = document.getElementById('tab4');
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
    img1.style.width = '90px';
    img1.style.height = '90px';
    button1.appendChild(img1);
    button1.onclick = function() {
        openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
    };
    tab.appendChild(button1);

    var button2 = document.createElement('button');
    var img2 = document.createElement('img');
    img2.src = 'bottom_panel/Kartor/bilder/fagelikon.png';
    img2.alt = 'Kaliberkrav: Fågel';
    img2.style.width = '90px';
    img2.style.height = '90px';
    button2.appendChild(img2);
    button2.onclick = function() {
        openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
    };
    tab.appendChild(button2);
}

function fetchTab5Content(url) {
    var tab = document.getElementById('tab5');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching tab content:', error);
        });
}

document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs();
    }
});

function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
