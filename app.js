// server.js
const http = require('http');
const url = require('url');
const {
  pleaseProvideBothWordAndDefinition,
  warningWordAlreadyExists,
  requestNewEntryRecorded,
  requestWordNotFound,
  notFound
} = require('./modules/strings.js');

let dictionary = [];
let requestCount = 0;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/definitions') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { word, definition } = JSON.parse(body);
      if (!word || !definition) {
        requestCount++;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: pleaseProvideBothWordAndDefinition }));
        return;
      }
      const existingIndex = dictionary.findIndex(entry => entry.word === word);
      if (existingIndex !== -1) {
        requestCount++;
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: warningWordAlreadyExists(word) }));
        return;
      }
      dictionary.push({ word, definition });
      requestCount++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(requestNewEntryRecorded(requestCount, word, definition, dictionary.length)));
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/api/definitions') {
    const { word } = parsedUrl.query;
    const entry = dictionary.find(entry => entry.word === word);
    if (!entry) {
      requestCount++;
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: requestWordNotFound(requestCount, word) }));
      return;
    }
    requestCount++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `${entry.word}: ${entry.definition}` }));
  } else {
    requestCount++;
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(notFound);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
