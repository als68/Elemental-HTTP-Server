const fs = require('fs');
const http = require('http');
const querystring = require('querystring');
const templateFunc = require('./template');
const templateIndexFunc = require('./templateIndex');

var myCounter = 0;

var proxy = http.createServer( (req, res) => {

  function send404(res){
    fs.readFile('./public/404.html', (err, data) => {
      console.log('Error 404, son');
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end(data.toString());
    });
  }

  function getMethod(){
    if(req.url === '/'){
      req.url = '/index.html';
    }
    fs.readFile('./public' + req.url, (err, data) => {
      if(err){
        send404(res);
      } else {
          if(req.url === '/favicon.ico'){
            res.writeHead(200);
            res.end(data.toString());
          } else if (req.url === '/css/styles.css'){
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(data.toString());
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data.toString());
          }
        }
    });
  }

  function postMethod (req, res){
    fs.readFile('./public' + req.url, (err, data) =>{

    var rawBody = '';

     req.on('data', (chunk) => {
      rawBody += chunk;
     }).on('end', function(err){
      rawBody = querystring.parse(rawBody);
      var newElement = templateFunc(rawBody.elementName, rawBody.elementSymbol, rawBody.elementAtomicNumber, rawBody.elementDescription);
      var newElementURLName = rawBody.elementName;

        fs.writeFile('./public/' + rawBody.elementName.toLowerCase() + '.html', newElement, (err) => {
        });

        fs.readFile('./public/index.html', (err, data) => {
          var newElementToAppend = `<li><a href="/${rawBody.elementName.toLowerCase()}.html">${rawBody.elementName}</a></li></ol>`;
          var appendedIndex = data.toString().replace(/<\/ol>/g, newElementToAppend);

          fs.readdir('./public/', function(err, items) {
              for (var i=0; i<items.length; i++) {
                if(items[i].includes('.html') && items[i] !== '404.html' && items[i] !== 'index.html'){
                  myCounter++;
                  console.log('Number of applicable items: ' + myCounter);
                  appendedIndex = data.toString().replace(/<!--counterRightHere-->/g, myCounter);

              fs.writeFile('./public/index.html', appendedIndex, () => {
              });

                }

              }
          });

        });
      });
    });
  }

  function putMethod (req, res){
    console.log('putMethod req.url: ' + req.url);
    fs.readFile('./public' + req.url, (err, data) =>{
    console.log(req.rawHeaders);
    var rawBody = '';

     req.on('data', (chunk) => {
      rawBody += chunk;
     }).on('end', function(err){
      rawBody = querystring.parse(rawBody);
      var newElement = templateFunc(rawBody.elementName, rawBody.elementSymbol, rawBody.elementAtomicNumber, rawBody.elementDescription);
      var newElementURLName = rawBody.elementName;
      console.log(newElement);

        fs.writeFile('./public/' + rawBody.elementName.toLowerCase() + '.html', newElement, (err) => {
        });
      });
    });
  }

  function deleteMethod (path, callback){
    var rawBody = '';
    req.on('data', (chunk) =>{
      rawBody += chunk;
    }).on('end', function(err){
      rawBody = querystring.parse(rawBody);
      fs.unlink('./public/' + rawBody.elementName.toLowerCase() + '.html');
    });
  }

  switch(req.method){
    case 'GET':
      console.log('this method is GET');
      getMethod(req, res);
      break;

    case 'POST':
      console.log('this method is POST');
      postMethod(req, res);
      break;

    case 'PUT':
      console.log('this method is PUT');
      putMethod(req, res);
      break;

    case 'DELETE':
      console.log('this method is DELETE');
      deleteMethod(req, res);
      break;
  }
});

proxy.listen('6883', () => {
  console.log('Server listening on port 6883');
});