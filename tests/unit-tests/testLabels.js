const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");

function initialiseSpectron() {
   let electronPath = path.join(__dirname, "../../node_modules", ".bin", "electron");
   const appPath = path.join(__dirname, "../../dist");
   if (process.platform === "win32") {
       electronPath += ".cmd";
   }

   return new Application({
       path: "electronPath",
       args: [appPath],
       env: {
           ELECTRON_ENABLE_LOGGING: true,
           ELECTRON_ENABLE_STACK_DUMPING: true,
           NODE_ENV: "development"
       },
       startTimeout: 10000,
       chromeDriverLogPath: '../chromedriverlog.txt'
  });
}

chai.should();
chai.use(chaiAsPromised);

const win = initialiseSpectron()


describe("test-login-form", function() {
    // CSS selectors
    const startingButton = 'btn-group button:first-of-type';

    // Start spectron
    before(function() {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    // Stop Electron
    after(function() {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    describe("The buttons have the right labels", function() {
        // wait for Electron window to open
        app.on('ready', function(){

        })
    });
});

const app = initialiseSpectron();
