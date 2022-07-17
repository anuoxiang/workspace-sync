import { AbstractAction } from '.';
import axios from 'axios';
import type { AxiosError } from 'axios';
import {
  IActionParams,
  IDirAndGit,
  IWorkspace,
} from '../interfaces';

// https://62d366beafb0b03fc5b2a55f.mockapi.io/wss

export class UploadToMockApiAction extends AbstractAction {
  public async handle(
    params: IActionParams,
    result?: IWorkspace,
  ): Promise<void> {
    // throw new Error('Method not implemented.');
    // console.log(params);
    if (
      params.options?.api &&
      result &&
      !params.options?.dry
    )
      await this.saveData(params.options.api, result);

    if (
      params.options?.api &&
      result &&
      params.options?.dry
    ) {
      await this.getData(params.options.api);
    }
  }

  public async getData(
    url: string,
  ): Promise<IDirAndGit | null> {
    const response = await axios.get(url);
    // 找到
    console.log(response.data);
    return null;
  }

  /**
   * 上传到云端
   * @param result Git信息
   * @returns 保存完成
   */
  public async saveData(
    url: string,
    result: IWorkspace,
  ): Promise<boolean> {
    console.log('save to url:', url);
    try {
      const response = await axios.post(url, result);
      // console.log(response.data);
      console.log('saved');
      return true;
    } catch (err) {
      console.log((err as AxiosError).code);
      return false;
    }
  }
}
