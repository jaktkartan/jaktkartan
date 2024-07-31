// Hämta dagens datum
const today = new Date();

// Beräkna månens fas
const moonPhase = LunarPhase.lunarPhase(today);

// Visa månens fas
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('moon-phase').innerText = `Dagens månfas: ${moonPhase.phaseName}`;

    // Bestäm bild baserat på månens fas
    let moonImageSrc;
    switch(moonPhase.phaseName) {
        case 'New Moon':
            moonImageSrc = 'bilder/moonface/moonface-new-moon.png';
            break;
        case 'Waxing Crescent':
            moonImageSrc = 'bilder/moonface/moonface-waxing-crescent-moon.png';
            break;
        case 'First Quarter':
            moonImageSrc = 'bilder/moonface/moonface-first-quarter-moon.png';
            break;
        case 'Waxing Gibbous':
            moonImageSrc = 'bilder/moonface/moonface-waxing-gibbous-moon.png';
            break;
        case 'Full Moon':
            moonImageSrc = 'bilder/moonface/moonface-full-moon.png';
            break;
        case 'Waning Gibbous':
            moonImageSrc = 'bilder/moonface/moonface-waning-gibbous-moon.png';
            break;
        case 'Last Quarter':
            moonImageSrc = 'bilder/moonface/moonface-last-quarter-moon.png';
            break;
        case 'Waning Crescent':
            moonImageSrc = 'bilder/moonface/moonface-waning-crescent-moon.png';
            break;
        default:
            moonImageSrc = 'bilder/moonface/default-moon.png'; // fallback if phase is unknown
            break;
    }

    // Sätt bildens källa
    document.getElementById('moon-image').src = moonImageSrc;
});
