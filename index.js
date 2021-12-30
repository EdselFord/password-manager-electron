const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const {
   addPassword,
   getPassword,
   searchPassword,
   removePassword,
} = require("./utils/manager");

let loginWindow;
let mainWindow;
let addWindow;
let mainMenu;

app.on("ready", () => {
   loginWindow = new BrowserWindow({
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
      width: 450,
      height: 300,
      resizable: false,
   });

   loginWindow.loadURL(`file://${__dirname}/views/login.html`);
   loginWindow.on("closed", () => (loginWindow = null));

   const loginMenu = Menu.buildFromTemplate(loginTemplate);
   mainMenu = Menu.buildFromTemplate(mainTemplate);
   Menu.setApplicationMenu(loginMenu);
});

const loginTemplate = [];

const mainTemplate = [
   {
      label: "File",
      submenu: [
         {
            label: "Add Password",
            click() {
               displayAddWindow();
            },
         },
         {
            label: "Exit",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
            click() {
               app.quit();
            },
         },
      ],
   },
   {
      label: "View",
      submenu: [
         {
            label: "Developer Tool",
            accelerator:
               process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
            click(item, focusedWindow) {
               focusedWindow.toggleDevTools();
            },
         },
         {
            label: "Refresh",
            accelerator: process.platform === "darwin" ? "Command+R" : "Ctrl+R",
            click(item, focusedWindow) {
               focusedWindow.reload();
            },
         },
      ],
   },
];

function displayAddWindow() {
   addWindow = new BrowserWindow({
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
      width: 450,
      height: 570,
   });

   addWindow.loadURL(`file://${__dirname}/views/add.html`);
   addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on("log:istrue", () => {
   loginWindow.close();

   mainWindow = new BrowserWindow({
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
   });
   mainWindow.on("closed", () => {
      app.quit();
   });

   mainWindow.loadURL(`file://${__dirname}/views/index.html`);

   Menu.setApplicationMenu(mainMenu);
});
ipcMain.on("main:loaded", () => {
   mainWindow.webContents.send("pass:getlist", getPassword());
});

ipcMain.on("pass:add", (event, pass) => {
   addPassword(pass);
   addWindow.close();
   mainWindow.reload();
});

ipcMain.on("pass:remove", (event, pass) => {
   removePassword(pass);
});

ipcMain.on("pass:search", (event, keyword) => {
   mainWindow.webContents.send("pass:getsearch", searchPassword(keyword));
});

ipcMain.on("main:goadd", () => {
   displayAddWindow();
});
