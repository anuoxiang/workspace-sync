import { IDirAndGit } from './dir-and-git.interface';

/**
 * 工作目录数据
 */
export interface IWorkspace {
  /**
   * 记录编号
   */
  id?: number;
  /**
   * 路径
   */
  path: string;
  /**
   * 生成日期
   */
  date: Date;
  /**
   * 主机名
   */
  hostname: string;
  /**
   * 子集仓库
   */
  repos: IDirAndGit[];
}
