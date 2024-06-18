// Jaktbart_idag_flikbeteende.js

function openTab(tabId, url) {
    var i, tabcontent;
    
    // Dölj alla flikar
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Visa den valda fliken
    var tab = document.getElementById(tabId);
    tab.style.display = "block";

    // Ladda innehållet i iframen om det är tab3 och om den inte redan är laddad
    if (tabId === 'tab3' && tab.innerHTML.trim() === '') {
        tab.innerHTML = '<iframe src="' + url + '" style="width: 100%; height: 100vh;"></iframe>';
    }
}
