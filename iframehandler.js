// iframehandler.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Iframe handler loaded.");

    function showDaggdjur() {
        var daggdjurContainer = document.getElementById('daggdjur-container');
        var fagelContainer = document.getElementById('fagel-container');
        
        daggdjurContainer.style.display = 'block';
        fagelContainer.style.display = 'none';
    }

    function showFagel() {
        var daggdjurContainer = document.getElementById('daggdjur-container');
        var fagelContainer = document.getElementById('fagel-container');
        
        daggdjurContainer.style.display = 'none';
        fagelContainer.style.display = 'block';
    }

    document.getElementById('daggdjur-button').addEventListener('click', function() {
        console.log("Däggdjur-knappen klickad.");
        showDaggdjur();
    });

    document.getElementById('fagel-button').addEventListener('click', function() {
        console.log("Fågel-knappen klickad.");
        showFagel();
    });
});
