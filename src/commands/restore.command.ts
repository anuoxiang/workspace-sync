import { Command, OptionValues } from 'commander';
import { IDirAndGit, IWorkspace } from 'src/interfaces';
import { FileStorage } from '../common';
import { getSubDirctories } from '../common/utils';
import { Config } from '../configs';
import * as path from 'path';
/**
 * 将配置文件还原到目录中
 */
export class RestoreCommand {
  file: FileStorage = new FileStorage();
  public load(program: Command): void {
    program
      .command('restore [path-to-workspace]')
      .alias('r')
      .description('Restore from profile.')
      .option(
        '-d,--delete',
        'Delete the files which not exist in profile.',
      )
      .action(
        async (
          pathToWorkspace: string = './',
          options: OptionValues,
        ) => {
          console.log('restore', options);
          const profile: IWorkspace = await this.file.read(
            Config.DEFAULT_PROFILE,
          );
          this.recursion(
            pathToWorkspace,
            profile.repos,
            options.delete,
            profile.exclude,
          );
          // console.log(profile.hostname);
        },
      );
  }

  /**
   * 递归检测
   * @param root 根目录
   * @returns 配置
   */
  public async recursion(
    pathToWorkspace: string,
    subs: IDirAndGit[],
    delNotExist: boolean = false,
    exclude: string[] = [],
  ): Promise<void> {
    // 每层目录分为三个部分：
    // 1. 目录和配置中都存在；         => 比对repo是否一致，不一致的，增加源，一致的，跳过
    // 2. 当前目录存在、配置不存在；    => 根据delNotExist决定是否删除相关目录
    // 3. 当前目录不存在、配置存在；    => 增加Repo

    // 读取当前目录，检测所有目录与配置中是否一致，如果需要删除，则将多余部分删除
    const dirs = getSubDirctories(
      path.resolve(pathToWorkspace),
    );

    // 1.
    const exists = dirs.filter(
      (dir) =>
        // 判断依据不可以是绝对路径，而是相对路径，考虑到可能会更换位置
        subs.findIndex((sub) => sub.path === dir.name) >= 0,
    );

    // 2.
    if (delNotExist) {
      // 如果需要删除多余的部分
      const notExist = dirs.filter(
        (dir) =>
          // 判断依据不可以是绝对路径，而是相对路径，考虑到可能会更换位置
          subs.findIndex((sub) => sub.path === dir.name) <
          0,
      );
    }

    // 3.
    const adds = subs.filter((sub) => {
      dirs.findIndex((dir) => sub.path === dir.name) < 0;
    });
  }
}
