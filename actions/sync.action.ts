import { AbstractAction } from '.';
import { Input } from '../commands';
import * as path from 'path';
import * as fs from 'fs';
import * as sGit from 'simple-git';

interface IGitRemote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

/**
 * 目录与Git仓库
 */
interface IDirAndGit {
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

export class SyncAction extends AbstractAction {
  // constructor() {
  //   super();
  // }
  public async handle(
    inputs: Input[],
    options?: Input[] | undefined,
    extraFlags?: string[] | undefined,
  ): Promise<void> {
    // exec
    this.recursion(
      { path: this.getRootPath(inputs) },
      this.getExcludes(options),
    ).then((results) => {
      console.log(results);
    });
    return;
  }

  getRootPath(inputs: Input[]): string {
    const i = inputs.findIndex(
      (input) => input.name === 'path',
    );
    if (i < 0) throw new Error('Must have a path');
    return inputs[i].value.toString();
  }

  getExcludes(options?: Input[]): string[] {
    if (!options) return [];
    const i = options.findIndex(
      (option) => option.name === 'exclude',
    );
    if (i < 0) return [];
    else return options[i].value as string[];
  }

  /**
   *
   * @param root 根目录
   * @returns 目录中是否有Git
   */
  async recursion(
    root: IDirAndGit,
    exclude: string[] = [],
  ): Promise<IDirAndGit> {
    // 先看送来的目录有没有Git仓库，如果有，则赋予Git内容，且不再检查子目录
    const iRemote = await this.hasGitReo(
      path.resolve(root.path),
    );
    console.log(root.path);
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
        subs.push(await this.recursion(sub));
      }
      root.subs = subs;
    } else {
      root.git = iRemote;
    }

    return root;
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
