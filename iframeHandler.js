<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jaktbart Idag</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: rgb(50, 94, 88);
            padding: 20px;
        }
        .county-button {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 15px;
            font-size: 18px;
            color: rgb(50, 94, 88);
            background-color: #f0f0f0;
            border: 2px solid rgb(50, 94, 88);
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            transition: background-color 0.3s, color 0.3s;
        }
        .county-button:hover {
            background-color: rgb(50, 94, 88);
            color: white;
        }
        /* Stilsättning för iframe */
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
    <h1>Jaktbart Idag</h1>
    <p>Information om vad som är jaktbart idag i olika län.</p>
    <div id="county-buttons">
        <button class="county-button" onclick="loadIframe('https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml')">Blekinge län</button>
        <!-- Lägg till liknande knappar för andra län här -->
    </div>

    <!-- Iframe-container -->
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
