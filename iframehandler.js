// iframehandler.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Iframe handler loaded.");

    // Funktion för att visa iframen och dölja knapparna
    function toggleIframeAndButtons(url) {
        console.log("Toggling iframe and buttons...");
        var iframeContainer = document.getElementById('iframe-container');
        var mainTitle = document.getElementById('main-title');
        var mainInfo = document.getElementById('main-info');

        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframeContainer.innerHTML = '';
        iframeContainer.appendChild(iframe);
        console.log("Iframe appended to the container.");

        mainTitle.classList.add('hide-on-selection');
        mainInfo.classList.add('hide-on-selection');
        iframeContainer.style.display = 'block';
        console.log("Main title, info, and iframe container displayed.");
    }

    // Lägg till event listener för knapparna
    document.getElementById('daggdjur-button').addEventListener('click', function() {
        console.log("Däggdjur-knappen klickad.");
        toggleIframeAndButtons('https://docs.google.com/spreadsheets/d/e/2PACX-1vR4pJwYlzyMMYLdNe6UDJS_S2GJL0DT5HPUU_UtcUYTQftI7QsJAG-SpO9ghYgXQF-fzlfjbsWcckbH/pubhtml?gid=786892384&single=true&widget=false&headers=false&chrome=false');
    });

    document.getElementById('fagel-button').addEventListener('click', function() {
        console.log("Fågel-knappen klickad.");
        toggleIframeAndButtons('https://docs.google.com/spreadsheets/d/e/2PACX-1vTIS-T0921En1psJG2-AKeDT_HP_4KmK1VTjGUBBqBvfmjawSqXEfq5yns-RO9P4mtw5obll9WNeEfw/pubhtml?gid=0&single=true&widget=false&headers=false&chrome=false');
    });
});
