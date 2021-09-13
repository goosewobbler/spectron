/* eslint no-underscore-dangle: "off" */
import path from 'path';
import fs from 'fs-extra';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import ChromeDriverLauncher, { Capabilities, Config, Options } from '../src/launcher';

type Stream = {
  pipe?: jest.Mock;
  on?: jest.Mock;
};

jest.mock('child_process', () => {
  const stream: Stream = {};
  stream.pipe = jest.fn().mockReturnValue(stream);
  stream.on = jest.fn().mockReturnValue(stream);
  return {
    spawn: jest.fn().mockReturnValue({
      stdout: stream,
      stderr: stream,
      kill: jest.fn(),
    }),
  };
});

let config: Config;
let options: Options;
let capabilities: Capabilities;

describe('ChromeDriverLauncher launcher', () => {
  beforeEach(() => {
    config = {
      outputDir: '/',
    };
    options = {};
    capabilities = [
      {
        'browserName': 'chrome',
        'goog:chromeOptions': { binary: '/blah/chrome', args: ['arg1', 'arg2'], windowTypes: ['app', 'webview'] },
      },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onPrepare', () => {
    it('should set correct starting options', async () => {
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      const mockCalls = (spawn as jest.Mock).mock.calls;
      expect(mockCalls[0]).toEqual(['/some/local/chromedriver/path', ['--port=9515', '--url-base=/']]);
    });

    it('should fallback to global chromedriver', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect((spawn as jest.Mock).mock.calls[0]).toEqual(['chromedriver', ['--port=9515', '--url-base=/']]);
    });

    it('should set (and overwrite config.outputDir) outputDir when passed in the options', async () => {
      options.outputDir = 'options-outputdir';
      config.outputDir = 'config-outputdir';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher.outputDir).toEqual('options-outputdir');
    });

    it('should set correct config properties', async () => {
      config.outputDir = 'dummy';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher.outputDir).toEqual('dummy');
    });

    it('should set correct port and path', async () => {
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher.args).toEqual(['--port=9515', '--url-base=/']);
    });

    it('should set correct args', async () => {
      options.args = ['--silent'];
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher.args).toEqual(['--silent', '--port=9515', '--url-base=/']);
    });

    it('should throw if the argument "--port" is passed', async () => {
      options.args = ['--port=9616'];
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await expect(Launcher.onPrepare()).rejects.toThrow(new Error('Argument "--port" already exists'));
    });

    it('should throw if the argument "--url-base" is passed', async () => {
      options.args = ['--url-base=/dummy'];
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await expect(Launcher.onPrepare()).rejects.toThrow(new Error('Argument "--url-base" already exists'));
    });

    it('should not output the log file', async () => {
      options.outputDir = undefined;
      config.outputDir = '';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher._redirectLogStream).not.toHaveBeenCalled();
    });

    it('should output the log file when an output directory is specified', async () => {
      options.outputDir = 'dummy';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      expect(Launcher._redirectLogStream).toHaveBeenCalled();
    });
  });

  describe('onComplete', () => {
    it('should call ChromeDriver.stop', async () => {
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();

      await Launcher.onPrepare();

      Launcher.onComplete();

      expect((Launcher.process as ChildProcessWithoutNullStreams).kill).toHaveBeenCalled();
    });

    it('should not call process.kill', () => {
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher.onComplete();

      expect(Launcher.process).toBeFalsy();
    });
  });

  describe('_redirectLogStream', () => {
    it('should write output to file', async () => {
      config.outputDir = 'dummy';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);

      await Launcher.onPrepare();

      expect((fs.createWriteStream as jest.Mock).mock.calls[0]).toEqual([
        path.join(process.cwd(), 'dummy', 'wdio-chromedriver.log'),
        { flags: 'w' },
      ]);
      const launcherProcess = Launcher.process as ChildProcessWithoutNullStreams;
      expect(launcherProcess.stdout.pipe).toHaveBeenCalled();
      expect(launcherProcess.stderr.pipe).toHaveBeenCalled();
    });
  });

  describe('custom chromedriver path', () => {
    it('should select custom chromedriver path "chromedriver.exe"', async () => {
      options.chromedriverCustomPath = 'chromedriver.exe';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();
      await Launcher.onPrepare();
      expect(Launcher.chromedriverCustomPath).toEqual(path.resolve(options.chromedriverCustomPath));
    });

    it('should select custom chromedriver path "c:\\chromedriver.exe"', async () => {
      options.chromedriverCustomPath = 'c:\\chromedriver.exe';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();
      await Launcher.onPrepare();
      expect(Launcher.chromedriverCustomPath).toEqual(path.resolve(options.chromedriverCustomPath));
    });

    it('should select custom chromedriver path "./chromedriver.exe"', async () => {
      options.chromedriverCustomPath = './chromedriver.exe';
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();
      await Launcher.onPrepare();
      expect(Launcher.chromedriverCustomPath).toEqual(path.resolve(options.chromedriverCustomPath));
    });

    it('should select default chromedriver path if no custom path provided"', async () => {
      options.chromedriverCustomPath = undefined;
      const Launcher = new ChromeDriverLauncher(options, capabilities, config);
      Launcher._redirectLogStream = jest.fn();
      await Launcher.onPrepare();
      expect(Launcher.chromedriverCustomPath).toBeDefined();
    });
  });
});
