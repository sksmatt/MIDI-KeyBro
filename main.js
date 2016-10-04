var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() { app.quit(); });

/*
|--------------------------------------------------------------------------
| READY
|--------------------------------------------------------------------------
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function(){
  var mainWindow = new BrowserWindow({
    width:895,
    height:350,
    title: 'MIDI KeyBro',
    frame: true,
    center:true,
    fullscreen: false,
    'min-width':895,
    'min-height':350,
    'max-width':895,
    'max-height':350,
    resizable: 'false'
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  // mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      mainWindow = null;
  });
});