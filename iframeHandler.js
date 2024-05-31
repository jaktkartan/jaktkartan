var currentCounty = ""; // Variabel för att hålla reda på det aktuella länet

function showIframeAndHideButtons(url, county) {
    resetIframeState(); // Återställ iframe-informationen

    var iframeContainer = document.getElementById('iframe-container');
    var countyButtons = document.getElementById('county-buttons');
    var backButton = document.getElementById('back-button');
    var mainTitle = document.getElementById('main-title');
    var mainInfo = document.getElementById('main-info');

    currentCounty = county; // Sätt det aktuella länet

    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);
    countyButtons.style.display = 'none'; // Dölj knapparna när iframen visas
    mainTitle.classList.add('hide-on-selection'); // Dölj rubriken när iframen visas
    mainInfo.classList.add('hide-on-selection'); // Dölj informationsdelen när iframen visas
    backButton.classList.remove('hidden'); // Visa tillbaka knappen
    backButton.style.display = 'block'; // Visa tillbaka knappen
    iframeContainer.style.display = 'block'; // Visa iframen

    // Scrolla till flikens topp
    iframeContainer.scrollIntoView({ behavior: 'smooth' });
}

function goBack() {
    var iframeContainer = document.getElementById('iframe-container');
    var countyButtons = document.getElementById('county-buttons');
    var backButton = document.getElementById('back-button');
    var mainTitle = document.getElementById('main-title');
    var mainInfo = document.getElementById('main-info');

    resetPageState(); // Återställ variabler och tillstånd

    iframeContainer.innerHTML = ''; // Ta bort iframen
    countyButtons.style.display = 'block'; // Visa knapparna igen
    mainTitle.classList.remove('hide-on-selection'); // Visa rubriken igen
    mainInfo.classList.remove('hide-on-selection'); // Visa informationsdelen igen
    backButton.style.display = 'none'; // Dölj tillbaka knappen
}

function resetPageState() {
    // Add code here to reset any relevant variables or states
    currentCounty = ""; // Återställ den aktuella länsvariabeln
}

function resetIframeState() {
    // Add code here to reset iframe state if needed
}
