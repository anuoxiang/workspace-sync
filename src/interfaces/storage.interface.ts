import { IWorkspace } from './workspace.interface';

/**
 * 配置文件的存储接口
 */
export interface IStorage {
  /**
   * 写入配置文件
   */
  write(target: string, workspace: IWorkspace): void;
  /**
   * 读取单个配置
   * @param target 目标
   */
  read(target: string): Promise<IWorkspace>;
  /**
   * 删除目标
   * @param target 目标
   */
  delete(target: string): void;
}
