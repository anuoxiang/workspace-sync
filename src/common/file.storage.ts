import { IWorkspace } from '../interfaces';
import { AbstractStroage } from './abstract.stroage';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 基于文件读写
 */
export class FileStorage extends AbstractStroage {
  delete(target: string, workspace?: IWorkspace | undefined): void {
    fs.unlinkSync(path.resolve(target));
  }
  write(target: string, workspace: IWorkspace): void {
    fs.writeFileSync(
      path.resolve(target),
      JSON.stringify(workspace),
      {
        encoding: 'utf8',
      },
    );
  }
  async read(target: string): Promise<IWorkspace> {
    const json = fs.readFileSync(target, { encoding: 'utf8' });
    return json ? (JSON.parse(json) as IWorkspace) : null;
  }
}
