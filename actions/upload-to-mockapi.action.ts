import { AbstractAction } from '.';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { IActionParams, IDirAndGit } from '../interfaces';

// https://62d366beafb0b03fc5b2a55f.mockapi.io/wss

export class UploadToMockApiAction extends AbstractAction {
  public async handle(
    params: IActionParams,
    result?: any,
  ): Promise<void> {
    // throw new Error('Method not implemented.');
    console.log(params);
    if (params.options?.api)
      await this.saveData(params.options.api, result);
  }

  public async getData(): Promise<IDirAndGit | null> {
    return null;
  }

  /**
   * 上传到云端
   * @param result Git信息
   * @returns 保存完成
   */
  public async saveData(
    url: string,
    result: IDirAndGit,
  ): Promise<boolean> {
    console.log('api', url);
    try {
      const response = await axios.post(url, result);
      console.log(response.data);
      return true;
    } catch (err) {
      console.log((err as AxiosError).code);
      return false;
    }
  }
}
