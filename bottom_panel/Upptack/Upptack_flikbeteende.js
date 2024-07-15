document.addEventListener('DOMContentLoaded', () => {
    // Skapa huvudcontainern
    const mainContainer = document.createElement('div');
    mainContainer.id = 'tab2';
    mainContainer.className = 'tab-pane';
    document.body.appendChild(mainContainer);

    // Skapa button-container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    mainContainer.appendChild(buttonContainer);

    // Funktion för att skapa en vanlig knapp
    function createButton(imgSrc, altText, clickHandler) {
        const button = document.createElement('button');
        button.className = 'styled-button';
        button.onclick = clickHandler;

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = altText;
        button.appendChild(img);

        buttonContainer.appendChild(button);
    }

    // Funktion för att skapa dropdown-knappen med alternativ
    function createDropdownButton(buttonText, iconSrc, options) {
        const container = document.createElement('div');
        container.className = 'dropdown';

        const dropdownButton = document.createElement('button');
        dropdownButton.className = 'styled-button dropdown-button';
        dropdownButton.innerHTML = `<img src="${iconSrc}" alt="${buttonText}">`;
        container.appendChild(dropdownButton);

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';

        options.forEach(option => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = option.text;
            link.addEventListener('click', function(event) {
                event.preventDefault();
                option.action();
                // Dölja dropdown efter val
                dropdownContent.style.display = 'none';
            });
            dropdownContent.appendChild(link);
        });

        container.appendChild(dropdownContent);
        buttonContainer.appendChild(container);

        // Lägg till eventlyssnare för att visa/dölj dropdown
        dropdownButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Förhindra att klick på dropdown-knappen stänger menyn
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
        });

        // Lägg till eventlyssnare för att stänga dropdown när man klickar utanför
        document.addEventListener('click', function(event) {
            if (!container.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    }

    // Skapa knappar med dropdown
    createButton('bottom_panel/Kartor/bilder/daggdjurikon.png', 'Allmän jakt: Däggdjur', function() {
        Kartor_geojsonHandler.toggleLayer('Allmän jakt: Däggdjur', [
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'
        ]);
    });

    createButton('bottom_panel/Kartor/bilder/fagelikon.png', 'Allmän jakt: Fågel', function() {
        Kartor_geojsonHandler.toggleLayer('Allmän jakt: Fågel', [
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson',
            'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson'
        ]);
    });

    createDropdownButton('Älgjaktskartan', 'bottom_panel/Kartor/bilder/algikon.png', [
        { text: 'Vanlig karta', action: function() {
            Kartor_geojsonHandler.toggleLayer('Älgjaktskartan', [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Srskiltjakttidsfnster_3.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Kirunakommunnedanodlingsgrns_4.geojson'
            ]);
        }},
        { text: 'ÄSO', action: function() {
            Kartor_geojsonHandler.toggleLayer('Älgjaktskartan ÄSO', [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/ÄSO_1.geojson'
            ]);
        }}
    ]);

    // Lägg till CSS via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .button-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: nowrap;
            gap: 10px;
            padding: 5px;
            width: 100%;
            max-width: 800px;
        }
        .styled-button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgb(50, 94, 88);
            border-radius: 5px;
            overflow: hidden;
            aspect-ratio: 1 / 1;
            width: 100px;
            max-height: 100px;
            box-sizing: border-box;
            cursor: pointer;
        }
        .styled-button img {
            width: auto;
            height: 100%;
            object-fit: contain;
        }
        .dropdown {
            position: relative;
            display: inline-flex;
        }
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
            z-index: 1;
            text-align: center;
            border-radius: 5px;
            padding: 0;
            box-sizing: border-box;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }
        .dropdown-content a:hover {
            background-color: #f1f1f1;
        }
        .dropdown-button {
            background-color: #f0f0f0;
        }
        .dropdown-button:hover {
            background-color: #e0e0e0;
        }
    `;
    document.head.appendChild(style);
});
