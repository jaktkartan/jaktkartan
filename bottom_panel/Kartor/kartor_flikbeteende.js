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
    buttonContainer.style.display = 'flex';

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
            id: 'elgjaktskartan-button',
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

    // Hantera klick på huvudknappen
    elkMapButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Förhindra att klick utanför menyn stänger den
        showElkMapOptions();
    });

    // Funktion för att visa alternativ för Älgjaktskartan
    function showElkMapOptions() {
        buttonContainer.innerHTML = ''; // Rensa knappcontainern

        const elkJakttiderButton = document.createElement('button');
        elkJakttiderButton.className = 'styled-button';
        elkJakttiderButton.onclick = function() {
            Kartor_geojsonHandler.toggleLayer('Älgjaktskartan', [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson'
            ]);
            restoreOriginalButtons();
        };

        const elkSkotselomradenButton = document.createElement('button');
        elkSkotselomradenButton.className = 'styled-button';
        elkSkotselomradenButton.onclick = function() {
            Kartor_geojsonHandler.toggleLayer('Älgskötselområden', [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Srskiltjakttidsfnster_3.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Kirunakommunnedanodlingsgrns_4.geojson'
            ]);
            restoreOriginalButtons();
        };

        const jakttiderImg = document.createElement('img');
        jakttiderImg.src = 'bottom_panel/Kartor/bilder/algikon.png';
        jakttiderImg.alt = 'Älgjaktskartan';
        elkJakttiderButton.appendChild(jakttiderImg);

        const skotselomradenImg = document.createElement('img');
        skotselomradenImg.src = 'bottom_panel/Kartor/bilder/algikon.png';
        skotselomradenImg.alt = 'Älgskötselområden';
        elkSkotselomradenButton.appendChild(skotselomradenImg);

        // Lägg till knappar till panelen
        buttonContainer.appendChild(elkJakttiderButton);
        buttonContainer.appendChild(elkSkotselomradenButton);
    }

    // Funktion för att återställa ursprungliga knappar
    function restoreOriginalButtons() {
        buttonContainer.innerHTML = ''; // Rensa knappcontainern
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
    }

    // Debugging
    console.log('Kartor tab created and added to body');
}
