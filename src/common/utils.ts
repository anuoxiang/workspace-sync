import { Dirent } from 'fs';
import * as fs from 'fs';
import { IGitInfo, IGitRemote } from 'src/interfaces';
import * as sGit from 'simple-git';

/**
 * 工具库
 */

/**
 * 读文件夹
 * @param pathToRead 读取路径
 * @param exclude 排除模板
 * @returns 子目录
 */
export function getSubDirctories(
  pathToRead: string,
  exclude: string[] = [],
): Dirent[] {
  const dirs = fs
    .readdirSync(pathToRead, {
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
  return dirs;
}

/**
 * 检测目录是否有仓库信息
 * @param pathToRead 目录路径
 * @returns 仓库配置
 */
export async function getGitRepoInfo(
  pathToRead: string,
): Promise<IGitInfo | null> {
  // console.log(`check ${dirPath}`);
  const git: sGit.SimpleGit = sGit.simpleGit(pathToRead);
  try {
    const remotes = (await git.getRemotes(
      true,
    )) as IGitRemote[];
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

/**
 * 为目录添加远程仓库
 * @param pathToRepo 仓库路径
 * @param name 远程名称
 * @param fetch 取地址
 * @param push 推地址
 */
export async function addRemote(
  pathToRepo: string,
  name: string,
  fetch: string,
  push: string,
): Promise<void> {}

export function removeDir(pathToRemove: string): void {
  try {
    fs.rmSync(pathToRemove, { recursive: true });
    return;
  } catch (err) {
    console.error(err);
  }
}
