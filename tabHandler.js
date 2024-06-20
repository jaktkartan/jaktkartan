function togglePanel() {
    console.log("Toggling weather panel...");
    var weatherInfo = document.getElementById('weather-info');
    if (weatherInfo.style.display === 'none') {
        console.log("Showing weather panel...");
        weatherInfo.style.display = 'block';
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Getting current position...");
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            console.log("Current position:", latitude, longitude);
            getWeatherForecast(latitude, longitude);
        });
    } else {
        console.log("Hiding weather panel...");
        weatherInfo.style.display = 'none';
    }
}

// Funktion för att återställa flikarna till sitt ursprungliga tillstånd
function resetTabs() {
    var tabs = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none'; // Göm flikarna
        tabs[i].innerHTML = ''; // Ta bort innehållet i flikarna
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none'; // Göm flikinnehållet
}

// Funktion för att öppna Jaktbart idag-fliken
function openJaktbartIdagTab() {
    resetTabs(); // Återställ flikarna innan en ny öppnas
    var tabContentElement = document.getElementById('tab3');
    tabContentElement.innerHTML = ''; // Rensa flikinnehållet

    // Rubrik för fliken
    var heading = document.createElement('h2');
    heading.textContent = 'Jaktbart idag';
    tabContentElement.appendChild(heading);

    // Statisk information om vad som är jaktbart idag
    var paragraph = document.createElement('p');
    paragraph.textContent = 'Information om vad som är jaktbart idag baserat på säsong och lagar.';
    tabContentElement.appendChild(paragraph);

    // Knapp för att visa koordinater
    var coordButton = document.createElement('button');
    coordButton.textContent = 'Visa Koordinater';
    coordButton.onclick = function() {
        // Simulerad hantering för att visa koordinater
        alert("Dina koordinater: Latitud 59.3293, Longitud 18.0686");
    };
    tabContentElement.appendChild(coordButton);

    // Visa fliken och flikinnehållet
    tabContentElement.style.display = 'block';
    var tabContentParent = document.getElementById('tab-content');
    tabContentParent.style.display = 'block';
}

// Händelselyssnare för att öppna Jaktbart idag-fliken när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    var jaktbartIdagButton = document.getElementById('jaktbart-idag-button');
    jaktbartIdagButton.addEventListener('click', openJaktbartIdagTab);
});

// Händelselyssnare för att hantera klick utanför flikarna och panelknapparna
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs(); // Återställ flikarna om användaren klickar utanför dem
    }
});

// Funktion för att stänga flikinnehållet
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Stäng flikinnehållet när man klickar utanför det
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        closeTabContent();
    }
});
