// Importera Moon från lunarphase-js ESM-modul från Skypack CDN
import { Moon } from 'https://cdn.skypack.dev/lunarphase-js@2.0.2';

// Funktion för att lägga till CSS-stilar dynamiskt
function addStyles(styles) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Lägg till CSS-stilar
addStyles(`
    #moon-phase-container {
        position: fixed;
        top: 4px;
        right: 4px;
        z-index: 9999;
        text-align: right;
    }
    #moon-phase {
        display: block;
    }
    #moon-image {
        width: 45px;
        height: auto;
    }
`);

// Vänta tills dokumentet är laddat
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document fully loaded and parsed");

    // Hämta dagens datum
    const today = new Date();

    // Beräkna månens fas
    const moonPhase = Moon.lunarPhase(today);
    console.log(`Today's moon phase: ${moonPhase}`); // Lägg till loggning för månfasen
    const moonPhaseElement = document.getElementById('moon-phase');
    const moonImageElement = document.getElementById('moon-image');

    if (moonPhaseElement && moonImageElement) {
        moonPhaseElement.innerText = `Dagens månfas: ${moonPhase}`;

        // Bestäm bild baserat på månens fas
        let moonImageSrc;
        switch(moonPhase) {
            case 'NEW':
                moonImageSrc = 'bilder/moonface/moonface-new-moon.png';
                break;
            case 'WAXING_CRESCENT':
                moonImageSrc = 'bilder/moonface/moonface-waxing-crescent-moon.png';
                break;
            case 'FIRST_QUARTER':
                moonImageSrc = 'bilder/moonface/moonface-first-quarter-moon.png';
                break;
            case 'WAXING_GIBBOUS':
                moonImageSrc = 'bilder/moonface/moonface-waxing-gibbous-moon.png';
                break;
            case 'FULL':
                moonImageSrc = 'bilder/moonface/moonface-full-moon.png';
                break;
            case 'WANING_GIBBOUS':
                moonImageSrc = 'bilder/moonface/moonface-waning-gibbous-moon.png';
                break;
            case 'LAST_QUARTER':
                moonImageSrc = 'bilder/moonface/moonface-last-quarter-moon.png';
                break;
            case 'WANING_CRESCENT':
                moonImageSrc = 'bilder/moonface/moonface-waning-crescent-moon.png';
                break;
            default:
                moonImageSrc = 'bilder/moonface/default-moon.png';
                break;
        }

        // Sätt bildens källa
        console.log(`Setting moon image source to: ${moonImageSrc}`); // Lägg till loggning för bildkällan
        moonImageElement.src = moonImageSrc;
        moonImageElement.onerror = function() {
            console.error(`Failed to load image: ${moonImageSrc}`);
        };
    } else {
        console.error("Moon phase element or moon image element not found");
    }
});
