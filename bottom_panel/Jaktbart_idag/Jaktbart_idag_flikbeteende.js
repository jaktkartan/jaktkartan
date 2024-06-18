// Jaktbart_idag_flikbeteende.js

function openTab(tabId, url) {
    var i, tabcontent, tablinks;
    
    // Dölj alla flikar
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Visa den valda fliken
    document.getElementById(tabId).style.display = "block";

    // Ladda innehållet i iframen om det är tab3
    if (tabId === 'tab3') {
        document.getElementById(tabId).innerHTML = '<iframe src="' + url + '" style="width: 100%; height: 100vh;"></iframe>';
    }
}
