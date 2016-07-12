function templateFunc(elementName, elementSymbol, atomicNumber, description) {
/*    if (!elementName || !elementSymbol || !atomicNumber || !description) {
        return false;
    }*/
    var template = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${elementName}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${elementName}</h1>
    <h2>${elementSymbol}</h2>
    <h3>Atomic number ${atomicNumber}</h3>
    <p>${description}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`;
    return template;
}

module.exports = templateFunc;