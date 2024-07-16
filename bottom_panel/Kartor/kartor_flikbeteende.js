function openKartor() {
    // Hitta tab-pane för kartor
    const tabPane = document.getElementById('tab2');
    if (!tabPane) {
        console.error('Tab pane for kartor not found.');
        return;
    }

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden'; // Förhindra scrollning

    // Skapa knapp-container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Definiera knapparna med deras respektive egenskaper
    const buttons = [
        {
            className: 'styled-button',
            onclick: "Kartor_geojsonHandler.toggleLayer('Allmän jakt: Däggdjur', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'])",
            imgSrc: 'bottom_panel/Kartor/bilder/daggdjurikon.png',
            imgAlt: 'Allmän jakt: Däggdjur'
        },
        {
            className: 'styled-button',
            onclick: "Kartor_geojsonHandler.toggleLayer('Allmän jakt: Fågel', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson'])",
            imgSrc: 'bottom_panel/Kartor/bilder/fagelikon.png',
            imgAlt: 'Allmän jakt: Fågel'
        },
        {
            className: 'styled-button',
            id: 'elgjaktskartan-button', // Ändra id för att referera till knappen
            imgSrc: 'bottom_panel/Kartor/bilder/algikon.png',
            imgAlt: 'Älgjaktskartan'
        }
    ];

    // Skapa knappar och lägg till dem i knapp-container
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = button.className;
        btn.setAttribute('onclick', button.onclick || '');
        btn.id = button.id || '';

        const img = document.createElement('img');
        img.src = button.imgSrc;
        img.alt = button.imgAlt;

        btn.appendChild(img);
        buttonContainer.appendChild(btn);
    });

    // Lägg till knapp-container till tab-pane
    tabPane.appendChild(buttonContainer);

    // Lägg till tab-pane till container
    container.appendChild(tabPane);

    // Lägg till container till body
    document.body.appendChild(container);

    // Skapa en meny för Älgjaktskartan-knappen
    const elkMapButton = document.getElementById('elgjaktskartan-button');
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'options-panel';
    optionsPanel.style.position = 'absolute';
    optionsPanel.style.display = 'none'; // Dölja panelen initialt
    optionsPanel.style.backgroundColor = 'white';
    optionsPanel.style.border = '1px solid #ccc';
    optionsPanel.style.padding = '10px';
    optionsPanel.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    optionsPanel.style.zIndex = '1000';

    // Alternativ 1: Älgjaktskartan: Jakttider
    const jakttiderButton = document.createElement('button');
    jakttiderButton.textContent = 'Älgjaktskartan: Jakttider';
    jakttiderButton.className = 'styled-button';
    jakttiderButton.onclick = function() {
        Kartor_geojsonHandler.toggleLayer('Älgjaktskartan Jakttider', [
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson'
        ]);
        optionsPanel.style.display = 'none'; // Stäng panelen efter val
    };

    // Alternativ 2: Älgskötselområden
    const skotselomradenButton = document.createElement('button');
    skotselomradenButton.textContent = 'Älgskötselområden';
    skotselomradenButton.className = 'styled-button';
    skotselomradenButton.onclick = function() {
        loadElgSkotselOmraden();
        optionsPanel.style.display = 'none'; // Stäng panelen efter val
    };

    // Lägg till knappar till panelen
    optionsPanel.appendChild(jakttiderButton);
    optionsPanel.appendChild(skotselomradenButton);

    // Lägg till panelen till body
    document.body.appendChild(optionsPanel);

    // Hantera klick på huvudknappen
    elkMapButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Förhindra att klick utanför menyn stänger den
        const rect = elkMapButton.getBoundingClientRect();
        optionsPanel.style.left = `${rect.left}px`;
        optionsPanel.style.top = `${rect.bottom}px`;
        optionsPanel.style.display = optionsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Dölj alternativs-panel när man klickar utanför
    document.addEventListener('click', function(event) {
        if (!event.target.matches('#elgjaktskartan-button') && !event.target.closest('.options-panel')) {
            optionsPanel.style.display = 'none';
        }
    });

    // Debugging
    console.log('Kartor tab created and added to body');
}

// Funktion för att ladda Älgskötselområden
function loadElgSkotselOmraden() {
    // Här kan du lägga din kod för att visa Älgskötselområden
    console.log('Visar Älgskötselområden');
}
