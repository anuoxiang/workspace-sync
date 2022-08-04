import { RestoreCommand } from 'src/commands';
import * as path from 'path';
import * as fs from 'fs';
import { removeDir } from 'src/common';

describe('Restore', () => {
  let restore: RestoreCommand;
  beforeAll(() => {
    restore = new RestoreCommand();
  });
  it('Delete dir that not empty.', () => {
    fs.mkdirSync(path.resolve('./test'));
    fs.mkdirSync(path.resolve('./test/test2'));
    expect(
      removeDir(path.resolve('./test')),
    ).toBeUndefined();
  });

  it('Releative path', () => {
    restore.recursion(
      '../',
      [
        {
          path: '../',
          subs: [{ path: '' }],
        },
      ],
      false,
    );
  });
});
