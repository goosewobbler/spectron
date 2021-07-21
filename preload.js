const { contextBridge, ipcRenderer, process } = require('electron');

const browserWindowInstanceMethods = [
  'destroy',
  'close',
  'focus',
  'blur',
  'isFocused',
  'isDestroyed',
  'show',
  'showInactive',
  'hide',
  'isVisible',
  'isModal',
  'maximize',
  'unmaximize',
  'isMaximized',
  'minimize',
  'restore',
  'isMinimized',
  'setFullScreen',
  'isFullScreen',
  'setSimpleFullScreen',
  'isSimpleFullScreen',
  'isNormal',
  'setAspectRatio',
  'setBackgroundColor',
  'previewFile',
  'closeFilePreview',
  'setBounds',
  'getBounds',
  'getBackgroundColor',
  'setContentBounds',
  'getContentBounds',
  'getNormalBounds',
  'setEnabled',
  'isEnabled',
  'setSize',
  'getSize',
  'setContentSize',
  'getContentSize',
  'setMinimumSize',
  'getMinimumSize',
  'setMaximumSize',
  'getMaximumSize',
  'setResizable',
  'isResizable',
  'setMovable',
  'isMovable',
  'setMinimizable',
  'isMinimizable',
  'setMaximizable',
  'isMaximizable',
  'setFullScreenable',
  'isFullScreenable',
  'setClosable',
  'isClosable',
  'setAlwaysOnTop',
  'isAlwaysOnTop',
  'moveAbove',
  'moveTop',
  'center',
  'setPosition',
  'getPosition',
  'setTitle',
  'getTitle',
  'setSheetOffset',
  'flashFrame',
  'setSkipTaskbar',
  'setKiosk',
  'isKiosk',
  'isTabletMode',
  'getMediaSourceId',
  'getNativeWindowHandle',
  'hookWindowMessage',
  'isWindowMessageHooked',
  'unhookWindowMessage',
  'unhookAllWindowMessages',
  'setRepresentedFilename',
  'getRepresentedFilename',
  'setDocumentEdited',
  'isDocumentEdited',
  'focusOnWebView',
  'blurWebView',
  'capturePage',
  'loadURL',
  'loadFile',
  'reload',
  'setMenu',
  'removeMenu',
  'setProgressBar',
  'setOverlayIcon',
  'setHasShadow',
  'hasShadow',
  'setOpacity',
  'getOpacity',
  'setShape',
  'setThumbarButtons',
  'setThumbnailClip',
  'setThumbnailToolTip',
  'setAppDetails',
  'showDefinitionForSelection',
  'setIcon',
  'setWindowButtonVisibility',
  'setAutoHideMenuBar',
  'isMenuBarAutoHide',
  'setMenuBarVisibility',
  'isMenuBarVisible',
  'setVisibleOnAllWorkspaces',
  'isVisibleOnAllWorkspaces',
  'setIgnoreMouseEvents',
  'setContentProtection',
  'setFocusable',
  'setParentWindow',
  'getParentWindow',
  'getChildWindows',
  'setAutoHideCursor',
  'selectPreviousTab',
  'selectNextTab',
  'mergeAllWindows',
  'moveTabToNewWindow',
  'toggleTabBar',
  'addTabbedWindow',
  'setVibrancy',
  'setTrafficLightPosition',
  'getTrafficLightPosition',
  'setTouchBar',
  'setBrowserView',
  'getBrowserView',
  'addBrowserView',
  'removeBrowserView',
  'setTopBrowserView',
  'getBrowserViews',
];

contextBridge.exposeInMainWorld('spectron', {
  process: {
    getProperties: () => ipcRenderer.invoke('spectron.process.getProperties'),
    getFunctionNames: () => ipcRenderer.invoke('spectron.process.getFunctionNames'),
    invoke: (funcName, ...args) => ipcRenderer.invoke('spectron.process.invoke', funcName, ...args),
  },
  app: {
    getFunctionNames: () => ipcRenderer.invoke('spectron.app.getFunctionNames'),
    invoke: (funcName, ...args) => ipcRenderer.invoke('spectron.app.invoke', funcName, ...args),
  },
  browserWindow: {
    // using a ridiculous hardcoded array of func names until spectron.browserWindow.getFunctionNames can return what we need
    getFunctionNames: async () => browserWindowInstanceMethods,
    invoke: (funcName, ...args) => ipcRenderer.invoke('spectron.browserWindow.invoke', funcName, ...args),
  },
  webContents: {
    getFunctionNames: () => ipcRenderer.invoke('spectron.webContents.getFunctionNames'),
    invoke: (funcName, ...args) => ipcRenderer.invoke('spectron.webContents.invoke', funcName, ...args),
  },
});
