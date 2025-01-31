/* eslint import/no-extraneous-dependencies: off */
import { Browser } from 'webdriverio';

export interface LooseObject {
  [key: string]: Record<string, unknown>;
}

export interface SpectronClient extends Browser<'async'> {
  /**
   * Exit the electron application
   */
  exitElectronApp(): Promise<void>;
  /**
   * Wait until the window is no longer loading.
   * Takes an optional timeout in milliseconds that defaults to 5000.
   */
  waitUntilWindowLoaded(timeout?: number): Promise<void>;

  /**
   * Wait until the element matching the given selector contains the given text.
   * Takes an optional timeout in milliseconds that defaults to 5000.
   */
  waitUntilTextExists(selector: string, text: string, timeout?: number): Promise<void>;

  /**
   * Gets the number of open windows. <webview> tags are also counted as separate windows.
   */
  getWindowCount(): Promise<number>;
  /**
   * Focus a window using its index from the windowHandles() array.
   * <webview> tags can also be focused as a separate window.
   */
  windowByIndex(index: number): Promise<void>;
  /**
   * Get the selected text in the current window.
   */
  getSelectedText(): Promise<string>;
}

export interface SpectronWindow {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface SpectronWebContents {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface SpectronElectronApp {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface SpectronMainProcess {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface SpectronRendererProcess {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface SpectronApp {
  client: SpectronClient;
  browserWindow: SpectronWindow;
  webContents: SpectronWebContents;
  app: SpectronElectronApp;
  electronApp: SpectronElectronApp;
  mainProcess: SpectronMainProcess;
  rendererProcess: SpectronRendererProcess;
}
