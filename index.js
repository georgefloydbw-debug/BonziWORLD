// ========================================================================
// Server init
// ========================================================================

// Filesystem reading functions
const fs = require('fs-extra');

// Load settings
let stats;
try {
  stats = fs.lstatSync('settings.json');
} catch (e) {
  if (e.code === "ENOENT") {
    try {
      fs.copySync('settings.example.json', 'settings.json');
      console.log("Created new settings file.");
    } catch (err) {
      console.error(err);
      throw "Could not create new settings file.";
    }
  } else {
    console.error(e);
    throw "Could not read 'settings.json'.";
  }
}

// Load settings into memory
const settings = require("./settings.json");

// Setup basic express server
const express = require('express');
const app = express();

if (settings.express.serveStatic)
  app.use(express.static('./build/www'));

const server = require('http').createServer(app);

// Init socket.io
const io = require('socket.io')(server);

// ✅ Use Render’s assigned port or fallback to settings.json or 3000
const port = process.env.PORT || settings.port || 3000;

exports.io = io;

// Init sanitize-html
const sanitize = require('sanitize-html');

// Init winston loggers
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

// Start listening
server.listen(port, function () {
  console.log(
    " Welcome to BonziWORLD!\n",
    "Time to meme!\n",
    "----------------------\n",
    "Server listening at port " + port
  );
});

// Serve public folder
app.use(express.static(__dirname + '/public'));

// ========================================================================
// Helper functions
// ========================================================================
const Utils = require("./utils.js");

// ========================================================================
// The Beef(TM)
// ========================================================================
const Meat = require("./meat.js");
Meat.beat();

// Console commands
const Console = require('./console.js');
Console.listen();
