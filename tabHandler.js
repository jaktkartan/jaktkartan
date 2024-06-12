// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs(); // Återställ flikarna innan en ny öppnas
    var tab = document.getElementById(tabId);
    tab.style.display = 'block'; // Visa den valda fliken
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block'; // Visa flikinnehållet

    if (tabId === 'tab4') {
        // Om det är tab4 (Kaliberkrav), visa knapparna för alternativen
        var tabContent = document.getElementById('tab-content');
        tabContent.innerHTML = ''; // Rensa flikinnehållet

        var button1 = document.createElement('button');
        button1.textContent = 'Kaliberkrav: Däggdjur';
        button1.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
        };
        tabContent.appendChild(button1);

        var button2 = document.createElement('button');
        button2.textContent = 'Kaliberkrav: Fågel';
        button2.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
        };
        tabContent.appendChild(button2);
    } else {
        // Om det inte är tab4 (Kaliberkrav), hämta innehållet från den angivna URL:en
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    tab.innerHTML = xhr.responseText;
                } else {
                    console.error('Error fetching tab content:', xhr.status);
                }
            }
        };
        xhr.open('GET', url);
        xhr.send();
    }
}

// Funktion för att öppna en flik med Kaliberkrav
function openKaliberkravTab(url) {
    var tab = document.getElementById('tab4_content');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                tab.innerHTML = xhr.responseText;
            } else {
                console.error('Error fetching Kaliberkrav tab content:', xhr.status);
            }
        }
    };
    xhr.open('GET', url);
    xhr.send();
}
