const electron = require("electron");
const isDev = require("electron-is-dev");
const fs = require("fs");
const { join } = require("path");

require("v8-compile-cache");

const { dialog, ipcMain, app, BrowserWindow } = electron;

let mainWindow;
let printWindow;
let loginWindow;

const appDataPath = app.getPath("appData");

dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`);
};

const lock = app.requestSingleInstanceLock();

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 850,
    minHeight: 650,
    width: 800,
    height: 600,
    title: "Skintouch POS & Inventory", // Put App name here
    icon: `${__dirname}/Icon.png`,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000?main"
      : `file://${join(__dirname, "../build/index.html?main")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setMenu(null);
  mainWindow.on("closed", closeWindows);
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    minWidth: 375,
    minHeight: 650,
    width: 375,
    height: 650,
    title: "Skintouch POS & Inventory", // Put App name here
    icon: `${__dirname}/Icon.png`,
    autoHideMenuBar: true,
    frame: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  loginWindow.loadURL(
    isDev
      ? "http://localhost:3000?login"
      : `file://${join(__dirname, "../build/index.html?login")}`
  );

  if (isDev) {
  }
  loginWindow.webContents.openDevTools();

  loginWindow.setMenu(null);

  loginWindow.on("closed", () => {
    loginWindow.close();
    loginWindow = null;
  });
}

function createPrintWindow() {
  printWindow = new BrowserWindow({
    minWidth: 450,
    minHeight: 600,
    width: 450,
    height: 600,
    title: "Printing", // Put App name here
    icon: `${__dirname}/Icon.png`,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // if (isDev) {
  //   printWindow.webContents.openDevTools();
  // }

  printWindow.loadURL(
    isDev
      ? "http://localhost:3000?print"
      : `file://${join(__dirname, "../build/index.html?print")}`
  );

  printWindow.setMenu(null);
  printWindow.hide();
  printWindow.on("closed", closeWindows);
}

function closeWindows() {
  printWindow.close();
  mainWindow.close();
  mainWindow = null;
  printWindow = null;
}

function initDirectories() {
  const directories = [
    join(appDataPath, app.name, "data"),
    join(appDataPath, app.name, "data/image"),
    join(appDataPath, app.name, "temp"),
  ];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, () => {});
    }
  });
}

if (!lock) {
  app.quit();
} else {
  initDirectories();

  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    if (printWindow) {
      if (printWindow.isMinimized()) printWindow.restore();
      printWindow.focus();
    }
  });

  app.on("ready", () => {
    // createPrintWindow();
    // createMainWindow();
    createLoginWindow();

    ipcMain.on("return-to-login", (event) => {
      createLoginWindow();
      mainWindow.close();
      printWindow.close();
      mainWindow = null;
      printWindow = null;
      event.returnValue = "received";
    });

    ipcMain.on("minimize-login", (event) => {
      loginWindow.minimize();
      event.returnValue = "received";
    });

    ipcMain.on("open-main-window", (event, token) => {
      createPrintWindow();
      createMainWindow();
      loginWindow.close();
      loginWindow = null;
      event.returnValue = "received";
    });

    ipcMain.on("printData", (event, message) => {
      console.log(message);
      printWindow.webContents.send("toPrintWindow", message);
      event.returnValue = "received";
    });

    ipcMain.on("get-printer", (event) => {
      event.returnValue = printWindow.webContents.getPrinters();
    });

    ipcMain.on("get-app-data-path", (event) => {
      event.returnValue = join(appDataPath, app.name, "data");
    });

    ipcMain.on("go-print", async (event, device) => {
      printWindow.webContents.print(
        {
          silent: true,
          printBackground: false,
          deviceName: device,
          margins: { marginType: "none" },
        },
        (success, errorType) => {
          if (!success) console.log(errorType);
          console.log(device);
        }
      );
      event.returnValue = 1;
    });
  });
}

app.on("window-all-closed", () => {
  app.quit();
});
