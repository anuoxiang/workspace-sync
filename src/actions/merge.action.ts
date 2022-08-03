export type ConflictResolve =
  | 'source'
  | 'target'
  | 'overwrite'
  | 'stop';
export type ConflictJudge = 'directory' | 'repo';
export type Direction = 'upload' | 'download';
import { Config } from '../configs';
import { IDirAndGit, IWorkspace } from '../interfaces';
import { FileStorage, MockapiStorage } from '../common';

export class MergeAction {
  files = new FileStorage();
  mockapi = new MockapiStorage();
  public async handle(
    url: string,
    direction: Direction,
    conflictResolve: ConflictResolve = 'source',
    conflictJudge: ConflictJudge = 'repo',
  ): Promise<void> {
    console.log(url, direction, conflictResolve, conflictJudge);
    // 读取本地指定内容
    let localProfile = await this.files.read(Config.DEFAULT_PROFILE);

    if (!localProfile) throw new Error('缺少本地配置');

    // 单纯的上传覆盖
    if (direction === 'upload' && conflictResolve === 'overwrite') {
      this.mockapi.write(url, localProfile);
      return;
    }

    // 读取远端所有内容
    const allResults = await this.mockapi.findAll(url);

    // 选取主机和目录指定内容
    let remoteProfile = allResults.find(
      (r) =>
        r.hostname === localProfile.hostname &&
        r.path === localProfile.path,
    );
    // 如果缺少，需要提示缺少必要信息
    if (!remoteProfile) throw new Error('缺少远端配置');

    // 如果知识覆盖，没有特别的算法，只需要覆盖即可
    if (conflictResolve === 'overwrite') {
      if (direction === 'upload') {
        remoteProfile.repos = localProfile.repos;
        this.mockapi.write(url, remoteProfile);
      } else {
        localProfile.repos = remoteProfile.repos;
        this.files.write(Config.DEFAULT_PROFILE, localProfile);
      }
      return;
    }

    // 根据合并的方向处理
    // const result = this.merge(
    //   direction === 'download'
    //     ? remoteProfile.repos
    //     : localProfile.repos,
    //   direction === 'upload'
    //     ? remoteProfile.repos
    //     : localProfile.repos,
    //   conflictResolve,
    //   conflictJudge,
    // );

    // 保存文件
    throw new Error('还没写完');
  }

  /**
   * 合并核心算法
   * 对比下，可以忽略结构的不同，但是必须保持
   */
  public merge(
    source: IDirAndGit[],
    target: IDirAndGit[],
    conflictResolve: ConflictResolve,
    conflictJudge: ConflictJudge,
  ): IDirAndGit[] {
    if (conflictJudge === 'directory')
      return this.mergeWithDirectory(source, target, conflictResolve);
    else return this.mergeWithRepo(source, target, conflictResolve);
  }

  /**
   * 目录优先的合并判定算法
   * @param source 来源
   * @param target 目标
   * @param conflictResolve 冲突处理原则
   * @returns 合并结果
   */
  public mergeWithDirectory(
    source: IDirAndGit[],
    target: IDirAndGit[],
    conflictResolve: ConflictResolve,
  ): IDirAndGit[] {
    // 保持结构，不存在的补充上，多余的并不删除（如果多余的删除则属于覆盖逻辑）
    for (let dir of source) {
    }
    return [];
  }

  /**
   * 仓库优先的判定算法
   * @param source 来源
   * @param target 目标
   * @param conflictResolve 冲突处理原则
   * @returns 合并结果
   */
  public mergeWithRepo(
    source: IDirAndGit[],
    target: IDirAndGit[],
    conflictResolve: ConflictResolve,
  ): IDirAndGit[] {
    return [];
  }
}
