const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { readFile } = require('fs/promises');

app.commandLine.appendArgument('enable-unsafe-webgpu');
app.commandLine.appendArgument('enable-features=Vulkan');

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
    });

    // and load the index.html of the app.
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('channel-fs', async (event, filePath, encoding) => {
    const localPath = path.join(__dirname, filePath);
    return await readFile(localPath, encoding);
});
