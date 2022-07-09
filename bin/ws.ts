import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import * as sGit from 'simple-git';

/**
 * 工作项目目录同步工具
 * @author Django 2022-07-09
 */

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

const program = new Command();
program
  .name('Workspace syncer')
  .description(
    'To backup your workspace which a mount of projects within git repostories.',
  )
  .version('0.0.1');

program
  // .command('sync')
  .description('Sync all project to remote')
  // .argument('<path>','The root of your workspace')
  .option(
    '-p, --path <path-to-workspace>',
    'The root of your workspace',
  );
// .option('-s,--supperman', 'not exist');

program.parse();
const options = program.opts();
console.log(options.path);
if (options.path) {
  recursion({ path: options.path }).then((results) => {
    console.log(results);
  });
}
// options.supperman

/**
 *
 * @param root 根目录
 * @returns 目录中是否有Git
 */
async function recursion(
  root: IDirAndGit,
): Promise<IDirAndGit> {
  // 先看送来的目录有没有Git仓库，如果有，则赋予Git内容，且不再检查子目录
  const iRemote = await hasGitReo(path.resolve(root.path));
  if (!iRemote || iRemote.length === 0) {
    // 继续深挖
    const dirs = fs
      .readdirSync(root.path, {
        encoding: 'utf8',
        withFileTypes: true,
      })
      .filter((file) => file.isDirectory())
      .filter((file) => !file.name.startsWith('.'));
    const subs: IDirAndGit[] = [];
    for (let dir of dirs) {
      const sub: IDirAndGit = {
        path: path.join(root.path, dir.name),
      };
      subs.push(await recursion(sub));
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
async function hasGitReo(
  dirPath: string,
): Promise<IGitRemote[]> {
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
