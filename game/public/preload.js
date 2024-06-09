const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron_api', {

    nodeReadFileText: (channel, path) => {
        const validChannels = ['channel-fs'];

        if (validChannels.includes(channel) && typeof path === 'string') {
            return ipcRenderer.invoke(channel, path, 'utf-8');
        }
    },

    nodeReadFileBuffer: (channel, path) => {
        const validChannels = ['channel-fs'];

        if (validChannels.includes(channel) && typeof path === 'string') {
            return ipcRenderer.invoke(channel, path);
        }
    }


});