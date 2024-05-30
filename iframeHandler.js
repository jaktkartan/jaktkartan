var currentCounty = ""; // Variabel för att hålla reda på det aktuella länet

function showIframeAndHideButtons(url, county) {
    var iframeContainer = document.getElementById('iframe-container');
    var countyButtons = document.getElementById('county-buttons');
    var backButton = document.getElementById('back-button');

    currentCounty = county; // Sätt det aktuella länet

    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);
    countyButtons.style.display = 'none'; // Dölj knapparna när iframen visas
    iframeContainer.style.display = 'block';
    backButton.classList.remove('hidden'); // Visa tillbaka knappen
}

function goBack() {
    var iframeContainer = document.getElementById('iframe-container');
    var countyButtons = document.getElementById('county-buttons');
    var backButton = document.getElementById('back-button');

    currentCounty = ""; // Nollställ det aktuella länet

    iframeContainer.innerHTML = ''; // Ta bort iframen
    countyButtons.style.display = 'block'; // Visa knapparna igen
    backButton.classList.add('hidden'); // Dölj tillbaka knappen
}
