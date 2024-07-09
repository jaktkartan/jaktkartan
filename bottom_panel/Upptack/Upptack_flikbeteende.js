// Funktion för att öppna Upptäck-fliken
function openUpptack() {
    var tab = document.getElementById('tab1');
    tab.innerHTML = '';

    var heading = document.createElement('h2');
    heading.textContent = 'Upptäck';
    tab.appendChild(heading);

    var paragraph = document.createElement('p');
    paragraph.textContent = 'Information om upptäcktsmöjligheter.';
    tab.appendChild(paragraph);

    var button1 = document.createElement('button');
    button1.textContent = 'Se sevärdheter';
    button1.onclick = function() {
        openUpptackTab('bottom_panel/Upptack/Sevardheter.html');
    };
    tab.appendChild(button1);

    var button2 = document.createElement('button');
    button2.textContent = 'Se aktiviteter';
    button2.onclick = function() {
        openUpptackTab('bottom_panel/Upptack/Aktiviteter.html');
    };
    tab.appendChild(button2);
}

// Funktion för att öppna specifikt innehåll i Upptäck-fliken
function openUpptackTab(url) {
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
            console.error('Error fetching Upptäck content:', error);
        });
}
