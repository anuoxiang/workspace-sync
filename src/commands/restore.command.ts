import { Command } from 'commander';
import { FileStorage } from '../common';
import { Config } from '../configs';

/**
 * 将配置文件还原到目录中
 */
export class RestoreCommand {
  file: FileStorage = new FileStorage();
  public load(program: Command): void {
    program
      .command('restore')
      .alias('r')
      .description('Restore from profile.')
      .action(async () => {
        console.log('restore');
        const profile = await this.file.read(
          Config.DEFAULT_PROFILE,
        );
        console.log(profile.hostname);
      });
  }
}
