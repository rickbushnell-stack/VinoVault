const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * VinoVault Production Server
 * Optimized for Google Cloud Run and GCSFuse
 */

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.tsx': 'text/javascript', 
  '.ts': 'text/javascript',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // 1. FAST HEALTH CHECKS
  // We handle these first to ensure the container is marked "Ready" ASAP.
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  const isHealth = pathname === '/_health' || 
                   pathname === '/ping' || 
                   (req.headers['user-agent'] && req.headers['user-agent'].includes('GoogleHC'));

  if (isHealth) {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Connection': 'close' });
    res.end('OK');
    return;
  }

  // 2. LOGGING
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // 3. STATIC FILE SERVING
  let targetPath = pathname === '/' ? 'index.html' : pathname;
  let filePath = path.join(__dirname, targetPath);

  // Security check
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const serveFile = (pathToSend, status = 200) => {
    const ext = path.extname(pathToSend).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(pathToSend, (err, data) => {
      if (err) {
        // If file missing (or React routing), fallback to index.html
        if (pathToSend !== path.join(__dirname, 'index.html')) {
          return serveFile(path.join(__dirname, 'index.html'));
        }
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(status, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(data);
      }
    });
  };

  serveFile(filePath);
});

// 4. BINDING
server.listen(PORT, HOST, () => {
  console.log('====================================');
  console.log(`VinoVault starting on port ${PORT}`);
  console.log(`Working Directory: ${__dirname}`);
  console.log('====================================');
});

// 5. GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});