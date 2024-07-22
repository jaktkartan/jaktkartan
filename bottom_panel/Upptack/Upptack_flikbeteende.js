// Funktion för att skapa knappar i tab1
function openUpptack() {
    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for upptäck not found.');
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
            onclick: function() {
                if (typeof Upptack_geojsonHandler !== 'undefined') {
                    Upptack_geojsonHandler.toggleLayer('Mässor', [
                        'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/Massor.geojson'
                    ]);
                } else {
                    console.error("Upptack_geojsonHandler är inte definierad.");
                }
            },
            imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
            imgAlt: 'Mässor'
        },
        {
            className: 'styled-button',
            onclick: function() {
                if (typeof Upptack_geojsonHandler !== 'undefined') {
                    Upptack_geojsonHandler.toggleLayer('Jaktkort', [
                        'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktkort.geojson'
                    ]);
                } else {
                    console.error("Upptack_geojsonHandler är inte definierad.");
                }
            },
            imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
            imgAlt: 'Jaktkort'
        },
        {
            className: 'styled-button',
            onclick: function() {
                if (typeof Upptack_geojsonHandler !== 'undefined') {
                    Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor', [
                        'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktskyttebanor.geojson'
                    ]);
                } else {
                    console.error("Upptack_geojsonHandler är inte definierad.");
                }
            },
            imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
            imgAlt: 'Jaktskyttebanor'
        },
        {
            className: 'styled-button',
            onclick: function() {
                if (typeof Upptack_geojsonHandler !== 'undefined') {
                    Upptack_geojsonHandler.toggleLayer('Visa_allt');
                } else {
                    console.error("Upptack_geojsonHandler är inte definierad.");
                }
            },
            textContent: 'Visa allt'
        },
        {
            className: 'styled-button',
            onclick: function() {
                if (typeof Upptack_geojsonHandler !== 'undefined') {
                    Upptack_geojsonHandler.toggleLayer('Rensa_allt');
                } else {
                    console.error("Upptack_geojsonHandler är inte definierad.");
                }
            },
            textContent: 'Rensa allt'
        }
    ];

    // Skapa knappar och lägg till dem i knapp-container
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = button.className;
        btn.onclick = button.onclick;

        if (button.imgSrc) {
            const img = document.createElement('img');
            img.src = button.imgSrc;
            img.alt = button.imgAlt;
            btn.appendChild(img);
        } else if (button.textContent) {
            btn.textContent = button.textContent;
        }

        buttonContainer.appendChild(btn);
    });

    // Skapa knappen "Nästkommande mässa"
    const nextEventButton = document.createElement('button');
    nextEventButton.className = 'styled-button';
    nextEventButton.textContent = 'Nästkommande mässa';
    nextEventButton.style.padding = '12px 16px';
    nextEventButton.style.border = '1px solid rgb(50, 94, 88)';
    nextEventButton.style.borderRadius = '5px';
    nextEventButton.style.backgroundColor = 'rgb(240, 240, 240)';
    nextEventButton.style.color = 'rgb(50, 94, 88)';
    nextEventButton.style.cursor = 'pointer';
    nextEventButton.style.outline = 'none';
    nextEventButton.style.marginLeft = '10px'; // Lägg till mellanrum mellan knapparna
    nextEventButton.style.zIndex = '999';

    // Lägg till en eventlyssnare för knappen "Nästkommande mässa"
    nextEventButton.addEventListener('click', function() {
        alert('Funktionalitet för att visa nästkommande mässa kommer snart!');
    });

    // Lägg till knapp-container och knappen "Nästkommande mässa" till containern
    container.appendChild(buttonContainer);
    container.appendChild(nextEventButton);

    // Lägg till containern i tab-pane
    tabPane.appendChild(container);
}

// Anropa openUpptack-funktionen för att generera innehållet
openUpptack();
