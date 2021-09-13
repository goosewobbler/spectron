import path from 'path';
import getFilePath from '../src/getFilePath';

describe('getFilePath', () => {
  let basePath = '';
  let defaultFilename = '';

  beforeAll(() => {
    basePath = process.cwd();
    defaultFilename = 'selenium-standalone.txt';
  });

  it('should handle dir "./"', () => {
    const dir = './';
    const expectedPath = path.resolve(path.join(basePath, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "/"', () => {
    const dir = '/';
    const expectedPath = path.resolve(path.join(dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "./log"', () => {
    const dir = './log';
    const expectedPath = path.resolve(path.join(basePath, dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "/log', () => {
    const dir = '/log';
    const expectedPath = path.resolve(path.join(dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "./log/"', () => {
    const dir = './log/';
    const expectedPath = path.resolve(path.join(basePath, dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "/log/', () => {
    const dir = '/log/';
    const expectedPath = path.resolve(path.join(dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "./log/selenium"', () => {
    const dir = './log/selenium';
    const expectedPath = path.resolve(path.join(basePath, dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "log"', () => {
    const dir = 'log';
    const expectedPath = path.resolve(path.join(basePath, dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle dir "/log/selenium', () => {
    const dir = '/log/selenium';
    const expectedPath = path.resolve(path.join(dir, defaultFilename));
    const filePath = getFilePath(dir, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file ".log"', () => {
    const file = '.log';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "./.log"', () => {
    const file = './.log';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "./log/.log"', () => {
    const file = './log/.log';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "./selenium-log.txt"', () => {
    const file = './selenium-log.txt';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "selenium-log.txt"', () => {
    const file = 'selenium-log.txt';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "/selenium-log.txt', () => {
    const file = '/selenium-log.txt';
    const expectedPath = path.resolve(file);
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "./log/selenium-log.txt"', () => {
    const file = './log/selenium-log.txt';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "log/selenium-log.txt"', () => {
    const file = 'log/selenium-log.txt';
    const expectedPath = path.resolve(path.join(basePath, file));
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });

  it('should handle file "/log/selenium-log.txt', () => {
    const file = '/log/selenium-log.txt';
    const expectedPath = path.resolve(file);
    const filePath = getFilePath(file, defaultFilename);

    expect(filePath).toBe(expectedPath);
  });
});
