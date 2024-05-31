var currentkaliber = ""; // Variabel för att hålla reda på aktuell kaliber

function showIframeAndHideButtons(url, kaliber) {
    var iframeContainer = document.getElementById('iframe-container');
    var kaliberButtons = document.getElementById('kaliber-buttons');
    var backButton = document.getElementById('back-button');
    var mainTitle = document.getElementById('main-title');
    var mainInfo = document.getElementById('main-info');

    currentCounty = kaliber; // Sätt den aktuella kaliber

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
    var kaliberButtons = document.getElementById('kaliber-buttons');
    var backButton = document.getElementById('back-button');
    var mainTitle = document.getElementById('main-title');
    var mainInfo = document.getElementById('main-info');

    currentkaliber = ""; // Nollställ den aktuella kaliber

    iframeContainer.innerHTML = ''; // Ta bort iframen
    kaliberButtons.style.display = 'block'; // Visa knapparna igen
    mainTitle.classList.remove('hide-on-selection'); // Visa rubriken igen
    mainInfo.classList.remove('hide-on-selection'); // Visa informationsdelen igen
    backButton.style.display = 'none'; // Dölj tillbaka knappen
}
