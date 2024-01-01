const search = require('./search.js');

module.exports = function (content) {
    return html`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Embedding Searchable Static Site Example</title>
    <link rel="stylesheet" href="https://unpkg.com/axist@latest/dist/axist.min.css" />
    <style>
        .small-text { font-size: 0.7em !important; }
    </style>
</head>
<body>
    <main role="main">
        <div class="header">
            <a id="top"></a>
            <a href="/"><img src="/assets/logo.svg" width=100/></a>
            <h3>ESSSE - Embedding Searchable Static Site Example</h3>
            ${search()}
        </div>

        <section id="content">
            <br><br>
            ${content}
            <br><br>
        </section>
        
        <footer>
            <p>
                <span style="float: left;">© 2024 Example</span>
                <a style="float: right;" href="#top">Go to top ↑</a>
            </p>
        </footer>
    </main>
</body>
</html>
`;
}