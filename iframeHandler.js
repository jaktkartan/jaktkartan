<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Stilsättning för iframe-container */
        #iframe-container {
            display: none;
            margin-top: 20px;
        }
        /* Stilsättning för iframe */
        #sheet-iframe {
            width: 100%;
            height: 500px;
            border: none;
        }
    </style>
</head>
<body>
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
