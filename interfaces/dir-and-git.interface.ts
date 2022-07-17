import { IGitRemote } from './git-info.interface';

/**
 * 目录与Git仓库
 */
export interface IDirAndGit {
  /**
   * 目录路径
   */
  path: string;
  /**
   * Git仓库
   */
  git?: IGitRemote[];
  /**
   * 子目录
   */
  subs?: IDirAndGit[];
}
