const { contextBridge, ipcRenderer } = require('electron');
const process = require('process');

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
  electronRequire: require,
  process: {
    getVersions: () => {
      if (process.versions) {
        return process.versions.electron;
      }
    },
  },
  browserWindow: {
    // using a ridiculous hardcoded array of func names until spectron.getCurrentWindowFunctionNames can return what we need
    getFunctionNames: async () => Promise.resolve(browserWindowInstanceMethods),
    invoke: async (funcName, ...args) => await ipcRenderer.invoke('spectron.invokeCurrentWindow', funcName, ...args),
  },
  webContents: {
    getFunctionNames: async () => await ipcRenderer.invoke('spectron.getCurrentWebContentsFunctionNames'),
    invoke: async (funcName, ...args) =>
      await ipcRenderer.invoke('spectron.invokeCurrentWebContents', funcName, ...args),
  },
});
