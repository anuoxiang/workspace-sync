import { Command, OptionValues } from 'commander';
import * as path from 'path';
import * as os from 'os';
import {
  IDirAndGit,
  IGitInfo,
  IWorkspace,
} from '../interfaces';
import {
  FileStorage,
  getGitRepoInfo,
  MockapiStorage,
} from '../common';
import { Config } from '../configs';
import { getSubDirctories } from '../common';

export class PickupCommand {
  /**
   * 排除模式
   */
  exclude: string[] = [];
  /**
   * 最大递归深度
   */
  maxLevel: number = -1;

  files = new FileStorage();
  mockapi = new MockapiStorage();

  public load(program: Command): void {
    program
      .command('pickup [path-to-workspace]')
      .alias('p')
      .description('Pickup a directory.')
      .option(
        '-e, --exclude <pattern...>',
        'Exclude files(dirs) of syncs.',
      )
      .option(
        '-m, --max-depth <max-depth>',
        'Max depth of directories to detect.',
      )
      .action(
        (
          pathToWorkspace: string = './',
          options: OptionValues,
        ) => {
          this.exclude = options.exclude || [];
          this.recursion({ path: pathToWorkspace }).then(
            (results) => {
              if (results?.subs || results) {
                // results 处理为 Iworkspace 对象
                const workspace: IWorkspace = {
                  path: path.resolve(pathToWorkspace),
                  date: new Date(),
                  hostname: os.hostname(),
                  repos: results?.subs || [results],
                  exclude: options.exclude,
                };
                // console.log(JSON.stringify(results));
                this.files.write(
                  Config.DEFAULT_PROFILE,
                  workspace,
                );
                console.log(
                  `Save ${path.resolve(
                    pathToWorkspace,
                  )} to ${Config.DEFAULT_PROFILE}`,
                );
              } else {
                // 没有收货
                console.log('No git repo found.');
              }
            },
          );
        },
      );
  }

  /**
   * 递归检测
   * @param root 根目录
   * @param level 层级
   * @returns 配置
   */
  async recursion(
    root: IDirAndGit,
    level: number = 0,
  ): Promise<IDirAndGit | null> {
    // 先看送来的目录有没有Git仓库，如果有，则赋予Git内容，且不再检查子目录
    const iRemote = await getGitRepoInfo(
      path.resolve(root.path),
    );
    if (!iRemote) {
      // 继续深挖
      const dirs = getSubDirctories(
        root.path,
        this.exclude,
      );

      const subs: IDirAndGit[] = [];
      for (let dir of dirs) {
        const sub: IDirAndGit = {
          path: path.join(root.path, dir.name),
        };
        if (this.maxLevel < 0 || this.maxLevel > level) {
          const _r = await this.recursion(sub, level + 1);
          if (_r) subs.push(_r);
        }
      }
      if (subs.length > 0) root.subs = subs;
    } else {
      root.git = iRemote;
    }
    if (!root.git && !root.subs) return null;
    else return root;
  }
}
