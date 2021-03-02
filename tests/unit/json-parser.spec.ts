import JSONParser from '../../src/json-parser';

describe('JSON Parser', () => {
  test.each([
    [''],
    ['4'],
    ["{ a: 12, b: }"],
  ])('throw when passing %p as value', (val) => {
    expect(() => JSONParser(val)).toThrowError('Invalid JSON structure');
  });

  test.each([
    [
      {
        actions: [
          {
            name: 'list directory contents',
            description: 'returns the contents of a directory',
            command: 'ls',
          },
        ],
      }
    ],
    [
      {
        actions: [
          {
            name: 'list directory contents',
            description: 'returns the contents of a directory',
            command: 'ls',
          },
          {
            name: 'list directory contents (with hidden items)',
            description: 'returns the contents of a directory, including hidden items',
            command: 'ls -a',
          },
        ],
      }
    ],
    [
      {
        actions: [
          {
            name: 'list directory contents',
            description: 'returns the contents of a directory',
            command: 'ls',
          },
        ],
        output: {
          timestamp: false,
          logfile: '/tmp/log.file'
        }
      }
    ],
  ])('parse actions', (val) => {
    expect(() => JSONParser(JSON.stringify(val))).not.toThrow();
  });
});
