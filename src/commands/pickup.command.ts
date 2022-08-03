import { Command, OptionValues } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import * as sGit from 'simple-git';
import * as os from 'os';
import {
  IDirAndGit,
  IGitInfo,
  IGitRemote,
  IWorkspace,
} from '../interfaces';
import { FileStorage, MockapiStorage } from '../common';
import { Config } from '../configs';

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
        (pathToWorkspace: string = './', options: OptionValues) => {
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
                };
                // console.log(JSON.stringify(results));
                this.files.write(Config.DEFAULT_PROFILE, workspace);
                console.log(
                  `Save ${path.resolve(pathToWorkspace)} to ${
                    Config.DEFAULT_PROFILE
                  }`,
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
    const iRemote = await this.hasGitReo(path.resolve(root.path));
    if (!iRemote) {
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
            this.exclude.findIndex((reg) =>
              new RegExp(reg).test(file.name),
            ) < 0,
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

  /**
   * 检测目录是否有仓库信息
   * @param dirPath 目录路径
   * @returns 仓库配置
   */
  async hasGitReo(dirPath: string): Promise<IGitInfo | null> {
    // console.log(`check ${dirPath}`);
    const git: sGit.SimpleGit = sGit.simpleGit(dirPath);
    try {
      const remotes = (await git.getRemotes(true)) as IGitRemote[];
      const t = await git.revparse(['--abbrev-ref', 'HEAD']);
      const result: IGitInfo = {
        remotes,
        branch: t,
      };
      result.branch = t;
      // console.log(t);

      // console.log(`${result}`);
      return remotes && remotes.length > 0 ? result : null;
    } catch (err) {
      // console.log(`not a git repo.`);
      return null;
    }
  }
}
