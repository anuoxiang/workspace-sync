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
    // 读取本地指定内容
    let localProfile = await this.files.read(
      Config.DEFAULT_PROFILE,
    );

    // 读取远端所有内容
    const allResults = await this.mockapi.findAll(url);

    // 选取主机和目录指定内容
    let remoteProfile = allResults.find(
      (r) =>
        r.hostname === localProfile.hostname &&
        r.path === localProfile.path,
    );

    // 排除明显错误
    if (direction === 'upload' && !localProfile)
      throw new Error(
        'Upload but local profile file not exist.',
      );
    if (direction === 'download' && !remoteProfile)
      throw new Error(
        'Download but remote profile file not exist.',
      );

    /**
     * 单纯的下载或者上传
     * 即目标文件不存在的合并操作
     * 无所谓是否一致，不需要在意冲突的解决和比对要素
     */
    if (direction === 'upload' && !remoteProfile) {
      this.mockapi.write(url, localProfile);
      return;
    } else if (direction === 'download' && !localProfile) {
      delete remoteProfile.id;
      this.files.write(
        Config.DEFAULT_PROFILE,
        remoteProfile,
      );
      return;
    }
    // 如果是“覆盖”操作，并且文件存在
    // 因为上面两个条件已经判断不存在目标配置文件，到这里说明文件均
    // 覆盖操作是更新日期，以及repos信息，不涉及path，考虑相对路径
    // 可以被更换
    else if (conflictResolve === 'overwrite') {
      if (direction === 'upload') {
        remoteProfile.repos = localProfile.repos;
        remoteProfile.date = new Date();
        await this.mockapi.write(url, remoteProfile);
      } else {
        localProfile.repos = remoteProfile.repos;
        localProfile.date = remoteProfile.date;
        await this.files.write(
          Config.DEFAULT_PROFILE,
          localProfile,
        );
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
      return this.mergeWithDirectory(
        source,
        target,
        conflictResolve,
      );
    else
      return this.mergeWithRepo(
        source,
        target,
        conflictResolve,
      );
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
