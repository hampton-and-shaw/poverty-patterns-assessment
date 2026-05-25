const http = require('http');
const https = require('https');

const KIT_API_KEY = 'Mv_sP4WonnxP6U-0sQYGEg';
const KIT_FORM_ID = '9484930';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/subscribe') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, name } = JSON.parse(body);
        const payload = JSON.stringify({
          api_key: KIT_API_KEY,
          email_address: email,
          first_name: name
        });
        const options = {
          hostname: 'api.convertkit.com',
          path: '/v3/forms/' + KIT_FORM_ID + '/subscribe',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        };
        const apiReq = https.request(options, apiRes => {
          let data = '';
          apiRes.on('data', chunk => data += chunk);
          apiRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
        });
        apiReq.on('error', () => {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false }));
        });
        apiReq.write(payload);
        apiReq.end();
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => console.log('Subscribe API running on port 3000'));
