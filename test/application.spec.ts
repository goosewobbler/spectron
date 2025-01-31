import { initSpectron } from '@goosewobbler/spectron';
import { SpectronApp } from '~/common/types';

describe('application loading', () => {
  let app: SpectronApp;

  before(async () => {
    app = await initSpectron();
  });

  describe('App', () => {
    it('should launch the application', async () => {
      const response = await app.client.getWindowHandles();
      expect(response.length).toEqual(1);

      const { width, height } = (await app.browserWindow.getBounds()) as { width: number; height: number };
      expect(width).toEqual(200);
      expect(height).toEqual(300);
      await app.client.waitUntilTextExists('html', 'Hello');
      const title = await app.client.getTitle();
      expect(title).toEqual('Test');
    });

    it('should pass args through to the launched application', async () => {
      // custom args are set in the spectron.conf.js file as they need to be set before WDIO starts
      const argv = await app.mainProcess.argv();
      expect(argv).toContain('--foo');
      expect(argv).toContain('--bar=baz');
    });
  });
});

// it('passes through env to the launched app', async function () {
//   const env = await app.rendererProcess.env();
//   if (process.platform === 'win32') {
//     assert.strictEqual(env.foo, 'BAR');
//     assert.strictEqual(env.hello, 'WORLD');
//   } else {
//     assert.strictEqual(env.FOO, 'BAR');
//     assert.strictEqual(env.HELLO, 'WORLD');
//   }
// });

// it('passes through cwd to the launched app', async function () {
//   const cwd = app.mainProcess.cwd();
//   await cwd.should.eventually.equal(path.join(__dirname, 'fixtures'));
// });
