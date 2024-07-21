function openKartor() {
    const tabPane = document.getElementById('tab2');
    if (!tabPane) {
        console.error('Tab pane for kartor not found.');
        return;
    }

    tabPane.innerHTML = '';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.display = 'flex';

    const buttons = [
        {
            className: 'styled-button',
            onclick: "Kartor_geojsonHandler.toggleLayer('Allmän jakt: Däggdjur', ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson', 'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'])",
            imgSrc: 'bottom_panel/Kartor/bilder/daggdjurikon.png',
            imgAlt: 'Allmän jakt: Däggdjur'
        },
        {
            className: 'styled-button',
            onclick: "Kartor_geojsonHandler.toggleLayer('Allmän jakt: Fågel', ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson', 'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson', 'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson', 'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson', 'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson'])",
            imgSrc: 'bottom_panel/Kartor/bilder/fagelikon.png',
            imgAlt: 'Allmän jakt: Fågel'
        },
        {
            className: 'styled-button',
            id: 'huvudknapp-älgjakt-button',
            imgSrc: 'bottom_panel/Kartor/bilder/algikon.png',
            imgAlt: 'Huvudknapp-Älgjakt',
            onclick: "Kartor_geojsonHandler.toggleLayer('Älgjaktsområden')" // Korrekt växling för Älgjaktsområden
        }
    ];

    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = button.className;
        btn.setAttribute('onclick', button.onclick);
        btn.id = button.id || '';

        const img = document.createElement('img');
        img.src = button.imgSrc;
        img.alt = button.imgAlt;

        btn.appendChild(img);
        buttonContainer.appendChild(btn);
    });

    tabPane.appendChild(buttonContainer);
    container.appendChild(tabPane);
    document.body.appendChild(container);

    const huvudknappAlgjaktButton = document.getElementById('huvudknapp-älgjakt-button');
    huvudknappAlgjaktButton.addEventListener('click', function(event) {
        event.stopPropagation();
        showElkMapOptions();
    });

    function showElkMapOptions() {
        buttonContainer.innerHTML = '';

        const elkJaktsomradenButton = document.createElement('button');
        elkJaktsomradenButton.className = 'styled-button';
        elkJaktsomradenButton.onclick = function() {
            Kartor_geojsonHandler.toggleLayer('Älgjaktsområden'); // Använder toggleLayer för att korrekt hantera lager
        };
        const jaktsomradenImg = document.createElement('img');
        jaktsomradenImg.src = 'bottom_panel/Kartor/bilder/Algjaktsomraden_ikon.png';
        jaktsomradenImg.alt = 'Älgjaktsområden';
        elkJaktsomradenButton.appendChild(jaktsomradenImg);
        buttonContainer.appendChild(elkJaktsomradenButton);

        restoreOriginalButtons();
    }

    function restoreOriginalButtons() {
        buttonContainer.innerHTML = '';
        buttons.forEach(button => {
            if (button.id !== 'huvudknapp-älgjakt-button') {
                const btn = document.createElement('button');
                btn.className = button.className;
                btn.setAttribute('onclick', button.onclick);
                const img = document.createElement('img');
                img.src = button.imgSrc;
                img.alt = button.imgAlt;
                btn.appendChild(img);
                buttonContainer.appendChild(btn);
            }
        });
        buttonContainer.appendChild(huvudknappAlgjaktButton);
    }
}
