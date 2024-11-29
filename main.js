let Store;

(async () => {
    const { default: ElectronStore } = await import('electron-store');
    Store = ElectronStore;

    // 初始化 store 实例
    const store = new Store();
    console.log('Store initialized:', store);

    // 创建窗口
    createWindow(store);
})();

const { app, BrowserWindow, nativeImage, Tray  } = require('electron');
const path = require('node:path');
const { version: electronVersion } = process.versions;
const { chrome: chromiumVersion } = process.versions;

let mainWindow;

const createWindow = (store) => {
    console.log('Electron Version:', electronVersion);
    console.log('Chromium Version:', chromiumVersion);
    const windowState = store.get('windowState');
    const windowOptions = {
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            enableBlinkFeatures: 'OverlayScrollbars'
        },
        icon: __dirname + '/icon/icon.ico',
    };

    if (windowState) {
        windowOptions.x = windowState.x;
        windowOptions.y = windowState.y;
        windowOptions.width = windowState.width;
        windowOptions.height = windowState.height;
    }

    mainWindow = new BrowserWindow(windowOptions);
    const filePath = process.argv[1]; // 获取文件路径 (注意: process.argv[0] 是可执行文件路径, process.argv[1]是第一个参数)
    console.log('File path:',filePath)
    // 加载 index.html
    // mainWindow.loadFile('index.html')
    mainWindow.loadFile(path.join(__dirname, 'index.html'), {
        query: {
        filePath: filePath // 将 filePath 传递到 query 参数
        }
    });

    mainWindow.on('resize', () => {
        const windowBounds = mainWindow.getBounds();
        store.set('windowState', windowBounds);
    });

    mainWindow.on('move', () => {
        const windowBounds = mainWindow.getBounds();
        store.set('windowState', windowBounds);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.whenReady().then(() => {
    // App logic in dynamic import above
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(store);
});
