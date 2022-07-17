import { AbstractAction } from '.';
import * as path from 'path';
import * as fs from 'fs';
import * as sGit from 'simple-git';
import {
  IActionParams,
  IDirAndGit,
  IGitRemote,
} from '../interfaces';

/**
 * 导出行为处理
 * 将目录的内容输出为JSON
 */
export class ExportAction extends AbstractAction {
  public async handle({
    inputs,
    options,
    extraFlags,
  }: IActionParams): Promise<void> {
    this.recursion(
      { path: inputs.path },
      options?.exclude || [],
    ).then((results) => {
      this.next(
        { inputs, options, extraFlags },
        results?.subs || results,
      );
    });
  }

  /**
   *
   * @param root 根目录
   * @returns 目录中是否有Git
   */
  async recursion(
    root: IDirAndGit,
    exclude: string[] = [],
  ): Promise<IDirAndGit | null> {
    // 先看送来的目录有没有Git仓库，如果有，则赋予Git内容，且不再检查子目录
    const iRemote = await this.hasGitReo(
      path.resolve(root.path),
    );
    if (!iRemote || iRemote.length === 0) {
      // 继续深挖
      const dirs = fs
        .readdirSync(root.path, {
          encoding: 'utf8',
          withFileTypes: true,
        })
        // 只保留目录
        .filter((file) => file.isDirectory())
        // 去掉隐藏目录
        .filter((file) => !file.name.startsWith('.'))
        // 去掉排除
        .filter(
          (file) =>
            exclude.findIndex((reg) =>
              new RegExp(reg).test(file.name),
            ) < 0,
        );
      const subs: IDirAndGit[] = [];
      for (let dir of dirs) {
        const sub: IDirAndGit = {
          path: path.join(root.path, dir.name),
        };
        const _r = await this.recursion(sub);
        if (_r) subs.push(_r);
      }
      if (subs.length > 0) root.subs = subs;
    } else {
      root.git = iRemote;
    }
    if (!root.git && !root.subs) return null;
    else return root;
  }

  /**
   * 检测目录是否有仓库信息
   * @param dirPath 目录路径
   * @returns 仓库配置
   */
  async hasGitReo(dirPath: string): Promise<IGitRemote[]> {
    const git: sGit.SimpleGit = sGit.simpleGit(dirPath);
    try {
      const result = (await git.getRemotes(
        true,
      )) as IGitRemote[];
      return result && result.length > 0 ? result : [];
    } catch (err) {
      return [];
    }
  }
}
