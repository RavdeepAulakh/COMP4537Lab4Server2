const http = require('http');
const url = require('url');

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
        const errorMessage = 'Please provide both word and definition.';
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage }));
        return;
      }
      const existingIndex = dictionary.findIndex(entry => entry.word === word);
      if (existingIndex !== -1) {
        const errorMessage = `Warning! '${word}' already exists.`;
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage }));
        return;
      }
      dictionary.push({ word, definition });
      console.log(dictionary);
      requestCount++;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Request # ${requestCount} - New entry recorded:\n\n"${word} : ${definition}"`);
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/api/definitions/') {
    const { word } = parsedUrl.query;
    console.log(word);
    const entry = dictionary.find(entry => entry.word === word);
    if (!entry) {
      const errorMessage = `Request # ${requestCount + 1}, word '${word}' not found!`;
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: errorMessage }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `${entry.word}: ${entry.definition}` }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
