<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: rgb(50, 94, 88);
            padding: 20px;
        }
        #iframe-container {
            display: none;
            margin-top: 20px;
        }
        #sheet-iframe {
            width: 100%;
            height: 500px;
            border: none;
        }
    </style>
</head>
<body>
    <div id="county-buttons">
        <button class="county-button" onclick="loadIframe('https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml')">Blekinge län</button>
        <!-- Lägg till liknande knappar för andra län här -->
    </div>

    <div id="iframe-container">
        <iframe id="sheet-iframe" src="" frameborder="0"></iframe>
    </div>

    <script>
        function loadIframe(url) {
            document.getElementById('sheet-iframe').src = url;
            document.getElementById('iframe-container').style.display = 'block';
        }
    </script>
</body>
</html>
