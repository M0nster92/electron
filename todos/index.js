const electron = require('electron');
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  remote
} = electron;

const isMac = process.platform === 'darwin'

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreference: {
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => app.quit());

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });

  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [{
  label: 'File',
  submenu: [{
      label: 'New Todo',
      click() {
        createAddWindow()
      }
    },
    {
      label: 'Quit',
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]
}]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: ''
  });
}

if (process.env.NODE_ENV != 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [{
      label: 'Toggle Developer Tool',
      accelerator: process.platform === "darwin" ? 'Command+Alt+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }]
  })
}
