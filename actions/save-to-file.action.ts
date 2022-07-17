import { AbstractAction } from '.';

import * as path from 'path';
import * as fs from 'fs';
import { IActionParams } from '../interfaces';

export class SaveToFileAction extends AbstractAction {
  public async handle(
    params: IActionParams,
    result?: any,
  ): Promise<void> {
    // console.log('ok here', params, result);
    if (params.options?.output) {
      this.writeJSONFile(
        JSON.stringify(result),
        params.options.output,
      );
    }
    this.next(params, result);
  }

  writeJSONFile(json: string, filePath?: string): void {
    if (filePath) {
      filePath = path.resolve(filePath);
      if (filePath.indexOf('.json') < 0)
        filePath = path.join(filePath, 'wss.json');
    } else {
      filePath = path.join(__dirname, 'wss.json');
    }
    console.log('write to', filePath);
    fs.writeFileSync(filePath, json, { encoding: 'utf8' });
  }
}
