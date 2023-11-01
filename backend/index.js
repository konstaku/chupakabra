require('dotenv').config();

const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const Master = require('./database/schema/Master');

const PORT_NUMBER = 5000;
const CERTIFICATE = process.env.CERTIFICATE;
const KEYFILE = process.env.KEYFILE;
const httpsOptions = {
  key: fs.readFileSync(KEYFILE),
  cert: fs.readFileSync(CERTIFICATE),
};

const db = require('./database/db');
const bot = require('./bot');

const corsMiddleware = (req, res, next) => {
  // CORS headers temporary set to allow all origins - will change on production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(corsMiddleware);

  await db.runDB();
  await bot.runBot();

  app.get('/', async (req, res) => {
    console.log(
      `=== API request to HTTP server at ${new Date().toUTCString()} ===`
    );

    switch (req.query.q) {
      case 'masters':
        const masters = await Master.find();
        res.status(200).send(masters);
        break;
      default:
        res.status(404).send('No such file!');
    }
  });

  app.post('/addmaster', async (req, res) => {
    console.log(`=== New data posted at ${new Date().toUTCString()}`);
    console.log(`Request data:`);
    for (const key in req.body) {
      console.log(`${key}: ${req.body[key]}`);
    }
    res.status(200).json({ success: true });
  });

  const httpsServer = https.createServer(httpsOptions, app);

  httpsServer
    .listen(PORT_NUMBER, () =>
      console.log(`Backend server started on port ${PORT_NUMBER}`)
    )
    .on('error', (err) => {
      console.log('Error starting backend server:', err);
    });
}

main().catch(console.error);
