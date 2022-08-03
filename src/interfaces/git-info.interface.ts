/**
 * Git远程仓库信息
 */
export interface IGitRemote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
  branch: string;
}

export interface IGitInfo {
  remotes: IGitRemote[];
  branch: string;
}
