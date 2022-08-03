import { IGitInfo, IGitRemote } from './git-info.interface';

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
  git?: IGitInfo;
  /**
   * 子目录
   */
  subs?: IDirAndGit[];
}
