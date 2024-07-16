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

    // Skapa huvudknappen för Älgjaktskartan
    const elkMapButton = document.createElement('button');
    elkMapButton.className = 'styled-button';
    elkMapButton.id = 'elgjaktskartan-main';
    elkMapButton.textContent = 'Älgjaktskartan';

    // Skapa en panel för att visa alternativen
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'options-panel';
    optionsPanel.id = 'elgjaktskartan-options';

    // Alternativ 1: Älgjaktskartan: Jakttider
    const jakttiderButton = document.createElement('button');
    jakttiderButton.textContent = 'Älgjaktskartan: Jakttider';
    jakttiderButton.className = 'styled-button';
    jakttiderButton.onclick = function() {
        Kartor_geojsonHandler.toggleLayer('Älgjaktskartan Jakttider', [
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson'
        ]);
        optionsPanel.classList.remove('show'); // Stäng panelen efter val
    };

    // Alternativ 2: Älgskötselområden
    const skotselomradenButton = document.createElement('button');
    skotselomradenButton.textContent = 'Älgskötselområden';
    skotselomradenButton.className = 'styled-button';
    skotselomradenButton.onclick = function() {
        loadElgSkotselOmraden();
        optionsPanel.classList.remove('show'); // Stäng panelen efter val
    };

    // Lägg till knappar till panelen
    optionsPanel.appendChild(jakttiderButton);
    optionsPanel.appendChild(skotselomradenButton);

    // Lägg till knappar till knapp-container
    buttonContainer.appendChild(elkMapButton);
    buttonContainer.appendChild(optionsPanel);

    // Definiera de befintliga knapparna
    const existingButtons = [
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
            onclick: "Kartor_geojsonHandler.toggleLayer('Älgjaktskartan', ['https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Srskiltjakttidsfnster_3.geojson', 'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Kirunakommunnedanodlingsgrns_4.geojson'])",
            imgSrc: 'bottom_panel/Kartor/bilder/algikon.png',
            imgAlt: 'Älgjaktskartan'
        }
    ];

    // Skapa och lägg till de befintliga knapparna
    existingButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = button.className;
        btn.setAttribute('onclick', button.onclick);

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

    // Visa alternativs-panel när huvudknappen klickas
    elkMapButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Förhindra att klick utanför menyn stänger den
        optionsPanel.classList.toggle('show');
    });

    // Dölj alternativs-panel när man klickar utanför
    document.addEventListener('click', function(event) {
        if (!event.target.matches('#elgjaktskartan-main') && !event.target.closest('.options-panel')) {
            optionsPanel.classList.remove('show');
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

// Dynamiskt lägga till CSS till head
const style = document.createElement('style');
style.textContent = `
    .options-panel {
        display: none; /* Döljer panelen som standard */
        position: absolute; /* Positionera panelen över andra element */
        background-color: white;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        z-index: 1000; /* Se till att panelen är ovanpå andra element */
    }

    .options-panel.show {
        display: block; /* Visa panelen när klassen 'show' är tillagd */
    }

    .styled-button {
        margin: 5px;
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
    }

    .button-container {
        display: flex;
        flex-direction: column; /* Ordna knapparna vertikalt */
        align-items: center;
    }

    .button-container button {
        display: flex;
        align-items: center;
    }
`;
document.head.appendChild(style);
