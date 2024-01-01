const layout = require("./components/layout");

module.exports = function () {
  return layout(html`

    <p>Welcome to this hypothetical static site blog</p>

    <h5>Articles:</h5>
    <p id="index"></p> 

  `);
}