import { IWorkspace } from '../interfaces';
import { AbstractStroage } from './abstract.stroage';
import axios from 'axios';
import type { AxiosError } from 'axios';
/**
 * 基于MockAPI的读写保存
 * https://62d366beafb0b03fc5b2a55f.mockapi.io/wss
 */
export class MockapiStorage extends AbstractStroage {
  async delete(target: string): Promise<void> {
    await axios.delete(target);
  }

  async write(target: string, workspace: IWorkspace): Promise<void> {
    try {
      // 需要判断，是否远端已经存在同目录同主机的，区分新增（post）还是写入（put）
      const results = await this.findAll(target);
      const oldProfile = results.find(
        (p) =>
          p.hostname === workspace.hostname &&
          p.path === workspace.path,
      );
      if (oldProfile) {
        await this.overwrite(`${target}/${oldProfile.id}`, workspace);
      } else {
        const response = await axios.post(target, workspace);
      }
    } catch (err) {
      console.log((err as AxiosError).code);
    }
  }

  /**
   * 确定的覆盖操作
   * @param target 目标url包含id
   * @param workspace 配置文件
   */
  async overwrite(
    target: string,
    workspace: IWorkspace,
  ): Promise<void> {
    const response = await axios.put(target, workspace);
  }

  /**
   * 获取所有配置文件
   * 远程所特有
   * @param url 资源地址
   */
  async findAll(url: string): Promise<IWorkspace[]> {
    const response = await axios.get(url);
    const results =
      response.status == 200 ? (response.data as IWorkspace[]) : [];
    return results;
  }

  async read(target: string): Promise<IWorkspace> {
    const response = await axios.get(target);
    return response.status == 200
      ? (response.data as IWorkspace)
      : null;
  }
}
